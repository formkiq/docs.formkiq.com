---
sidebar_position: 7
---

# Costs

FormKiQ is built using [serverless technology](https://aws.amazon.com/serverless). This means that there are no servers to manage; everything is managed by AWS. All of the AWS services FormKiQ uses have pay-per-usage billing (with only one exception, OpenSearch, an add-on module). You can start using FormKiQ with very little cost.
 
In fact, AWS provides a [free tier](https://aws.amazon.com/free) to all AWS accounts. This means that some AWS services you can use for **free**, assuming you are able to stay within the usage limits. Below is the list of services FormKiQ uses and their approximate usage costs, so give you an idea on how much it costs to run FormKiQ. (All costs in USD)

| Service    | Cost |
| -------- | ------- |
| [Amazon Api Gateway](https://aws.amazon.com/api-gateway/pricing) |   $1.00 per million requests |
| [Amazon DynamoDB](https://aws.amazon.com/dynamodb/pricing/on-demand) (Storage)  |  First 25 GB Free |
| [Amazon DynamoDB](https://aws.amazon.com/dynamodb/pricing/on-demand) (Writes) |Write request units - $1.25 per million write request units |
| [Amazon DynamoDB](https://aws.amazon.com/dynamodb/pricing/on-demand) (Reads) |Read request units - $0.25 per million read request units |
| [Amazon CloudFront](https://aws.amazon.com/cloudfront/pricing) |   $0.085 per GB of Data Transfer Out to Internet |
| [Amazon S3](https://aws.amazon.com/s3/pricing) |   $0.023 per GB / Month |
| [AWS Lambda](https://aws.amazon.com/lambda/pricing) |   approx. first 400,000 requests Free per Month ($0.0000168667 per additional request) |

## Cost Estimator

Because of AWS' pay-per-usage model, it can be difficult to determine approximately what your hosting fees will be. The [AWS Pricing Calculator](https://calculator.aws/#/) can be useful to establish general costs. Below we have scenarios that gives you an idea of what your costs maybe.

These scenarios do NOT include AWS' free tier or potential cost savings when higher usage tiers are reached.

:::note
All prices are shown in USD
:::

### Adding - 1 million documents

Scenario: Adding 1 million documents, each document is 1 MB in size

| Service    | Unit | Cost |
| -------- | ------- | ------- |
| Amazon DynamoDB Storage  | 1 GB (each document stores about 350 bytes of data) | $0.25  |
| Amazon DynamoDB Write  | 3 million requests  | $7.00  |
| AWS Lambda  | 2 million requests (200ms avg per document)  | $10.00   |
| Amazon S3 PUT requests  | 2 million  | $10.00   |
| Amazon S3 (Standard Storage)  | 1 TB  | $30.00 per month  |
| or Amazon S3 (Glacier Instant Retrieval Storage)  | 1 TB  | $5.00 per month  |
| |Total ($) | $57.25 or $32.25 |

### Viewing - 1 million documents

Scenario: Viewing 1 million documents, each document is 1 MB in size

| Service    | Unit | Cost |
| -------- | ------- | ------- |
| Amazon DynamoDB Read Requests  | 1 million requests  | $0.13  |
| Amazon S3 Data Transfer  | 1 TB  | $92.16   |
| |Total ($) | $92.29 |

### OCR - 1 million PDF documents

Scenario: Extracting text from PDF document

FormKiQ supports extracting text from a PDF document in two ways that have a different cost structure/features; many PDFs that were created electronically can have their text extracted programatically, without requiring OCR. For documents that are not fully digitized, such as documents that were scanned from paper or came from a photograph, OCR would be required.

FormKiQ determines whether or not OCR is required automatically.

| Service    | Unit | Cost |
| -------- | ------- | ------- |
| AWS Lambda (Programmatically, for fully-digital PDFs)  | 1 million requests (30 million pages)  (600ms avg per document) | $20.20  |
| [Tesseract](https://github.com/tesseract-ocr/tesseract) (using AWS Lambda, for PDFs that are not fully digital) | 1 million requests (1 million pages)  (3000ms avg per document) | $30.20  |
| [AWS Textract](https://aws.amazon.com/pm/textract) (for PDFs that are not fully digital)  | 1 million pages (text only)  | $1500.00   |


### OCR - 1 million images

Scenario: Extracting text from images, such as PNG

FormKiQ supports extracting text from a PNG document in two ways that have a different cost structure/features. 

| Service    | Unit | Cost |
| -------- | ------- | ------- |
| [Tesseract](https://github.com/tesseract-ocr/tesseract) (using AWS Lambda) | 1 million requests (1 million pages)  (3000ms avg per document) | $100.20  |
| [AWS Textract](https://aws.amazon.com/pm/textract)  | 1 million pages (text only)  | $1500.00   |

## [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service)

FormKiQ uses [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service) to provide enhanced document searching ability. The costs for [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service) can vary greatly depending on requirements and whether you are using On-Demand or Reserved Instances.

See [Sizing Cluster](/docs/add-on-modules/modules/enhanced-fulltext-document-search#amazon-opensearch-service) for determining your cluster requirements.

### Multi-AZ with Standby and Dedicated Master Nodes (99.99% availability)

Multi-AZ with Standby is a deployment option for Amazon OpenSearch Service domains that offers 99.99% availability and consistent performance for production workloads. When you use Multi-AZ with Standby, domains are resilient to infrastructure failures, with no impact to performance or availability.

When you use Multi-AZ with Standby, OpenSearch Service creates a domain across three Availability Zones, with each zone containing a complete copy of data and with the data equally distributed in each of the zones. Your domain reserves nodes in one of these zones as standby, which means that they don't serve search requests. When OpenSearch Service detects a failure in the underlying infrastructure, it automatically activates the standby nodes in less than a minute.

This cluster is set up with the following configuration:

* 3 AZs (2 Active, 1 Standby)
* 3 Data Nodes (2 Active, 1 Standby)
* 3 Master Nodes (1 in each AZ)
* 2 replicas per primary shard
* 2.6 TB of data (based on 600GB storage requirement and 2 replicas)

| Instance Type    | vCPU | Memory (GiB) | Instance Count | Price Per Month (On-Demand) | Price Per Month (Reserved) |
| -------- | ------- | ------- | ------- | ------- | ------- | 
| m6g.large.search (master node) | 2 | 8 | 3 | $280 | $140 - $182 |
| r6g.xlarge.search (data node) | 4 | 32 | 3 | $733 | $367 - $476 |

| Storage  | Cost | Price per Month |
| -------- | ------- | ------- |
| 2.6 TB  | $0.135 / GB | $351 |


### Multi-AZ with No Standby or Dedicated Master Nodes (lower cost, but still provides a level of high availability)

Another Amazon OpenSearch deployment option is to forgo the dedicated masters and use a data node as both a data node and a master. If you are not using dedicated master nodes, it is important to keep the number of data nodes as a multiple of 3. This will allow a new master to be elected if an AZ is lost because a new master can be elected by the remaining 2 nodes.

:::note
If you enable multi-AZ without Standby, you should create at least one replica for each index in your cluster
:::

This cluster is set up with the following configuration:

* 3 AZs (3 Active)
* 3 Data Nodes (3 Active)
* 0 Master Nodes
* 2 replicas per primary shard
* 2.6 TB of data (based on 600GB storage requirement and 2 replicas)

| Instance Type    | vCPU | Memory (GiB) | Instance Count | Price Per Month (On-Demand) | Price Per Month (Reserved) |
| -------- | ------- | ------- | ------- | ------- | ------- | 
| r6g.large.search (data node) | 2 | 16 | 3 | $365 | $183 - $250 |

| Storage  | Cost | Price per Month |
| -------- | ------- | ------- |
| 2.6 TB  | $0.135 / GB | $351 |

:::note
In a domain without a standby available within the third AZ, if one AZ is disrupted, the failover process will have a higher impact on your available resources
:::

### 2 AZs with 2 Data Nodes (comparable cost, but instance type could be reduced further depending on performance needs)

The following configuration exposes you to potential risk of data loss and cluster unavailability. You should weigh the ROI against the cost of downtime and recovery.

This cluster is set up with the following configuration:

* 2 AZs (2 Active)
* 2 Data Nodes (2 Active)
* 0 Master Nodes
* 1 replica per primary shard
* 1.8 TB of data (based on 600GB storage requirement)

| Instance Type    | vCPU | Memory (GiB) | Instance Count | Price Per Month (On-Demand) | Price Per Month (Reserved) |
| -------- | ------- | ------- | ------- | ------- | ------- | 
| r6g.xlarge.search (data node) | 4 | 32 | 2 | $490 | $244 - $317 |

| Storage  | Cost | Price per Month |
| -------- | ------- | ------- |
| 1.8 TB  | $0.135 / GB | $243 |

:::note
In a two-AZ domain, you lose cross-AZ replication if one AZ is disrupted, which can further reduce availability. You also lose half your capacity, which can be more disruptive.
:::