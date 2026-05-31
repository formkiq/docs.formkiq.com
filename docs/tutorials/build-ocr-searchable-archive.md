---
sidebar_position: 14
---

# Build an OCR Searchable Archive

## What You Will Build

In this tutorial, you will build a searchable archive for scanned or image-based documents. You will upload a document, run OCR, store searchable full-text content, add structured attributes, and query the archive.

This workflow combines:

- Document upload
- OCR processing
- Full-text indexing
- Attributes
- Full-text search
- Raw OpenSearch querying

## Before You Begin

Confirm you have:

- A deployed FormKiQ environment.
- OCR and enhanced full-text search capabilities enabled for your environment.
- A JWT access token with permission to create, update, and search documents. See [Get a JWT Authentication Token](/docs/how-tos/jwt-authentication-token).
- cURL or an API client such as Postman.
- Optional: [jq](https://jqlang.github.io/jq/) for formatting JSON responses.

## Variables Used

| Placeholder | Description |
| --- | --- |
| `HTTP_API_URL` | FormKiQ API endpoint from the CloudFormation stack output, including `https://`. |
| `AUTHORIZATION_TOKEN` | JWT access token used in the `Authorization` header. |
| `SITE_ID` | FormKiQ site ID. Use `default` unless your deployment uses multiple sites. |
| `DOCUMENT_ID` | Document ID returned when the archive document is uploaded. |

The examples below use shell variables. Replace the values before running the commands:

```bash
export HTTP_API_URL="https://your-formkiq-api.example.com"
export AUTHORIZATION_TOKEN="your-jwt-access-token"
export SITE_ID="default"
```

## Workflow Overview

1. Upload a document with archive metadata.
2. Run OCR on the document.
3. Retrieve OCR content.
4. Add full-text content and attributes.
5. Search the archive with `searchFulltext`.
6. Use `queryFulltext` for an advanced OpenSearch query.

## Step 1: Upload an Archive Document

Use `POST /documents` to create a sample archive document.

```bash
curl -X POST "${HTTP_API_URL}/documents?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "archive/invoice-1001.pdf",
    "contentType": "application/pdf",
    "content": "Invoice 1001 from Acme Corporation for cloud infrastructure services.",
    "tags": [
      {
        "key": "archive",
        "value": "true"
      }
    ],
    "attributes": [
      {
        "key": "documentType",
        "stringValues": ["invoice"],
        "valueType": "STRING"
      },
      {
        "key": "department",
        "stringValues": ["finance"],
        "valueType": "STRING"
      }
    ]
  }'
```

Set `DOCUMENT_ID` to the returned document ID.

```bash
export DOCUMENT_ID="returned-document-id"
```

## Step 2: Run OCR

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

OCR processing may run asynchronously depending on the file and module configuration.

## Step 3: Retrieve OCR Content

Use `GET /documents/{documentId}/ocr` to inspect extracted content.

```bash
curl -X GET "${HTTP_API_URL}/documents/${DOCUMENT_ID}/ocr?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

If the response does not include text yet, wait and retry.

## Step 4: Add Full-Text Content and Attributes

Use `POST /documents/{documentId}/fulltext` to store content and structured fields for search.

```bash
curl -X POST "${HTTP_API_URL}/documents/${DOCUMENT_ID}/fulltext?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "contentType": "text/plain",
    "content": "Invoice 1001 from Acme Corporation for cloud infrastructure services.",
    "path": "archive/invoice-1001.pdf",
    "tags": [
      {
        "key": "archive",
        "value": "true"
      }
    ],
    "attributes": {
      "documentType": {
        "stringValues": ["invoice"],
        "valueType": "STRING"
      },
      "department": {
        "stringValues": ["finance"],
        "valueType": "STRING"
      }
    }
  }'
```

## Step 5: Search the Archive

Use `POST /searchFulltext` for common search patterns across content, tags, and attributes.

```bash
curl -X POST "${HTTP_API_URL}/searchFulltext?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "text": "cloud infrastructure",
      "tags": [
        {
          "key": "archive",
          "eq": "true"
        }
      ],
      "attributes": [
        {
          "key": "documentType",
          "eq": {
            "stringValue": "invoice"
          }
        }
      ]
    },
    "responseFields": {
      "attributes": ["documentType", "department"],
      "tags": ["archive"]
    }
  }'
```

## Step 6: Run an Advanced Query

Use `POST /queryFulltext` when your application needs raw OpenSearch DSL.

```bash
curl -X POST "${HTTP_API_URL}/queryFulltext?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "bool": {
        "must": [
          {
            "match": {
              "content": "cloud infrastructure"
            }
          }
        ]
      }
    }
  }'
```

Use `searchFulltext` first for common application search. Use `queryFulltext` when you need lower-level OpenSearch control.

## Verify the Result

Confirm that:

- The document exists in FormKiQ.
- OCR content is available from `GET /documents/{documentId}/ocr`.
- `searchFulltext` returns the document by content and filters.
- `queryFulltext` returns the document for the raw OpenSearch query.

## Clean Up

Delete the test document if it is no longer needed.

```bash
curl -X DELETE "${HTTP_API_URL}/documents/${DOCUMENT_ID}?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| OCR output is empty | OCR has not completed or the source file has no extractable text. | Wait and retry, then test with a clearer PDF or image. |
| Textract OCR fails | Textract support is not enabled or lacks AWS permissions. | Check OCR module configuration. |
| Search returns no results | Full-text indexing has not completed. | Wait, retry, or reindex the document. |
| Raw OpenSearch query fails | The request body is invalid for OpenSearch. | Start with a simple `match` query. |

## Next Steps

- [OCR and Full-Text Search Pipeline](/docs/how-tos/ocr-full-text-search-pipeline)
- [Optical Character Recognition](/docs/features/ocr)
- [Search](/docs/features/search)
- [Enhanced Full-Text Document Search](/docs/formkiq-modules/modules/enhanced-fulltext-document-search)
