---
sidebar_position: 10
title: Status Monitoring and Alerting
---

# Status Monitoring and Alerting

This guide describes a practical monitoring baseline for a FormKiQ deployment. It covers external uptime checks, AWS service metrics, failed processing alerts, log retention, dashboards, and alert routing.

FormKiQ runs in your AWS account, so monitoring should combine:

- External endpoint checks that confirm users and applications can reach FormKiQ.
- CloudWatch metrics for AWS services used by the deployment.
- Dead-letter queue alerts for failed asynchronous processing.
- Logs and dashboards for investigation and trend analysis.
- Notification routing so the right team sees the right alert.

## Before You Begin

Confirm you have:

- Access to the AWS account and Region where FormKiQ is deployed.
- AWS permissions for CloudWatch, CloudWatch Logs, SNS, SQS, Lambda, API Gateway, DynamoDB, and CloudFormation.
- The FormKiQ API endpoint from your CloudFormation stack outputs.
- At least one alert destination, such as email, Slack, PagerDuty, ServiceNow, Jira, or another incident-management tool.

## Variables Used

| Placeholder | Description |
| --- | --- |
| `FORMKIQ_API_URL` | FormKiQ API endpoint from the CloudFormation stack output, including `https://`. |
| `ALERT_TOPIC` | SNS topic or incident-management destination for alerts. |
| `AWS_REGION` | AWS Region where FormKiQ is deployed. |

## Monitoring Layers

Use more than one monitoring layer. A single endpoint check can confirm basic availability, but it will not catch every internal processing failure.

| Layer | What it answers | AWS services |
| --- | --- | --- |
| Endpoint uptime | Can users or applications reach the FormKiQ API? | CloudWatch Synthetics, API Gateway |
| API health | Are API requests failing or becoming slow? | API Gateway, Lambda |
| Processing health | Are asynchronous document actions completing? | SQS, DLQ, Lambda, SNS |
| Data layer health | Are metadata and content services throttling or failing? | DynamoDB, S3 |
| Search health | Is search available and indexing correctly? | OpenSearch, if enabled |
| Deployment health | Are stack updates and infrastructure changes succeeding? | CloudFormation |
| Investigation | What failed, where, and why? | CloudWatch Logs, CloudTrail |

## Endpoint Uptime Check

Use the `/version` endpoint for a simple external availability check.

```bash
curl -i https://FORMKIQ_API_URL/version
```

Expected result:

- HTTP `200`
- JSON response with version information

This check confirms that the public API endpoint is reachable and that a lightweight unauthenticated request can complete.

## CloudWatch Synthetics Canary

Create a CloudWatch Synthetics canary to run the `/version` check automatically.

Recommended setup:

| Setting | Recommendation |
| --- | --- |
| Blueprint | API canary |
| URL | `https://FORMKIQ_API_URL/version` |
| Schedule | Every 5 minutes for production; every 15 to 30 minutes for non-production |
| Timeout | Short enough to catch endpoint stalls, but long enough for normal regional latency |
| Success condition | HTTP `200` |
| Alarm | Alert when the canary fails for two or more consecutive runs |
| Logs and artifacts | Retain long enough to support incident review |

Route canary alarms to an SNS topic or your normal incident-management integration.

:::tip
For production, alert on consecutive failures rather than a single failed run. That reduces noise from short network blips while still catching real availability issues quickly.
:::

## Recommended CloudWatch Alarms

Start with alarms that catch customer-visible failures and stuck background work. Tune thresholds after observing normal traffic patterns.

| Component | Metric or signal | Starter alarm condition | Why it matters |
| --- | --- | --- | --- |
| API Gateway | 5xx errors | Any sustained 5xx errors above normal baseline | Indicates API backend or integration failures. |
| API Gateway | Latency or integration latency | Sustained latency above expected production baseline | Detects slow API responses before users report them. |
| API Gateway | 4xx errors | Sudden spike above baseline | Can indicate authentication, authorization, client, or deployment issues. |
| Lambda | Errors | One or more sustained function errors for critical functions | Captures application or integration failures. |
| Lambda | Throttles | Any throttles for production workloads | Indicates concurrency or capacity pressure. |
| Lambda | Duration | Duration near timeout or sharply above baseline | Detects slow dependencies or code paths. |
| DynamoDB | Throttled requests | Any sustained throttling | Can cause API errors, slow imports, or failed processing. |
| DynamoDB | System errors | Any sustained system errors | Indicates service-side failures that may require AWS review. |
| SQS | Approximate age of oldest message | Message age exceeds normal processing window | Shows that document processing is falling behind. |
| SQS | Visible messages | Queue depth grows and does not recover | Indicates backlog or downstream processing failure. |
| DLQ | Visible messages | Any message visible in a production DLQ | Indicates failed asynchronous processing that needs review. |
| SNS | Failed notifications | Any sustained delivery failure | Alerts or event notifications may not be reaching subscribers. |
| OpenSearch | Cluster health | Red status, or yellow status that persists beyond expected maintenance | Search may be unavailable or degraded. |
| OpenSearch | Search or indexing latency/errors | Sustained failures or latency above baseline | Search and reindexing may be degraded. |
| CloudFormation | Stack status | Update or create failure | Infrastructure changes may be incomplete or rolled back. |

