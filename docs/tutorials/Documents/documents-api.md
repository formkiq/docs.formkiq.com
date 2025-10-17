---
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 2
---
# Documents API

## Overview

The Documents API is the core of the FormKiQ platform. It enables developers to create, manage, and retrieve documents and their associated metadata through RESTful endpoints.

## Prerequisites

- A valid FormKiQ account or API environment
- [Access credentials and FormKiQ API Endpoint URL](/docs/getting-started/api-walkthrough#acquire-access-token)
- Familiarity with REST APIs and JSON payloads

## Create a Document

The Create Document endpoints let you register new documents in FormKiQ. You can either upload document content directly (for smaller files) or request a presigned S3 upload URL (for larger files). Each created document can include metadata and optional tags or classification information that define how the document will be managed and searched later.

### POST /documents

This endpoint allows the creation of a document or a deep link document.
Either content or deeplink is required in the request body — meaning the document must either include data or point to an external file.

The content can be plain text or Base64-encoded binary. The maximum allowed document size is 5 MB.

#### Common use cases
- Create a text-based or JSON document inline (e.g., structured data or logs).
- Create a document record for a PDF or image by embedding Base64 content.
- Register a deep link to external content (like an S3 key or external URL) for reference management.

#### Example (plain-text content)

```bash
curl -X POST "$BASE_URL/documents?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "reports/2025/Q1-summary.txt",
    "contentType":"text/plain"
    "content": "Quarterly revenue increased by 12% year over year."
  }'
```

#### Example (Base64-encoded content)

```bash
curl -X POST "$BASE_URL/documents?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "images/receipt-123.png",
    "contentType":"image/png"
    "content": "iVBORw0KGgoAAAANSUhEUgAAAAUA..."
  }'
```

#### Example (deep link)

```bash
curl -X POST "$BASE_URL/documents?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deeplink": "https://external-bucket.s3.amazonaws.com/docs/invoice.pdf"
  }'
```

#### Response (201 Created)
```json
{
  "documentId": "c5590f65-7a36-4cb4-b0be-549849bbbcdf"
}
```

### POST /documents/upload

This endpoint behaves like /documents but is optimized for large file uploads (up to 5 GB).
Instead of embedding the content, it returns a presigned S3 upload URL you can use to upload the document directly. The API includes optional integrity parameters — checksumType and checksum — that the server uses to validate the uploaded file once S3 confirms the PUT.
The response always includes S3 headers (e.g., x-amz-checksum-) that are required when performing the PUT upload to S3.

#### Common use cases

- Upload large binary files (PDFs, videos, or scanned images)
- Provide checksum validation (SHA1 or SHA256) to ensure integrity.


#### Example (request presigned URL)

```bash
curl -X POST "$BASE_URL/documents/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-siteid: $SITE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "contracts/2025/contract-123.pdf",
    "contentType":"application/pdf"
  }'
```

#### Example response (201 Created)

```json
{
  "documentId": "b2c3d4e5-...-x1",
  "uploadUrl": "https://s3.amazonaws.com/formkiq-uploads/...signature..."
}
```

#### Example (uploading file to S3)

```bash
curl -X PUT "https://s3.amazonaws.com/formkiq-uploads/...signature..." \
  -H "Content-Type: application/pdf" \
  --data-binary @contract-123.pdf
```

#### Example — request presigned URL with checksum

```bash
curl -X POST "$BASE_URL/documents/upload?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "contracts/2025/contract-123.pdf",
    "checksumType": "SHA256",
    "checksum": "a2f5fcb3e8c79e89fbc2f44231d89b45fdb68e58c40c57c2af5d6bbecdc42f8a"
  }'
```

#### Example response (201 Created)
```
{
  "documentId": "f0bdf37f-5b2e-42fa-94d6-480a5536d188",
  "uploadUrl": "https://s3.amazonaws.com/formkiq-uploads/...signature...",
  "headers": {
    "x-amz-checksum-sha256": "a2f5fcb3e8c79e89fbc2f44231d89b45fdb68e58c40c57c2af5d6bbecdc42f8a",
    "Content-Type": "application/pdf"
  }
}
```

#### Example — upload file to S3 using returned URL and headers

```bash
curl -X PUT "https://s3.amazonaws.com/formkiq-uploads/...signature..." \
  -H "Content-Type: application/pdf" \
  -H "x-amz-checksum-sha256: a2f5fcb3e8c79e89fbc2f44231d89b45fdb68e58c40c57c2af5d6bbecdc42f8a" \
  --data-binary @contract-123.pdf
```

## Get a Document

Retrieves a document’s metadata, not its actual file content. This includes properties such as the document’s path, creation details, size, checksum, and associated metadata fields like tags, attributes, and classifications.

### Example request

```bash
curl "$BASE_URL/documents/$DOC_ID?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
```

### Example response

```json
{
  "documentId": "4b0e5a2d-91b6-4fd8-8d4a-7e4e1c91bdb3",
  "path": "invoices/2025/INV-12345.pdf",
  "checksum": "b1946ac92492d2347c6235b4d2611184",
  "contentType": "application/pdf",
  "contentLength": 482133,
  "createdDate": "2025-10-17T15:25:03Z",
  "lastModifiedDate": "2025-10-17T15:25:03Z"
}
```

## List Documents

Retrieves a paginated list of documents for a given site. By default, it returns the most recent documents added, ordered by their insertion date in descending order. You can optionally filter results by processing state (actionStatus) or include soft-deleted documents using specific query parameters.

### Listing documents with no extra parameters

When called without query parameters, /documents returns all active (non-deleted) documents belonging to the site. This is the most common request type and provides basic pagination support using the limit and next parameters.

#### Common use cases
- Show the most recent uploaded documents in a dashboard.
- Display paginated results for browsing documents.
- Build administrative views that list all available files.

#### Example request

```bash
curl -X GET "$BASE_URL/documents?siteId=$SITE_IDlimit=25" \
  -H "Authorization: Bearer $TOKEN" \
```

#### Example response

```json
{
  "documents": [
    {
      "documentId": "b8c16e74-1a23-482a-bc89-3fe4c8baf123",
      "path": "reports/2025/Q1-summary.pdf",
      "createdDate": "2025-10-17T14:00:00Z"
    },
    {
      "documentId": "59c4a29a-46ee-4784-bd3d-84a9e67a6ff0",
      "path": "reports/2025/Q1-draft.pdf",
      "createdDate": "2025-10-17T13:30:00Z"
    }
  ],
  "next": "eyJwYWdlIjoyfQ=="
}
```

### Listing documents with `actionStatus` parameter

You can use the actionStatus parameter to fetch documents that have an associated action (e.g., antivirus scan, OCR, workflow step) in a specific state such as FAILED, IN_QUEUE, or RUNNING.

#### Common use cases
- Find documents where background actions (OCR, antivirus, etc.) have failed and need retry.
- Monitor processing queues by checking documents in IN_QUEUE or RUNNING status.
- Build dashboards to track system processing health.

#### Example request (failed actions)

```curl
curl -X GET "$BASE_URL/documents?siteId=$SITE_ID&actionStatus=FAILED" \
  -H "Authorization: Bearer $TOKEN"
```

#### Example response

```json
{
  "documents": [
    {
      "documentId": "a39f3f45-892c-4b1b-8b71-c3c3b2b9a6d0",
      "path": "uploads/contract-789.pdf",
      "createdDate": "2025-10-15T10:05:00Z",
      "metadata": {
        "lastAction": "ANTIVIRUS_SCAN",
        "failureReason": "Timeout contacting AV engine"
      }
    }
  ]
}
```

### Fetch soft-deleted documents

When documents are soft deleted, they can still be listed using the deleted=true query parameter. This helps administrators review or restore deleted content.

#### Common use cases
- Review documents recently deleted by users for audit or recovery.
- Build a “trash bin” view to restore deleted files.
- Validate retention policies before performing a purge.

#### Example request

```bash
curl -X GET "$BASE_URL/documents?siteId=$SITE_ID&deleted=true" \
  -H "Authorization: Bearer $TOKEN"
```

#### Example response

```json
{
  "documents": [
    {
      "documentId": "ec3e12d5-93f8-432e-92df-0f9176e7a903",
      "path": "contracts/2024/contract-legacy.pdf",
      "deletedDate": "2025-10-10T08:15:00Z",
      "metadata": {
        "category": "Legal",
        "reason": "Expired contract"
      }
    }
  ],
}
```

## Update a Document

Use these endpoints to update a document’s metadata (title, custom attributes, tags, path, etc.) and to obtain a presigned S3 URL for updating the document’s content. 

With PATCH /documents/:documentId, you update fields on the record; in your workflow, the response always includes a presigned URL you can immediately use to upload/replace content.
  ￼
When you only need an upload URL (especially for files > 5 MB), call GET /documents/:documentId/upload to retrieve a presigned URL for that specific document. If versions are enabled, uploading via this URL creates a new version.  ￼

### PATCH /documents/:documentId

Update document metadata (e.g., path, content-type, etc), the response always includes a presigned URL you can use to upload/replace content.

Common use cases.
- Revise metadata
- Move a document by changing path to a new folder or prefix (e.g., inbox/ → clients/acme/).
- Request a presigned URL from the response and then push updated content directly to S3.

#### Update PATH metadata

```bash
curl -X PATCH "$BASE_URL/documents/$DOC_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-siteid: $SITE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "clients/acme/2025/invoices/INV-12345.pdf"      
  }'
```

#### Example response (200)

```json
{
  "documentId": "0c736575-6592-4bf6-9e2e-46352f1a354a",
  "uploadUrl": "https://s3.amazonaws.com/formkiq-uploads/...signature..."
}
```

### GET /documents/:documentId/upload

Returns a presigned S3 URL that you can PUT to in order to upload/replace large content (> 5 MB) for an existing document. Supports optional parameters like contentLength, duration, and checksum fields to control upload behavior.

#### Use cases
- Replace content on an existing document without changing metadata.
- Upload large binaries (PDFs/images) directly to S3 with client-side PUT.
- Enforce integrity by providing checksum/checksumType and expected contentLength.

#### Example Request

```bash
curl -X GET "$BASE_URL/documents/$DOC_ID/upload?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN"
```

#### Example Response

```json
{
  "uploadUrl": "https://s3.amazonaws.com/formkiq-uploads/...signature..."
}
```

#### Upload the file to S3 using the presigned URL
```bash
curl -X PUT "https://s3.amazonaws.com/formkiq-uploads/...signature..." \
  -H "Content-Type: application/pdf" \
  --data-binary @invoice-updated.pdf
```

## Delete a Document

The DELETE /documents/:documentId endpoint deletes a document’s metadata, attributes, and contents.
This operation supports two deletion modes:
- Soft Delete (softDelete=true) — temporarily removes the document from all standard API listings and retrievals, but keeps it recoverable.
- Hard Delete — permanently removes the document and its metadata (non-recoverable). Document contents are still stored in S3 but with the "deleted" flag turned on.

Soft-deleted documents can be listed later using GET /documents?deleted=true and restored using PUT /documents/:documentId/restore.

### Soft Delete

Soft delete hides a document while keeping it available for restore. It is the recommended approach for general deletion actions, audit safety, or retention workflows.

#### Common use cases

- Temporarily remove a document from active listings.
- Support a “trash bin” feature where documents can be reviewed before permanent deletion.
- Protect against accidental data loss while maintaining version and audit history.

#### Example request
```bash
curl -X DELETE "$BASE_URL/documents/$DOC_ID?siteId=$SITE_ID&softDelete=true" \
  -H "Authorization: Bearer $TOKEN"
```

#### Example response
```json
{
  "message": "Document soft-deleted"
}
```

#### To retrieve soft-deleted documents
```bash
curl -X GET "$BASE_URL/documents?siteId=$SITE_ID&deleted=true" \
  -H "Authorization: Bearer $TOKEN"
```

#### Example response
```json
{
  "documents": [
    {
      "documentId": "a1b2c3d4-...-z9",
      "path": "archive/old-report.pdf"
    }
  ]
}
```

### Hard Delete

Hard delete (softDelete=false) permanently removes the document record and content (S3 versioned) from FormKiQ.

#### Example request
```bash
curl -X DELETE "$BASE_URL/documents/$DOC_ID?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN"
```

#### Example response
```json
{
  "message": "Document deleted",
}
```

## Restore a Document

The PUT /documents/:documentId/restore endpoint reverses a prior soft delete, making the document visible in normal listings and retrievable again. Use it to recover items that were removed with softDelete=true or to fulfill audit/records requests that require bringing content back online. The OpenAPI spec explicitly defines this restore endpoint and its intent to "Restore soft deleted document."

### Common use cases

- Undo an accidental soft delete to recover a document for users
- Re-enable archived content temporarily for audits or legal review
- Reinstate a document after a business process determines it should remain active

### Restore a soft-deleted document

```bash
curl -X PUT "$BASE_URL/documents/$DOC_ID/restore?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### Example response (200)

```json
{
  "message": "Document restored"
}
```

## Purge a Document

The DELETE /documents/:documentId/purge endpoint permanently removes the document’s S3 objects (including all previous versions) and its metadata so that no trace remains, aside from audit logs/backups—this is not recoverable. Access is restricted to elevated roles (e.g., ADMIN or GOVERN), and should be used when policy mandates complete disposition after retention periods.  ￼  ￼
### Common use cases
- Enforce end-of-life records disposition required by compliance/retention policy
- Remove mistakenly ingested sensitive content that must not persist in storage
- Reduce storage footprint by permanently deleting obsolete content in admin workflows

### Purge a document

```bash
curl -X DELETE "$BASE_URL/documents/$DOC_ID/purge?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### Example response (200)

```json
{
  "message": "Document purged"
}
```

## Next Steps

- Explore Document Tags, [Attributes](/docs/tutorials/Documents/document-attributes-api), and Document Actions APIs.