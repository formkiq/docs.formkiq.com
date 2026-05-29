---
id: dynamodb-data-migration
title: DynamoDb data Migration
sidebar_position: 3
sidebar_label: DynamoDb Data migration
slug: /tutorials/dynamodb-data-migration
description: Step-by-step guide to migrating DynamoDb to another FormKiQ instance.
tags:
  - tutorial
  - formkiq
  - cli
  - migration
---

# DynamoDB Data Migration

This tutorial shows how to use the `--restore-dynamodb` option in the [FileSync CLI](/docs/formkiq-modules/modules/filesync-cli) and the `aws s3 sync` command in the [AWS CLI](https://aws.amazon.com/cli/) to copy documents from one FormKiQ installation to another.

## What You Will Build

You will copy document metadata from one FormKiQ DynamoDB table to another, then copy the corresponding document content between S3 buckets.

## Before You Begin

- Access to a FormKiQ Advanced or Enterprise installation.
- The latest [FileSync CLI](/docs/formkiq-modules/modules/filesync-cli) installed and configured.
- AWS CLI access to the source and destination S3 buckets.
- Source and destination FormKiQ DynamoDB document table names.
- Source and destination document S3 bucket names.

## Workflow Overview

1. Copy document metadata with `fk --restore-dynamodb`.
2. Copy document content with `aws s3 sync`.
3. Verify document metadata and content in the destination environment.

## Step 1: Sync DynamoDb

**The first step is to sync the document metadata.**

Using the [FileSync CLI](/docs/formkiq-modules/modules/filesync-cli), you can sync the FormKiQ metadata that is stored in [Amazon DynamoDB](https://aws.amazon.com/dynamodb) using the command:

```
fk --restore-dynamodb --from-table <source_dynamodb_tablename> --to-table <destination_dynamodb_tablename>
```

:::caution
`--restore-dynamodb` writes directly to the destination table. Use compatible FormKiQ versions and restore into an empty or controlled target table.
:::

### Example

```
fk --restore-dynamodb --from-table formkiq-enterprise-dev1-documents --to-table formkiq-enterprise-dev2-documents
```

## Step 2: Sync Document Content

**Once the document metadata has been synced, you can proceed to the second step of moving the actual file objects.**

Using the [AWS CLI](https://aws.amazon.com/cli/), you can sync the document contents from one S3 bucket to another.

```
aws s3 sync s3://<source-bucket> s3://<destination-bucket>
```

:::note
The --dry-run can be used with this command to see the output from the CLI
:::

### Example

```
aws s3 sync s3://formkiq-enterprise-dev1-documents-1111111111 s3://formkiq-enterprise-dev2-documents-1111111111
```

## Verify the Result

- Compare source and destination DynamoDB document counts.
- Compare S3 object counts and total size.
- Open the destination FormKiQ console and confirm migrated documents are visible.
- Download several documents to confirm metadata and content are in sync.

## Clean Up

Remove any temporary document ID lists or migration logs created during testing.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| DynamoDB restore fails | Incorrect table name or missing permissions. | Confirm table names, Region, and `dynamodb:Scan` / `dynamodb:BatchWriteItem`. |
| Documents appear but cannot download | S3 objects were not copied or object keys do not match metadata. | Rerun `aws s3 sync` and compare bucket object counts. |
| Search does not return migrated documents | Search index was not rebuilt. | Use FileSync CLI OpenSearch sync or see the Core-to-Enterprise migration guide. |

## Next Steps

- [Migrate Documents from Core to Enterprise](/docs/how-tos/migration-core-to-enterprise)
- [FileSync CLI](/docs/formkiq-modules/modules/filesync-cli)
