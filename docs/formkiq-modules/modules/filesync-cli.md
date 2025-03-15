---
sidebar_position: 1
---

# FileSync CLI

## Overview

The FileSync CLI is an Enterprise Add-On Module that enables:
- Document synchronization between local file systems and FormKiQ
- Document synchronization with OpenSearch
- Automated file monitoring and sync

![FormKiQ File Sync Module](./img/formkiq_filesync_module.png)

## Installation

### Prerequisites

1. Access your [AWS CloudFormation Console](https://console.aws.amazon.com/cloudformation)
2. Locate your FormKiQ installation
3. Note the following from Stack Outputs:
   - `IamApiUrl`
   - `DocumentsTableName`

![FormKiQ CloudFormation Outputs](./img/cf-filesync-cli-output-parameters.png)

:::note
FileSync CLI supports multiple FormKiQ installations
:::

### CloudFormation Setup

1. Create a new CloudFormation stack for FileSync CLI
2. Configure stack parameters:
   - Stack Name
   - Comma-delimited list of FormKiQ DocumentsTable ARN(s)

![FileSync CLI Stack Details](./img/cf-filesync-cli-stack-details.png)

3. Note the `AccessKey` and `SecretKey` from stack Outputs

![CloudFormation FileSync CLI Outputs](./img/cf-filesync-cli-outputs.png)

### CLI Installation

#### Download Options

| Platform | Location |
|----------|-----------|
| Windows | s3://YOUR-FORMKIQ-S3-BUCKET/cli/formkiq-filesync-cli-VERSION-windows-amd64.zip |
| Linux | s3://YOUR-FORMKIQ-S3-BUCKET/cli/formkiq-filesync-cli-VERSION-linux-amd64.zip |
| macOS | s3://YOUR-FORMKIQ-S3-BUCKET/cli/formkiq-filesync-cli-VERSION-darwin-amd64.zip |

#### Installation Steps

1. Open [AWS CloudShell](https://console.aws.amazon.com/cloudshell/home)

2. Copy CLI artifact:
```bash
aws s3 cp s3://YOUR-FORMKIQ-S3-BUCKET/cli/formkiq-filesync-cli-VERSION-windows-amd64.zip .
```

3. Download file through CloudShell Actions menu

![AWS CloudShell FormKiQ CLI Download](./img/cloudshell-cli-download.png)

## Usage

### Command Overview
```
usage: fk
    --configure          configure AWS credentials
    --delete-documents   Delete documents
    --delete-site        Delete Site
    --import            Import csv file
    --list              list document ids
    --show              show sync profiles
    --sync              sync files with FormKiQ
    --sync-dynamodb     sync documents between dynamodb tables
    --sync-opensearch   sync documents with Opensearch
    --watch             watch directories for file changes
```

### Configuration

Required information:
- Access Key and Secret Key from FileSync CLI stack
- DocumentsStageS3Bucket from FormKiQ stack
- AWS Region of installation

Basic configuration:
```bash
fk --configure --access-key ACCESS_KEY \
               --secret-key ACCESS_SECRET \
               --region AWS_REGION \
               --iam-api-url IAM_API_URL \
               --documents-dynamodb-tablename DOCUMENTS_TABLE_NAME
```

With profile:
```bash
fk --configure --access-key ACCESS_KEY \
               --secret-key ACCESS_SECRET \
               --region AWS_REGION \
               --iam-api-url IAM_API_URL \
               --documents-dynamodb-tablename DOCUMENTS_TABLE_NAME \
               --profile dev
```

List configurations:
```bash
fk --show
```

### File Synchronization

#### Basic Sync
```bash
fk --sync -d /documents --verbose
```

#### S3 Sync
```bash
fk --sync -d s3://myBucket/documents --verbose
```

#### Time-based Sync
```bash
# Last 24 hours
fk --sync -d /documents --verbose --mtime 0

# Older than 7 days
fk --sync -d /documents --verbose --mtime 7

# Last 30 days
fk --sync -d /documents --verbose --mtime -30
```

#### Actions Sync
```bash
fk --sync --actions '[
  {
    "type": "OCR",
    "parameters": {
      "ocrParseTypes": "TABLES"
    }
  },
  {
    "type": "FULLTEXT"
  },
  {
    "type": "WEBHOOK",
    "parameters": {
      "url": "https://pipedream.com/12345"
    }
  }
]' -d /documents --verbose
```

### Watch Mode
```bash
fk --watch -d /documents --verbose
```

### Database Operations

#### DynamoDB Sync
```bash
fk --sync-dynamodb \
    --source formkiq-enterprise-dev1-documents \
    --destination formkiq-enterprise-dev2-documents
```

#### OpenSearch Sync
```bash
# Sync specific documents
fk --sync-opensearch --document-ids 2def5ec0-0d6e-4912-916d-cdfca99575c9 -v

# Sync all documents
fk --sync-opensearch --document-ids all -v

# Sync with content
fk --sync-opensearch --document-ids all --content -v
```

### Document Management

#### List Documents
```bash
fk --list --limit 100
```

#### Delete Documents
```bash
# Generate list
fk --list > documents.txt

# Delete documents
fk --delete-documents --file documents.txt
```

### Pre-Hook Integration

The `--pre-hook` parameter enables document-specific customization during sync.

Request Format:
```json
{
    "path": "<filename>",
    "config": {
        "directory": "<directory>",
        "actions": "<actions>",
        "siteId": "<siteId>",
        "stagebucket": "<stagingbucket>"
    }
}
```

Response Example:
```json
{
  "tags": [
    {
      "key": "category",
      "value": "document"
    },
    {
      "key": "user",
      "values": ["1", "2"]
    }
  ],
  "metadata": [
    {
      "key": "property1",
      "value": "value1"
    }
  ]
}
```
