---
sidebar_position: 11
---

# Dead-Letter Queue (DLQ)

## Overview

FormKiQ uses asynchronous queues for document processing and background work. When a message cannot be processed successfully after its configured retries, it can be moved to a dead-letter queue (DLQ) for investigation.

A DLQ is an operational safety mechanism. It keeps failed work visible so the issue can be investigated, fixed, and reprocessed when appropriate.

:::warning
Do not redrive DLQ messages until the root cause has been understood or fixed. Redriving too early can send the same failed messages back through the system, create repeated failures, and make incident analysis harder.
:::

## Where DLQs Fit

FormKiQ uses message-driven processing to decouple work across platform components. This helps the system absorb traffic spikes and isolate failures.

DLQs are most relevant for asynchronous work such as:

- Document upload processing
- OCR or full-text processing
- Ruleset and workflow execution
- Search indexing or synchronization
- Webhook or integration processing
- Bulk import or migration processing
- Module-specific background jobs

The exact queues and alarms depend on the deployed FormKiQ version, modules, and CloudFormation parameters.

## What a DLQ Alert Means

A DLQ alert means one or more messages could not be processed successfully. It does not always mean the entire FormKiQ deployment is down.

Common causes include:

| Cause | Examples |
| --- | --- |
| Configuration issue | Missing module configuration, invalid environment value, wrong endpoint, missing secret. |
| Permission issue | Lambda or service role cannot access S3, DynamoDB, KMS, OpenSearch, SNS, or another dependency. |
| Data issue | Unsupported file type, invalid payload, malformed metadata, missing document reference. |
| Capacity issue | Lambda throttling, downstream timeout, queue backlog, OpenSearch pressure, external API rate limit. |
| Transient service issue | Temporary AWS service error, network interruption, dependency outage. |
| Code or deployment issue | Function error after an upgrade, incompatible message shape, failed module update. |

## Alert Setup

FormKiQ deployments can include CloudWatch alarms for DLQ message counts and SNS notifications. Production environments should verify that alert subscriptions are active.

Alert setup checklist:

1. Find the DLQ alarm in Amazon CloudWatch.
2. Confirm the alarm watches visible messages in the DLQ.
3. Confirm the alarm action points to the expected SNS topic.
4. Confirm email subscriptions have been accepted.
5. Confirm Slack, PagerDuty, ServiceNow, Jira, or other integrations receive test notifications.
6. Document the owner and first-response runbook for the alert.

For broader monitoring setup, see [Set Up Status Monitoring and Alerting](/docs/how-tos/set-up-status-monitoring-and-alerting).

## Incident Response Workflow

When a DLQ alert fires, use this workflow.

### 1. Confirm the Alert

Open the CloudWatch alarm and confirm:

- Current alarm state
- DLQ queue name
- Approximate number of visible messages
- First time the alarm entered `ALARM`
- Whether the alarm is still active or has returned to `OK`

Also check whether related alarms fired around the same time, such as Lambda errors, throttles, SQS queue age, API 5xx errors, DynamoDB throttles, or OpenSearch health alarms.

### 2. Inspect the DLQ Message

Open the DLQ in Amazon SQS and inspect a small sample of messages.

Look for:

- Source queue or event source
- Document ID, site ID, action type, workflow ID, or module identifier
- Error message or failure reason, if present
- Approximate first receive timestamp
- Whether multiple messages share the same failure pattern

Avoid deleting messages until you are confident they are invalid and no longer needed for audit or reprocessing.

### 3. Check Related Logs

Use CloudWatch Logs to inspect the Lambda function or service that originally processed the message.

Useful searches include:

```sql
fields @timestamp, @message
| filter @message like /ERROR|Exception|Task timed out|AccessDenied|Throttl/
| sort @timestamp desc
| limit 50
```

```sql
fields @timestamp, @logStream, @message
| filter @message like /<documentId-or-queueId>/
| sort @timestamp asc
| limit 100
```

If the message relates to a document action, use the document action APIs to inspect the current action state before retrying. See [Document Actions](/docs/how-tos/api-document-actions) and [`GET /documents/{documentId}/actions`](/docs/api-reference/get-document-actions).

### 4. Fix the Root Cause

Fix the cause before redriving messages.

Examples:

- Correct IAM permissions.
- Restore missing configuration.
- Increase capacity or reduce concurrency.
- Fix a malformed import file or migration script.
- Resolve OpenSearch, OCR, webhook, or module configuration issues.
- Deploy a corrected application or module version.

For upgrade-related failures, see [Updates, Upgrades, and Rollbacks](/docs/platform/updates_upgrades_and_rollbacks).

### 5. Redrive Carefully

After the root cause is fixed, redrive a small number of messages first.

Recommended redrive approach:

1. Redrive a small sample.
2. Watch CloudWatch Logs for repeated failures.
3. Confirm related document actions or workflow states move forward.
4. Confirm the DLQ count does not increase again.
5. Redrive the remaining messages in controlled batches.

Messages that fail again will return to the DLQ. Treat repeated failures as a sign that the root cause is unresolved or the message is not safe to reprocess.

### 6. Verify Recovery

After redrive:

- Confirm the DLQ visible message count returns to zero or the expected value.
- Confirm the CloudWatch alarm returns to `OK`.
- Confirm affected documents, workflows, OCR jobs, search indexes, imports, or integrations completed as expected.
- Record the incident cause, fix, and whether any messages were deleted or skipped.

## When Not to Redrive

Do not redrive messages when:

- The underlying bug or configuration issue has not been fixed.
- The message payload is malformed and cannot be processed.
- The referenced document, site, workflow, or module no longer exists.
- The message would duplicate work that has already completed manually.
- The failure is caused by a missing dependency that is still unavailable.
- You cannot determine whether reprocessing is safe.

In these cases, preserve a sample message for investigation, document the decision, and delete or archive invalid messages only after operational approval.

## Common DLQ Scenarios

| Scenario | What to check |
| --- | --- |
| OCR failures | File type, page count, Textract or OCR module configuration, Lambda logs, document action status. |
| Search indexing failures | OpenSearch health, index permissions, document content availability, sync status. |
| Workflow failures | Workflow definition, queue permissions, group assignment, failed action status. |
| Webhook failures | Endpoint availability, authentication, response status, timeout, retry behavior. |
| Migration or import failures | Source file validity, document ID mapping, metadata format, batch logs, throttling. |
| Permission failures | IAM role policies, KMS key policy, S3 bucket policy, DynamoDB table access. |

## Best Practices

- Subscribe an operational destination to DLQ alerts in production.
- Treat any production DLQ message as actionable until reviewed.
- Investigate message samples before redriving.
- Fix the root cause before replaying messages.
- Redrive in small batches first.
- Keep enough CloudWatch log retention to investigate delayed incidents.
- Record incident notes for repeated failure patterns.
- Include DLQ checks in migration, backup, upgrade, and monitoring runbooks.

## Where to Go Next

- [Set Up Status Monitoring and Alerting](/docs/how-tos/set-up-status-monitoring-and-alerting)
- [Document Actions](/docs/how-tos/api-document-actions)
- [Reporting, Analytics, and Audit](/docs/platform/reporting-and-analytics)
- [Migration and Data Import](/docs/platform/migration-and-data-import)
- [Updates, Upgrades, and Rollbacks](/docs/platform/updates_upgrades_and_rollbacks)
- [Amazon SQS Dead-Letter Queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)
