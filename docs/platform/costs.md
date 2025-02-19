---
sidebar_position: 7
---

# Cost Overview

FormKiQ leverages [AWS serverless technology](https://aws.amazon.com/serverless) to provide a pay-per-use pricing model. With no servers to manage and AWS handling the infrastructure, you only pay for what you use. All FormKiQ services use pay-per-usage billing, except for OpenSearch (an optional add-on module).

## AWS Free Tier Benefits

New AWS accounts can take advantage of the [AWS Free Tier](https://aws.amazon.com/free), allowing you to use certain services for free within usage limits. Here are the core services FormKiQ uses and their base pricing (USD):

| Service | Cost |
|---------|------|
| [Amazon API Gateway](https://aws.amazon.com/api-gateway/pricing) | $1.00 per million requests |
| [Amazon DynamoDB](https://aws.amazon.com/dynamodb/pricing/on-demand) Storage | First 25 GB Free |
| [Amazon DynamoDB](https://aws.amazon.com/dynamodb/pricing/on-demand) Writes | $1.25 per million write request units |
| [Amazon DynamoDB](https://aws.amazon.com/dynamodb/pricing/on-demand) Reads | $0.25 per million read request units |
| [Amazon CloudFront](https://aws.amazon.com/cloudfront/pricing) | $0.085 per GB of Data Transfer Out |
| [Amazon S3](https://aws.amazon.com/s3/pricing) | $0.023 per GB / Month |
| [AWS Lambda](https://aws.amazon.com/lambda/pricing) | First 400,000 requests/month Free ($0.0000168667 per additional) |

## Usage Scenarios and Cost Estimates

:::note
All prices are in USD and do not include AWS Free Tier benefits or volume discounts
:::

### Document Management Operations

#### Adding 1 Million Documents (1MB each)

| Service | Unit | Cost |
|---------|------|-------|
| DynamoDB Storage | 1 GB (350 bytes/document) | $0.25 |
| DynamoDB Write | 3M requests | $7.00 |
| AWS Lambda | 2M requests (200ms avg) | $10.00 |
| S3 PUT requests | 2M requests | $10.00 |
| S3 Standard Storage | 1 TB | $30.00/month |
| S3 Glacier Instant Retrieval | 1 TB | $5.00/month |
| **Total** | | **$57.25** (or as low as **$32.25** with Instant Retrieval) |

#### Viewing 1 Million Documents (1MB each)

| Service | Unit | Cost |
|---------|------|-------|
| DynamoDB Read | 1M requests | $0.13 |
| S3 Data Transfer | 1 TB | $92.16 |
| **Total** | | **$92.29** |

### Document Processing

#### OCR Processing - 1M PDF Documents

FormKiQ automatically determines the optimal OCR method based on document type:

| Method | Volume | Cost |
|--------|---------|-------|
| AWS Lambda (Digital PDFs) | 1M docs (30M pages) @ 600ms/doc | $20.20 |
| [Tesseract](https://github.com/tesseract-ocr/tesseract) via Lambda | 1M pages @ 3000ms/doc | $30.20 |
| [AWS Textract](https://aws.amazon.com/pm/textract) | 1M pages (text only) | $1,500.00 |

#### OCR Processing - 1M Images

| Method | Volume | Cost |
|--------|---------|-------|
| Tesseract via Lambda | 1M pages @ 3000ms/doc | $100.20 |
| AWS Textract | 1M pages (text only) | $1,500.00 |

## OpenSearch Service Costs

[Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service) provides enhanced search capabilities. Costs vary based on configuration and instance commitment (On-Demand vs Reserved).

:::note
See [Sizing Cluster](/docs/add-on-modules/modules/enhanced-fulltext-document-search#amazon-opensearch-service) for detailed requirements
:::

### High Availability Configurations

#### Enterprise (99.99% Availability)
- Multi-AZ with Standby
- 3 AZs (2 Active, 1 Standby)
- 3 Data Nodes + 3 Master Nodes
- 2 replicas per shard
- 2.6 TB storage capacity

| Component | Specification | Monthly Cost (On-Demand) | Monthly Cost (Reserved) |
|-----------|---------------|-------------------------|------------------------|
| Master Nodes | 3x m6g.large.search | $280 | $140-$182 |
| Data Nodes | 3x r6g.xlarge.search | $733 | $367-$476 |
| Storage (2.6 TB) | $0.135/GB | $351 | $351 |
| **Total** | | **$1,364** | **$858-$1,009** |

#### Standard HA
- Multi-AZ without Standby
- 3 AZs (all active)
- 3 Data Nodes (no dedicated masters)
- 2 replicas per shard
- 2.6 TB storage capacity

| Component | Specification | Monthly Cost (On-Demand) | Monthly Cost (Reserved) |
|-----------|---------------|-------------------------|------------------------|
| Data Nodes | 3x r6g.large.search | $365 | $183-$250 |
| Storage (2.6 TB) | $0.135/GB | $351 | $351 |
| **Total** | | **$716** | **$534-$601** |

#### Basic HA (2 AZ)
- 2 AZs configuration
- 2 Data Nodes
- 1 replica per shard
- 1.8 TB storage capacity

:::warning
This configuration has increased risk of data loss and downtime
:::

| Component | Specification | Monthly Cost (On-Demand) | Monthly Cost (Reserved) |
|-----------|---------------|-------------------------|------------------------|
| Data Nodes | 2x r6g.xlarge.search | $490 | $244-$317 |
| Storage (1.8 TB) | $0.135/GB | $243 | $243 |
| **Total** | | **$733** | **$487-$560** |