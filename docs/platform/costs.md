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
| [AWS Textract](https://aws.amazon.com/pm/textract) (for PDFs that are not fully digital)  | 1 million pages (text only)  | $1500.00   |


### OCR - 1 million images

Scenario: Extracting text from images, such as PNG

FormKiQ supports extracting text from a PNG document in two ways that have a different cost structure/features. 

| Service    | Unit | Cost |
| -------- | ------- | ------- |
| [Tesseract](https://github.com/tesseract-ocr/tesseract) (using AWS Lambda) | 1 million requests (1 million pages)  (3000ms avg per document) | $100.20  |
| [AWS Textract](https://aws.amazon.com/pm/textract)  | 1 million pages (text only)  | $1500.00   |

