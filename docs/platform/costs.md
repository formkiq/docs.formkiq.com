---
sidebar_position: 7
title: AWS Cost Planning
sidebar_label: Costs & AWS Usage
---

# AWS Cost Planning

FormKiQ is deployed into your AWS account, so AWS infrastructure cost depends on the services you enable, the AWS region you choose, document volume, file size, API usage, processing activity, retention policy, and optional modules.

This page is for AWS usage planning. It is not FormKiQ product pricing, and it is not a guaranteed AWS estimate.

:::note
AWS prices vary by region and can change over time. Use the [AWS Pricing Calculator](https://calculator.aws/) and the official AWS pricing pages before making budget or procurement decisions.
:::

## What Drives Cost

The largest cost drivers are usually:

- Number of documents stored
- Average document size
- Number of API requests
- Number of document reads and downloads
- Data transfer out to users or systems
- OCR, Textract, antivirus, or other document processing volume
- Full-text search indexing and query volume
- Search backend configuration, especially OpenSearch
- Retention period, S3 versioning, and lifecycle policy choices
- Migration or bulk import concurrency
- CloudWatch logs, metrics, alarms, and retained log volume

## Core AWS Costs

Core FormKiQ deployments primarily use managed AWS services with usage-based pricing.

| Service | What affects cost | Pricing reference |
|---------|-------------------|-------------------|
| Amazon API Gateway | API request volume, payload size, data transfer, and private endpoint usage if configured. | [API Gateway pricing](https://aws.amazon.com/api-gateway/pricing/) |
| AWS Lambda | Request count, execution duration, memory size, and concurrency patterns. | [Lambda pricing](https://aws.amazon.com/lambda/pricing/) |
| Amazon DynamoDB | Read/write request units, table storage, indexes, streams, backups, and exports. | [DynamoDB pricing](https://aws.amazon.com/dynamodb/pricing/) |
| Amazon S3 | Stored GB, PUT/GET requests, lifecycle transitions, object versions, replication, and data transfer. | [S3 pricing](https://aws.amazon.com/s3/pricing/) |
| Amazon CloudFront | Console traffic, data transfer out, and request volume. | [CloudFront pricing](https://aws.amazon.com/cloudfront/pricing/) |
| Amazon Cognito | User activity, monthly active users, and advanced identity features. | [Cognito pricing](https://aws.amazon.com/cognito/pricing/) |
| Amazon CloudWatch | Logs, metrics, alarms, dashboards, and log retention. | [CloudWatch pricing](https://aws.amazon.com/cloudwatch/pricing/) |
| Amazon SQS and SNS | Message volume, payload size, and delivery patterns. | [SQS pricing](https://aws.amazon.com/sqs/pricing/) and [SNS pricing](https://aws.amazon.com/sns/pricing/) |

## Optional and Module-Dependent Costs

Optional modules and advanced capabilities can add different cost patterns.

| Capability | Common AWS cost drivers |
|------------|-------------------------|
| Full-text search | Typesense or OpenSearch capacity, storage, indexing volume, replicas, and query traffic. |
| Amazon OpenSearch Service | Instance hours, storage, Multi-AZ configuration, snapshots, and data transfer. |
| OCR and IDP | Tesseract/Lambda runtime, Amazon Textract page volume, image/PDF volume, and retry behavior. |
| Antivirus or anti-malware scanning | Lambda/container runtime, scan queue volume, memory, and document size. |
| Custom domains | ACM certificates, CloudFront, Route 53, and API Gateway custom domain configuration. |
| VPC-based deployments | NAT gateways, VPC endpoints, data processing, and private networking resources. |
| Reporting and analytics | DynamoDB exports, S3 storage, Athena/Glue/QuickSight, and CloudWatch log retention. |

:::warning
OpenSearch is often a more fixed monthly cost than FormKiQ's core serverless services. If enhanced full-text search is enabled, include OpenSearch sizing in your cost estimate early.
:::

## AWS Free Tier

New AWS accounts may qualify for [AWS Free Tier](https://aws.amazon.com/free/) usage on some services. Free Tier eligibility and limits vary by service, account age, and region.

Do not assume Free Tier coverage for production planning. Treat it as a temporary evaluation benefit, then estimate steady-state monthly usage without Free Tier discounts.

## Example Estimate Inputs

Use these scenarios as planning inputs for the AWS Pricing Calculator. They are intentionally framed as assumptions rather than fixed price totals.

### Document Management Operations

#### Adding 1 Million Documents

Assumptions to estimate:

- Average document size
- S3 storage class
- Number of S3 PUT requests
- Number of API requests per document
- Lambda executions per document
- DynamoDB writes per document
- Search indexing actions, if enabled
- OCR or document actions, if enabled

For 1 million documents at 1 MB each, storage volume is roughly 1 TB before versioning, replication, derived files, thumbnails, OCR output, or search index storage.

#### Viewing or Downloading 1 Million Documents

Assumptions to estimate:

- Average document size
- Number of metadata reads
- Number of S3 GET requests
- Data transfer out
- CloudFront usage, if content or console traffic is delivered through CloudFront
- API Gateway request volume
- Lambda execution count and duration

Data transfer can dominate this scenario if users download large documents frequently.

### Document Processing

#### OCR or IDP Processing

Assumptions to estimate:

- Number of documents processed
- Number of pages per document
- File type: text PDF, scanned PDF, image, or mixed content
- Processing method: Tesseract, Lambda-based extraction, Amazon Textract, or commercial IDP workflow
- Retry rate and failed-document handling
- Whether results are stored, indexed, or used in downstream workflows

For Textract-based processing, estimate page volume using [Amazon Textract pricing](https://aws.amazon.com/textract/pricing/).

### Migration or Bulk Import

Large imports can temporarily increase cost because they create bursts of API Gateway requests, Lambda executions, S3 requests, DynamoDB writes, queue activity, indexing work, and logs.

Estimate:

- Source document count and total GB
- Import duration target
- Concurrency level
- Metadata writes per document
- Search indexing requirements
- OCR or classification actions triggered during import
- CloudWatch log volume and retention

For migration planning, see [Migration and Data Import](/docs/platform/migration-and-data-import).

## Illustrative Cost Examples

The tables below are approximate examples to help customers understand order of magnitude. They are not quotes and should be recalculated for the target AWS region, current AWS prices, selected modules, retention policy, and actual usage profile.

:::note
These examples do not include FormKiQ subscription pricing, AWS Free Tier benefits, volume discounts, taxes, support plans, custom networking, backup exports, or every optional AWS charge.
:::

### Adding 1 Million Documents

Assumptions:

- 1 million documents
- 1 MB average document size
- About 1 TB of primary document storage
- Basic metadata writes and document processing
- No OCR, antivirus, OpenSearch, replication, or additional document versions

| Service | Example usage | Approximate cost |
|---------|---------------|------------------|
| DynamoDB storage | 1 GB metadata estimate | $0.25 |
| DynamoDB writes | 3M write requests | $7.00 |
| AWS Lambda | 2M requests, 200ms average | $10.00 |
| S3 PUT requests | 2M requests | $10.00 |
| S3 Standard storage | 1 TB | $30.00/month |
| S3 Glacier Instant Retrieval storage | 1 TB alternative | $5.00/month |
| **Approximate total** | S3 Standard storage | **$57.25** |
| **Approximate total** | Glacier Instant Retrieval storage alternative | **$32.25** |

### Viewing 1 Million Documents

Assumptions:

- 1 million document views or downloads
- 1 MB average document size
- About 1 TB transferred
- Basic metadata reads

| Service | Example usage | Approximate cost |
|---------|---------------|------------------|
| DynamoDB reads | 1M read requests | $0.13 |
| S3 data transfer | 1 TB transferred | $92.16 |
| **Approximate total** | Metadata reads plus transfer | **$92.29** |

### OCR Processing

OCR cost varies significantly based on document type, page count, parsing method, and whether Amazon Textract is used.

#### 1 Million PDF Documents

| Method | Example volume | Approximate cost |
|--------|----------------|------------------|
| AWS Lambda extraction for digital PDFs | 1M documents, 600ms average | $20.20 |
| Tesseract via Lambda | 1M pages, 3000ms average | $30.20 |
| Amazon Textract text extraction | 1M pages | $1,500.00 |

#### 1 Million Images

| Method | Example volume | Approximate cost |
|--------|----------------|------------------|
| Tesseract via Lambda | 1M pages, 3000ms average | $100.20 |
| Amazon Textract text extraction | 1M pages | $1,500.00 |

## OpenSearch Service Costs {#opensearch-service-costs}

[Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service) provides enhanced search capabilities. Costs vary based on configuration, region, storage, and instance commitment.

:::note
See [Sizing Cluster](/docs/formkiq-modules/modules/enhanced-fulltext-document-search#opensearch-configuration) for detailed requirements.
:::

When estimating OpenSearch, include:

- Data node instance type and count
- Dedicated master node instance type and count, if used
- Storage volume and storage type
- Replica count
- Multi-AZ or Multi-AZ with Standby configuration
- Snapshot storage and retention
- Indexing throughput
- Query throughput
- Reserved Instance commitment, if appropriate

### Example Availability Configurations

#### Enterprise (99.99% Availability)

- Multi-AZ with Standby
- 3 AZs, with active and standby capacity
- Dedicated master nodes
- Multiple data nodes
- Higher fixed monthly cost
- Stronger availability profile for production search

| Component | Example specification | Approximate monthly cost |
|-----------|-----------------------|--------------------------|
| Master nodes | 3x `m6g.large.search` | $280 |
| Data nodes | 3x `r6g.xlarge.search` | $733 |
| Storage | 2.6 TB | $351 |
| **Approximate total** | On-Demand | **$1,364/month** |

#### Standard HA

- Multi-AZ without Standby
- 3 AZs active
- Data nodes without dedicated masters in smaller configurations
- Lower cost than standby architecture
- Common fit for production environments with moderate search requirements

| Component | Example specification | Approximate monthly cost |
|-----------|-----------------------|--------------------------|
| Data nodes | 3x `r6g.large.search` | $365 |
| Storage | 2.6 TB | $351 |
| **Approximate total** | On-Demand | **$716/month** |

#### Basic HA (2 AZ)

- 2 AZ configuration
- 2 data nodes
- 1 replica per shard
- Lower baseline capacity

:::warning
This configuration has increased risk of data loss and downtime compared with stronger Multi-AZ options.
:::

| Component | Example specification | Approximate monthly cost |
|-----------|-----------------------|--------------------------|
| Data nodes | 2x `r6g.xlarge.search` | $490 |
| Storage | 1.8 TB | $243 |
| **Approximate total** | On-Demand | **$733/month** |

Use [OpenSearch Service pricing](https://aws.amazon.com/opensearch-service/pricing/) and the [AWS Pricing Calculator](https://calculator.aws/) to estimate the selected configuration in your target region.

## How to Reduce Cost

Use these controls when planning or operating FormKiQ:

- Use presigned S3 uploads for larger files so large payloads go directly to S3.
- Use S3 lifecycle policies for older versions, archived content, and long-retention workloads.
- Avoid full-text indexing for documents that only need metadata or attribute search.
- Choose the smallest search backend that satisfies document volume, indexing rate, and query latency needs.
- Batch migrations with controlled concurrency instead of overwhelming downstream services.
- Review CloudWatch log retention so high-volume processing does not create unnecessary log storage.
- Monitor DynamoDB throttling and access patterns before increasing write volume.
- Use OpenSearch Reserved Instances only when the search workload is stable enough to justify commitment.
- Remove test environments or optional modules when they are no longer needed.

## Monitoring AWS Spend

For production deployments, configure AWS cost visibility outside FormKiQ:

- AWS Budgets for monthly cost alerts
- Cost Explorer for service-level spend trends
- Cost allocation tags where supported
- CloudWatch metrics for API Gateway, Lambda, DynamoDB, S3, SQS, SNS, and OpenSearch
- Log retention policies for CloudWatch Logs

## Where to Go Next

- Understand storage cost drivers: [Document Storage](/docs/platform/document_storage)
- Review scaling considerations: [Platform Overview](/docs/platform/overview#scaling-formkiq-components)
- Plan recovery and retention: [Backup and Recovery](/docs/platform/backup_and_recovery)
- Plan migrations: [Migration and Data Import](/docs/platform/migration-and-data-import)
- Review search options: [Search](/docs/features/search)
