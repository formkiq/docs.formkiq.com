---
sidebar_position: 12
---

# OCR and Full-Text Search Pipeline

Use this guide to run OCR on a document, inspect OCR text, add full-text content, and search the document with full-text search.

This workflow is useful when scanned files or image-based PDFs need to become searchable.

## Before You Begin

Confirm you have:

- A deployed FormKiQ environment. See [Quick Start](/docs/getting-started/quick-start#install-formkiq).
- A JWT access token with permission to read and update documents.
- cURL or an API client such as Postman.
- A document uploaded to FormKiQ. See [Add Documents](/docs/how-tos/api-add-documents).
- OCR and enhanced full-text search modules enabled if your workflow uses Textract or OpenSearch-backed search.

## Variables Used

| Placeholder | Description |
| --- | --- |
| `HTTP_API_URL` | FormKiQ API endpoint from the CloudFormation stack output, including `https://`. |
| `AUTHORIZATION_TOKEN` | JWT access token used in the `Authorization` header. |
| `SITE_ID` | FormKiQ site ID. Use `default` unless your deployment uses multiple sites. |
| `DOCUMENT_ID` | Document ID to process and search. |

The examples below use shell variables. Replace the values before running the commands:

```bash
export HTTP_API_URL="https://your-formkiq-api.example.com"
export AUTHORIZATION_TOKEN="your-jwt-access-token"
export SITE_ID="default"
export DOCUMENT_ID="your-document-id"
```

## Step 1: Run OCR

Use `POST /documents/{documentId}/ocr` to request OCR processing.

```bash
curl -X POST "${HTTP_API_URL}/documents/${DOCUMENT_ID}/ocr?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "ocrEngine": "TEXTRACT",
    "parseTypes": ["TEXT", "FORMS", "TABLES"],
    "ocrNumberOfPages": "-1"
  }'
```

Use `TEXTRACT` when the AWS Textract-backed module is enabled. Use `TESSERACT` only when your deployment is configured for it.

## Step 2: Retrieve OCR Content

Use `GET /documents/{documentId}/ocr` to inspect OCR output.

```bash
curl -X GET "${HTTP_API_URL}/documents/${DOCUMENT_ID}/ocr?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

OCR may run asynchronously. If content is not available immediately, wait and retry.

## Step 3: Add Full-Text Content

Use `POST /documents/{documentId}/fulltext` to add searchable full-text content and optional search attributes.

```bash
curl -X POST "${HTTP_API_URL}/documents/${DOCUMENT_ID}/fulltext?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "contentType": "text/plain",
    "content": "Invoice 1001 from Acme Corporation for cloud services.",
    "path": "invoice-1001.pdf",
    "attributes": {
      "documentType": {
        "stringValues": ["invoice"],
        "valueType": "STRING"
      }
    },
    "tags": [
      {
        "key": "source",
        "value": "ocr"
      }
    ]
  }'
```

## Step 4: Search Full Text

Use `POST /searchFulltext` for common full-text search patterns.

```bash
curl -X POST "${HTTP_API_URL}/searchFulltext?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "text": "invoice cloud services",
      "attributes": [
        {
          "key": "documentType",
          "eq": {
            "stringValue": "invoice"
          }
        }
      ],
      "tags": [
        {
          "key": "source",
          "eq": "ocr"
        }
      ]
    },
    "responseFields": {
      "attributes": ["documentType"],
      "tags": ["source"]
    }
  }'
```

## Step 5: Use a Raw OpenSearch Query

Use `POST /queryFulltext` when you need raw OpenSearch query DSL.

```bash
curl -X POST "${HTTP_API_URL}/queryFulltext?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "match": {
        "content": "invoice"
      }
    }
  }'
```

## Verify the Result

Confirm that:

- OCR content is returned by `GET /documents/{documentId}/ocr`.
- Full-text content is searchable with `POST /searchFulltext`.
- Raw OpenSearch queries return the expected document when using `POST /queryFulltext`.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| OCR result is empty | OCR processing has not completed or the document has no extractable text. | Retry after processing and test with a clear PDF or image. |
| Textract request fails | The Textract-backed module is not installed or configured. | Check OCR module installation and AWS permissions. |
| Full-text search returns no results | OpenSearch indexing has not completed. | Wait, reindex the document, or check OpenSearch module health. |
| Raw query fails | The OpenSearch DSL body is invalid. | Test a minimal `match` query first. |

## Next Steps

- [Search Documents](/docs/how-tos/api-document-search)
- [Optical Character Recognition](/docs/features/ocr)
- [Search](/docs/features/search)
- [Enhanced Full-Text Document Search](/docs/formkiq-modules/modules/enhanced-fulltext-document-search)
