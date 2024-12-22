---
sidebar_position: 5
---

# Document Storage

FormKiQ uses [Amazon Simple Storage Service (Amazon S3)](https://aws.amazon.com/s3/) as its document storage backend. S3 provides:
- Industry-leading scalability and availability
- Enterprise-grade security
- High performance
- Cost-effective storage with multiple storage classes
- Fine-grained access controls for compliance requirements

## Storage Architecture

FormKiQ deploys two S3 buckets by default:

| Bucket | Purpose |
|--------|---------|
| Staging | Temporary storage for documents awaiting processing |
| Documents | Permanent storage for processed documents |

## Document Organization

### S3 Key Structure
FormKiQ uses a specific S3 key structure to support multi-tenant document management:

1. **Default Tenant Documents**
   - Root-level files (e.g., `document1.txt`) belong to the `DEFAULT` siteId
   - Files can also use the `default/` prefix (e.g., `default/document1.txt`)

2. **Tenant-Specific Documents**
   - Use tenant name as prefix (e.g., `group1/document1.txt`)
   - Documents belong to the tenant specified in the prefix

3. **Path Support** (v1.7.0+)
   - Automatically creates `path` tags for nested documents
   - Must start with either `default/` or `{siteId}/`
   - Examples:
     - `default/dir1/dir2/document1.txt` → path: `dir1/dir2/document1.txt` (default tenant)
     - `group1/dir1/dir2/document2.txt` → path: `dir1/dir2/document2.txt` (group1 tenant)

## Document Processing Workflow

![S3 Architecture](./img/architecture_s3.png)

### Standard Flow
1. Documents are added via FormKiQ API or directly to the Staging bucket
2. S3 create event triggers Document Create Lambda
3. Lambda:
   - Creates DynamoDB record
   - Moves document to Documents bucket
4. Documents bucket triggers:
   - Message added to Update Document SQS queue
   - Update Document Lambda processes metadata and tags
   - SNS notification for additional processing

:::note
Every document creation or update triggers an SNS notification, enabling custom processing workflows.
:::

## Direct Upload Format (FKB64)

For special cases like bulk migration, FormKiQ supports direct uploads to the Staging bucket using the `.fkb64` format.

:::warning
Never upload files directly to the Documents bucket - this can cause system instability.
:::

### FKB64 File Specification
Files must:
- End in `.fkb64` extension
- Contain valid JSON matching the [Add Document Request](https://docs.formkiq.com/docs/latest/api/index.html#tag/Documents/operation/AddDocument) format

Required fields:
```json
{
  "userId": "joesmith",
  "contentType": "text/plain",
  "isBase64": true,
  "content": "dGhpcyBpcyBhIHRlc3Q=",
  
  // Optional fields
  "path": "document1.txt",
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

:::note
See the [API documentation](https://docs.formkiq.com/docs/latest/api/index.html#tag/Documents/operation/AddDocument) for all available properties.
:::