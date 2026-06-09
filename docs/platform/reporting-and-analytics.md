---
sidebar_position: 8
title: Reporting, Analytics, and Audit
sidebar_label: Reporting and Analytics
---

# Reporting, Analytics, and Audit

FormKiQ can support operational dashboards, audit reporting, compliance reviews, BI analytics, and custom reporting pipelines because document metadata, activity, storage, API traffic, and document events are available through AWS-native services and FormKiQ APIs.

This page explains the main reporting data sources and the recommended patterns for turning FormKiQ operational data into reports.

:::warning
Avoid heavy analytics directly against production DynamoDB tables unless you understand the access patterns, cost, and throttling risk. For larger reports, prefer DynamoDB export to S3, purpose-built reporting copies, or API-based extracts with controlled pagination.
:::

## Reporting Data Sources

| Source | Contains | Best for |
|--------|----------|----------|
| DynamoDB document records | Document metadata, attributes, tags, paths, status, and indexes. | Document inventory, metadata completeness, site-level reporting. |
| DynamoDB activity and audit records | User activity, resource activity, document activity, and change references. | Audit reports, user activity, compliance review. |
| Amazon S3 | Document content, object versions, optional access logs, exported data. | Storage growth, retention analysis, access-log analysis, data lake exports. |
| Amazon CloudWatch | API Gateway, Lambda, queue, and service logs and metrics. | Operational dashboards, latency, errors, throttling, alarms. |
| EventBridge, SNS, and SQS | Document lifecycle events and processing messages. | Near-real-time reporting and event-driven integrations. |
| FormKiQ APIs | Documents, attributes, versions, workflows, queues, user activity, and configuration. | Application-level reporting and controlled extracts. |
| Search indexes | Full-text search index data, when enabled. | Search usage analysis and content-discovery reports, depending on configuration. |

For the underlying table patterns, see [DynamoDB Schema](/docs/platform/database_schema). For storage architecture, see [Document Storage](/docs/platform/document_storage).

## Choose the Right Reporting Path

| Reporting need | Recommended path |
|----------------|------------------|
| Operational health dashboard | CloudWatch metrics and alarms for API Gateway, Lambda, DynamoDB, SQS, SNS, and OpenSearch. |
| Document inventory report | FormKiQ APIs for small/controlled extracts, or DynamoDB export to S3 for larger analysis. |
| User activity or audit report | Activity records, user activity APIs, and CloudWatch logs where applicable. |
| Compliance dashboard | DynamoDB export to S3, Glue catalog, Athena queries, and QuickSight dashboards. |
| Storage growth report | S3 metrics, S3 Inventory, lifecycle reports, and document metadata. |
| Workflow queue aging | Workflow, queue, and document action records; optionally copied into a reporting table. |
| Near-real-time reporting | EventBridge/SNS/SQS event pipeline into Lambda, S3, DynamoDB, or a data warehouse. |
| External BI tool integration | Athena over exported S3 data, or a curated reporting database populated by ETL. |

## Starter Reports

These are good first reports for most FormKiQ environments:

- Documents created by day, week, or month
- Documents by site
- Documents by content type
- Documents by classification or schema
- Documents missing required metadata
- Storage by site or document category
- User activity by day
- Most active users or groups
- Failed document actions
- Workflow queue aging
- OCR or Textract processing volume
- API request volume, latency, and error rate
- Search usage and indexing failures, when full-text search is enabled

## QuickSight and Athena Pattern

For BI reporting, the most durable pattern is usually:

1. Export DynamoDB tables to S3.
2. Catalog the exported data with AWS Glue.
3. Query the data with Amazon Athena.
4. Build QuickSight dashboards from Athena datasets.
5. Schedule exports and dataset refreshes based on reporting needs.

This approach avoids running large BI queries directly against operational DynamoDB tables and makes it easier to join FormKiQ data with other enterprise datasets.

:::note
Direct reads from DynamoDB can be useful for small operational reports, but large dashboards should use exports, curated reporting tables, or an analytics pipeline.
:::

## Amazon QuickSight Integration

Amazon QuickSight can be used to visualize FormKiQ reporting datasets. QuickSight is usually connected to Athena datasets, exported S3 data, or curated reporting tables rather than raw operational tables.

When setting up QuickSight:

1. Grant QuickSight least-privilege access to the reporting data source.
2. Use Athena or curated datasets for larger reports.
3. Use SPICE for dashboards that need fast repeated access.
4. Schedule refreshes based on business reporting requirements.
5. Mask or exclude sensitive metadata where reports are shared broadly.

Common QuickSight dashboards include:

