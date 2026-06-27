---
id: weekly-opensearch-backup
title: Schedule Weekly OpenSearch Backups Using the FormKiQ CLI
sidebar_position: 4
sidebar_label: Weekly OpenSearch Backup
slug: /tutorials/formkiq-cli/weekly-opensearch-backup
description: Tutorial structure for scheduling weekly OpenSearch snapshot backups with the FormKiQ CLI.
tags:
  - tutorial
  - formkiq
  - cli
  - opensearch
  - backup
---

# Schedule Weekly OpenSearch Backups Using the FormKiQ CLI

## What You Will Build

This tutorial outlines how to run a weekly OpenSearch snapshot backup using the [FormKiQ CLI](/docs/formkiq-modules/modules/formkiq-cli).

The scheduled workflow uses:

- The FormKiQ CLI `--opensearch --backup` command.
- AWS CodeBuild as the short-lived runtime for the CLI.
- Amazon EventBridge Scheduler to start the backup once per week.
- An IAM role that lets the CLI discover the FormKiQ deployment and call the IAM-authenticated FormKiQ API.

At the end of the tutorial, you will have a weekly scheduled job that creates snapshots with date-based names such as `weekly-default-2026-06-26`.

## Before You Begin

Confirm you have:

- A FormKiQ Advanced or Enterprise deployment with the OpenSearch module installed.
- OpenSearch snapshot support enabled for the deployment.
- A FormKiQ CLI Linux release asset URL from the [FormKiQ CLI releases page](https://github.com/formkiq/formkiq-cli/releases).
- AWS CLI access to the AWS account and Region where FormKiQ is deployed.
- Permission to create IAM roles, IAM policies, CodeBuild projects, EventBridge schedules, and CloudWatch Logs.
- The FormKiQ `AppEnvironment`, AWS Region, and site ID to back up.

:::note
Manual snapshot backups are for provisioned OpenSearch domains. Snapshot backups are not supported for OpenSearch Serverless.
:::

## Variables Used

| Placeholder | Description |
| --- | --- |
| `AWS_REGION` | AWS Region where FormKiQ and the scheduled backup resources run. |
| `APP_ENVIRONMENT` | FormKiQ application environment used by the CLI to discover stack outputs. |
| `SITE_ID` | FormKiQ site ID to back up. Use `default` unless your deployment uses multiple sites. |
| `FK_CLI_ZIP_URL` | Linux FormKiQ CLI zip asset URL from the [FormKiQ CLI releases page](https://github.com/formkiq/formkiq-cli/releases). |
| `SNAPSHOT_PREFIX` | Prefix for generated OpenSearch snapshot names. |
| `PROJECT_NAME` | CodeBuild project that runs the CLI backup command. |
| `CODEBUILD_ROLE_NAME` | IAM role used by the CodeBuild project. |
| `SCHEDULER_ROLE_NAME` | IAM role used by EventBridge Scheduler to start CodeBuild. |
| `SCHEDULE_NAME` | EventBridge schedule name. |

Set the variables before running the examples:

Open the [FormKiQ CLI releases page](https://github.com/formkiq/formkiq-cli/releases), choose the release you want to run, and copy the Linux zip asset URL into `FK_CLI_ZIP_URL`.

```bash
export AWS_REGION="us-east-1"
export APP_ENVIRONMENT="prod"
export SITE_ID="default"
export FK_CLI_ZIP_URL="PASTE_LINUX_FORMKIQ_CLI_ZIP_ASSET_URL"
export SNAPSHOT_PREFIX="weekly-${SITE_ID}"
export PROJECT_NAME="formkiq-opensearch-weekly-backup"
export CODEBUILD_ROLE_NAME="formkiq-opensearch-weekly-backup-codebuild"
export SCHEDULER_ROLE_NAME="formkiq-opensearch-weekly-backup-scheduler"
export SCHEDULE_NAME="formkiq-opensearch-weekly-backup"
export AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
```

## Workflow Overview

1. Verify the FormKiQ CLI backup command manually.
2. Create the CodeBuild service role.
3. Create the CodeBuild project that downloads and runs the CLI.
4. Run the CodeBuild project once on demand.
5. Create the EventBridge Scheduler role.
6. Schedule the CodeBuild project to run weekly.
7. Verify weekly snapshots.
8. Document restore and cleanup procedures.

## Step 1: Verify the Backup Command Manually

Run one backup from a workstation or AWS CloudShell before automating it:

```bash
fk --configure \
  --app-environment "${APP_ENVIRONMENT}" \
  --region "${AWS_REGION}"
```

Create a test snapshot:

```bash
SNAPSHOT_NAME="${SNAPSHOT_PREFIX}-manual-$(date -u +%Y-%m-%d)"

fk --opensearch \
  --backup \
  --site-id "${SITE_ID}" \
  --snapshot-name "${SNAPSHOT_NAME}"
```

If the manual command fails, resolve the FormKiQ profile, IAM permission, or OpenSearch snapshot configuration before creating the schedule.

## Step 2: Create the CodeBuild Service Role

Create a trust policy for CodeBuild:

```bash
cat > codebuild-trust-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
```

Create the role:

```bash
aws iam create-role \
  --role-name "${CODEBUILD_ROLE_NAME}" \
  --assume-role-policy-document file://codebuild-trust-policy.json \
  --region "${AWS_REGION}"
```

Create a permissions policy for the backup job:

```bash
cat > codebuild-permissions-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:DescribeStacks",
        "cloudformation:ListStacks"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "execute-api:Invoke",
      "Resource": "*"
    }
  ]
}
EOF
```

Attach the policy:

```bash
aws iam put-role-policy \
  --role-name "${CODEBUILD_ROLE_NAME}" \
  --policy-name FormKiQOpenSearchWeeklyBackup \
  --policy-document file://codebuild-permissions-policy.json \
  --region "${AWS_REGION}"
```

:::note
The example uses broad resources to keep the tutorial readable. For production, scope `execute-api:Invoke` to the FormKiQ API ARN and scope CloudWatch Logs to the CodeBuild log group.
:::

## Step 3: Create the CodeBuild Project

Create a buildspec that downloads the FormKiQ CLI, configures it with the CodeBuild role credentials, and creates a snapshot with a date-based name:

```bash
cat > buildspec.yml <<'EOF'
version: 0.2

phases:
  install:
    commands:
      - curl -L -o formkiq-cli.zip "${FK_CLI_ZIP_URL}"
      - unzip -o formkiq-cli.zip
      - chmod +x fk
      - ./fk --help
  pre_build:
    commands:
      - ./fk --configure --app-environment "${APP_ENVIRONMENT}" --region "${AWS_REGION}"
  build:
    commands:
      - SNAPSHOT_NAME="${SNAPSHOT_PREFIX}-$(date -u +%Y-%m-%d)"
      - ./fk --opensearch --backup --site-id "${SITE_ID}" --snapshot-name "${SNAPSHOT_NAME}"
EOF
```

Create the CodeBuild project definition:

```bash
cat > codebuild-project.json <<EOF
{
  "name": "${PROJECT_NAME}",
  "source": {
    "type": "NO_SOURCE",
    "buildspec": "$(python3 -c 'import json; print(json.dumps(open("buildspec.yml").read()))')"
  },
  "artifacts": {
    "type": "NO_ARTIFACTS"
  },
  "environment": {
    "type": "LINUX_CONTAINER",
    "image": "aws/codebuild/standard:7.0",
    "computeType": "BUILD_GENERAL1_SMALL",
    "environmentVariables": [
      {
        "name": "AWS_REGION",
        "value": "${AWS_REGION}",
        "type": "PLAINTEXT"
      },
      {
        "name": "APP_ENVIRONMENT",
        "value": "${APP_ENVIRONMENT}",
        "type": "PLAINTEXT"
      },
      {
        "name": "SITE_ID",
        "value": "${SITE_ID}",
        "type": "PLAINTEXT"
      },
      {
        "name": "SNAPSHOT_PREFIX",
        "value": "${SNAPSHOT_PREFIX}",
        "type": "PLAINTEXT"
      },
      {
        "name": "FK_CLI_ZIP_URL",
        "value": "${FK_CLI_ZIP_URL}",
        "type": "PLAINTEXT"
      }
    ]
  },
  "serviceRole": "arn:aws:iam::${AWS_ACCOUNT_ID}:role/${CODEBUILD_ROLE_NAME}"
}
EOF
```

Create the project:

```bash
aws codebuild create-project \
  --cli-input-json file://codebuild-project.json \
  --region "${AWS_REGION}"
```

## Step 4: Run the Backup Job On Demand

Start the CodeBuild project:

```bash
aws codebuild start-build \
  --project-name "${PROJECT_NAME}" \
  --region "${AWS_REGION}"
```

Open the CodeBuild build logs and confirm the `fk --opensearch --backup` command completed successfully.

## Step 5: Create the EventBridge Scheduler Role

Create a trust policy for EventBridge Scheduler:

```bash
cat > scheduler-trust-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "scheduler.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
```

Create the role:

```bash
aws iam create-role \
  --role-name "${SCHEDULER_ROLE_NAME}" \
  --assume-role-policy-document file://scheduler-trust-policy.json \
  --region "${AWS_REGION}"
```

Allow the scheduler to start only this CodeBuild project:

```bash
cat > scheduler-permissions-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "codebuild:StartBuild",
      "Resource": "arn:aws:codebuild:${AWS_REGION}:${AWS_ACCOUNT_ID}:project/${PROJECT_NAME}"
    }
  ]
}
EOF
```

Attach the policy:

```bash
aws iam put-role-policy \
  --role-name "${SCHEDULER_ROLE_NAME}" \
  --policy-name StartFormKiQOpenSearchWeeklyBackup \
  --policy-document file://scheduler-permissions-policy.json \
  --region "${AWS_REGION}"
```

## Step 6: Create the Weekly Schedule

Create a weekly schedule that starts the CodeBuild project every Sunday at 06:00 UTC:

```bash
aws scheduler create-schedule \
  --name "${SCHEDULE_NAME}" \
  --schedule-expression "cron(0 6 ? * SUN *)" \
  --flexible-time-window Mode=OFF \
  --target "Arn=arn:aws:scheduler:::aws-sdk:codebuild:startBuild,RoleArn=arn:aws:iam::${AWS_ACCOUNT_ID}:role/${SCHEDULER_ROLE_NAME},Input={\"ProjectName\":\"${PROJECT_NAME}\"}" \
  --region "${AWS_REGION}"
```

Adjust the cron expression to match your recovery point objective and preferred maintenance window.

## Step 7: Verify the Result

After the first scheduled run:

- Confirm the EventBridge schedule invocation succeeded.
- Confirm the CodeBuild build completed successfully.
- Review the CodeBuild logs for the generated snapshot name.
- Use the FormKiQ API, OpenSearch tooling, or operational runbooks to confirm the snapshot exists.

Document the snapshot naming pattern and the expected weekly run time in your operations handbook.

## Restore Procedure

Keep the restore command in your recovery runbook:

```bash
fk --opensearch \
  --restore \
  --site-id "${SITE_ID}" \
  --snapshot-name "weekly-default-YYYY-MM-DD"
```

The restore operation creates a separate restored OpenSearch index. Confirm restored-index access and search behavior before using it for production recovery.

## Clean Up

To remove the scheduled backup resources:

```bash
aws scheduler delete-schedule \
  --name "${SCHEDULE_NAME}" \
  --region "${AWS_REGION}"

aws codebuild delete-project \
  --name "${PROJECT_NAME}" \
  --region "${AWS_REGION}"

aws iam delete-role-policy \
  --role-name "${SCHEDULER_ROLE_NAME}" \
  --policy-name StartFormKiQOpenSearchWeeklyBackup \
  --region "${AWS_REGION}"

aws iam delete-role \
  --role-name "${SCHEDULER_ROLE_NAME}" \
  --region "${AWS_REGION}"

aws iam delete-role-policy \
  --role-name "${CODEBUILD_ROLE_NAME}" \
  --policy-name FormKiQOpenSearchWeeklyBackup \
  --region "${AWS_REGION}"

aws iam delete-role \
  --role-name "${CODEBUILD_ROLE_NAME}" \
  --region "${AWS_REGION}"
```

This cleanup removes the schedule and runner. It does not delete OpenSearch snapshots.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| `fk --configure` fails in CodeBuild | The role cannot discover the FormKiQ CloudFormation stack. | Confirm `APP_ENVIRONMENT`, `AWS_REGION`, and `cloudformation:ListStacks` / `cloudformation:DescribeStacks`. |
| `fk --opensearch --backup` fails | Snapshot support is not enabled or OpenSearch Serverless is used. | Confirm the OpenSearch module configuration and snapshot repository support. |
| CodeBuild cannot call the FormKiQ API | Missing API invoke permission or wrong Region/API URL. | Confirm `execute-api:Invoke`, the FormKiQ `IamApiUrl`, and CodeBuild Region. |
| EventBridge Scheduler does not start the build | Scheduler role cannot start CodeBuild or schedule is disabled. | Confirm the scheduler target, role ARN, `codebuild:StartBuild`, and schedule state. |
| Snapshot names collide | The generated name is not unique for your schedule frequency. | Include a date, timestamp, or build number in `SNAPSHOT_NAME`. |

## Next Steps

- [FormKiQ CLI](/docs/formkiq-modules/modules/formkiq-cli)
- [OpenSearch Managed Installation](/docs/formkiq-modules/installation/opensearch-managed)
- [Backup and Recovery](/docs/platform/backup_and_recovery)