For OpenSearch-specific alarm options, also review the parameters on the [OpenSearch Managed Installation](/docs/formkiq-modules/installation/opensearch-managed) page.

## Dead-Letter Queue Alerts

FormKiQ uses asynchronous queues for document processing and other background work. Failed messages can be sent to a dead-letter queue.

For production deployments:

1. Confirm the DLQ alarm exists.
2. Confirm the SNS topic has at least one active subscription.
3. Confirm email subscriptions have been accepted.
4. Review the DLQ after alerts before redriving messages.
5. Fix the root cause before reprocessing messages.

See [Dead-Letter Queue](/docs/platform/error_handling/dlq) for alert subscription and redrive steps.

## Logs and Metric Filters

AWS service logs are available through CloudWatch Logs depending on the deployed stack and service configuration. Use logs for investigation and use metric filters only for signals that should become alarms.

Recommended log practices:

- Set CloudWatch log retention intentionally instead of leaving logs retained forever.
- Use different retention periods for production and non-production environments.
- Avoid logging sensitive document content or metadata values.
- Create metric filters for repeated error patterns that need alerting.
- Use CloudWatch Logs Insights for investigation instead of scanning large log groups manually.

Useful Logs Insights starting points:

```sql
fields @timestamp, @message
| filter @message like /ERROR|Exception|Task timed out/
| sort @timestamp desc
| limit 50
```

```sql
fields @timestamp, @logStream, @message
| filter @message like /AccessDenied|Throttl|timeout/
| sort @timestamp desc
| limit 50
```

## Optional CloudWatch Dashboard

A dashboard is not a replacement for alarms, but it helps with operations review and incident response.

Recommended dashboard widgets:

- API Gateway request count, 4xx, 5xx, latency, and integration latency.
- Lambda errors, throttles, duration, and concurrent executions.
- DynamoDB consumed capacity, throttles, and latency.
- SQS queue depth and oldest message age.
- DLQ visible messages.
- SNS failed notifications.
- OpenSearch cluster health, storage, CPU, JVM memory pressure, and search/indexing errors when enabled.
- CloudWatch Synthetics canary success rate.

Use separate dashboards for production and non-production if alert thresholds or ownership differ.

## Notification Routing

Route alerts based on severity and ownership.

| Severity | Examples | Suggested routing |
| --- | --- | --- |
| Critical | API unavailable, sustained 5xx errors, production DLQ messages, OpenSearch red status | Pager or incident-management system |
| High | Processing backlog, Lambda throttles, DynamoDB throttles, failed stack update | Operations channel and ticket |
| Medium | Latency increase, 4xx spike, non-production canary failure | Team channel or backlog ticket |
| Low | Cost/log retention review, warning thresholds, trend changes | Operational review queue |

Keep notification rules simple at first. Too many noisy alerts make real incidents easier to miss.

## Verify Monitoring

After configuring monitoring, test the full path from alarm condition to notification.

Recommended tests:

1. Confirm the `/version` endpoint returns `200`.
2. Confirm the CloudWatch Synthetics canary succeeds.
3. Temporarily point a non-production canary to an invalid path and confirm the alarm fires.
4. Confirm SNS email subscriptions are accepted.
5. Confirm alerts reach the expected Slack, PagerDuty, ServiceNow, Jira, or email destination.
6. Review the alarm message and confirm it includes enough context to start troubleshooting.
7. Restore the test canary URL and confirm the alarm returns to OK.

:::warning
Do not intentionally break a production FormKiQ stack to test alarms. Use non-production resources or safe canary URL changes for alert-path testing.
:::

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| Canary fails immediately | URL is incorrect or unreachable. | Confirm `FORMKIQ_API_URL` and test `/version` manually. |
| Alarm fires but no one is notified | SNS subscription or integration is not active. | Confirm subscriptions are confirmed and alert routing is configured. |
| Lambda errors occur without alerts | Alarms do not cover the affected function. | Review function metrics and add alarms for critical functions. |
| DLQ has messages but no alert | DLQ metric alarm is missing or threshold is too high. | Add an alarm on visible messages for production DLQs. |
| Dashboard looks healthy during an incident | The dashboard does not include the failing layer. | Add widgets for queues, DLQs, Lambda errors, and downstream services. |

## Operational Best Practices

- Define who owns each production alert.
- Document the first response steps for critical alarms.
- Keep runbooks close to the alarm names or dashboard.
- Review thresholds after major traffic, import, or workflow changes.
- Tag monitoring resources for environment, owner, and application.
- Review alarm noise regularly and remove alerts that do not drive action.
- Include monitoring checks in upgrade and migration plans.
- Monitor CloudWatch usage and log retention as part of AWS cost planning.

## Next Steps

- [Dead-Letter Queue](/docs/platform/error_handling/dlq)
- [Reporting, Analytics, and Audit](/docs/platform/reporting-and-analytics)
- [Backup and Recovery](/docs/platform/backup_and_recovery)
- [Updates, Upgrades, and Rollbacks](/docs/platform/updates_upgrades_and_rollbacks)
- [AWS Cost Planning](/docs/platform/costs)
- [CloudWatch Logs Insights Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