- Document inventory dashboard
- User activity dashboard
- Compliance monitoring dashboard
- Workflow performance dashboard
- Storage and retention dashboard
- OCR and processing-volume dashboard

## Audit Reporting

FormKiQ audit reporting usually combines activity records, user information, document metadata, and operational logs.

Useful audit dimensions include:

- User or group
- Site ID
- Document ID
- Resource type
- Activity type
- Activity status
- Source IP address
- Timestamp
- Change set, when available

Common audit questions include:

- Who viewed or modified a document?
- Which documents were accessed outside business hours?
- Which operations failed or were unauthorized?
- Which documents were deleted, restored, or purged?
- Which metadata values changed during a review period?

For schema details, see the `Resource User Activity`, `Document User Activity`, and `Activities Events` sections in [DynamoDB Schema](/docs/platform/database_schema).

## Operational Monitoring

Use CloudWatch for system-level reporting and alerting.

Recommended CloudWatch views include:

- API Gateway request count, latency, integration latency, and 4xx/5xx errors
- Lambda errors, duration, throttles, and concurrent executions
- DynamoDB throttled requests, consumed capacity, and latency
- SQS queue depth, message age, and dead-letter queue count
- SNS delivery failures
- OpenSearch cluster health, indexing failures, and query latency, when enabled
- CloudWatch Logs volume and retention

For cost context, see [Costs & AWS Usage](/docs/platform/costs).

## API-Based Reporting

For application-level reporting or smaller controlled extracts, use FormKiQ APIs.

Example document list request:

```bash
curl -X GET "https://{FORMKIQ_API_URL}/documents?limit=100" \
  -H "Authorization: {authorization}"
```

Example document attributes request:

```bash
curl -X GET "https://{FORMKIQ_API_URL}/documents/{documentId}/attributes" \
  -H "Authorization: {authorization}"
```

Example document versions request:

```bash
curl -X GET "https://{FORMKIQ_API_URL}/documents/{documentId}/versions" \
  -H "Authorization: {authorization}"
```

For API details, see the [FormKiQ API Reference](/docs/category/formkiq-api) and the [API Walkthrough](/docs/getting-started/api-walkthrough).

## Event-Driven Reporting

For near-real-time reporting, connect document events to an analytics pipeline.

A typical pattern:

1. Publish document lifecycle events through EventBridge, SNS, or SQS.
2. Process events with Lambda.
3. Normalize event data into a reporting table, S3 data lake, or external data warehouse.
4. Build dashboards from the reporting store.
5. Add alarms for critical events such as repeated processing failures or large failed-action counts.

Use this pattern when reports need to update continuously or when downstream systems need to react to document changes.

For event details, see [Document Events](/docs/features/documents#document-events-features) and [Document Event Processing](/docs/tutorials/event-and-integration-patterns/document-event-processing).

## Optional Advanced Patterns

Advanced reporting can integrate with broader analytics platforms, but these should be treated as optional architecture patterns rather than required setup.

Common advanced patterns include:

- Tableau, Power BI, or Looker connected through Athena or a curated warehouse
- SageMaker anomaly detection for unusual usage patterns
- Forecasting storage growth or processing volume
- Cross-site aggregation for multi-tenant reporting
- Data warehouse replication for enterprise BI programs

## Security and Cost Best Practices

- Use least-privilege IAM roles for reporting tools.
- Do not expose sensitive document metadata in shared dashboards unless approved.
- Prefer exports or reporting replicas for high-volume analysis.
- Schedule large exports and scans outside peak operational windows.
- Use S3 lifecycle policies for exported reporting data.
- Monitor QuickSight SPICE usage and dataset refresh cost.
- Set CloudWatch log retention intentionally.
- Avoid full-text search indexes for reporting needs that can be satisfied by metadata or attributes.
- Tag reporting infrastructure for cost allocation.

## Where to Go Next

- Review storage architecture: [Document Storage](/docs/platform/document_storage)
- Understand table patterns: [DynamoDB Schema](/docs/platform/database_schema)
- Plan AWS usage: [Costs & AWS Usage](/docs/platform/costs)
- Review document events: [Documents](/docs/features/documents#document-events-features)
- Test API access: [API Walkthrough](/docs/getting-started/api-walkthrough)

## Additional Resources

- [Amazon QuickSight Documentation](https://docs.aws.amazon.com/quicksight/)
- [AWS Glue Documentation](https://docs.aws.amazon.com/glue/)
- [Amazon Athena Documentation](https://docs.aws.amazon.com/athena/)
- [CloudWatch Logs Insights Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
- [DynamoDB Analytics Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-analytics.html)
