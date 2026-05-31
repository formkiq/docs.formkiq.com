---
sidebar_position: 2
---

# Add Documents

Use this guide to add documents to FormKiQ with the API. It covers inline text content, base64-encoded content, large file uploads, and retrieving a download URL.

## Before You Begin

Confirm you have:

- A deployed FormKiQ environment. See [Quick Start](/docs/getting-started/quick-start#install-formkiq).
- cURL or an API client such as Postman.
- A JWT access token. See [Get a JWT Authentication Token](/docs/how-tos/jwt-authentication-token).
- Optional: [jq](https://jqlang.github.io/jq/) for formatting JSON responses.

All shell commands are shown for Unix-based systems. Windows has analogous commands for each.

## Variables Used

| Placeholder | Description |
| --- | --- |
| `HTTP_API_URL` | FormKiQ API endpoint from the CloudFormation stack output, including `https://`. |
| `AUTHORIZATION_TOKEN` | JWT access token used in the `Authorization` header. |
| `SITE_ID` | Optional FormKiQ site ID. Use `default` unless your deployment uses multiple sites. |
| `DOCUMENT_ID` | Document ID returned by FormKiQ. |
| `FILE_NAME` | Local file name to upload. |
| `FILE_CONTENT_TYPE` | MIME type for the uploaded file, such as `application/pdf`. |
| `BASE64_CONTENT` | Base64-encoded document content. |
| `PRESIGNED_UPLOAD_URL` | Temporary Amazon S3 upload URL returned by FormKiQ. |
| `DOCUMENT_DOWNLOAD_URL` | Temporary document download URL returned by FormKiQ. |

The examples below use shell variables. Replace the values before running the commands:

```bash
export HTTP_API_URL="https://your-formkiq-api.example.com"
export AUTHORIZATION_TOKEN="your-jwt-access-token"
export SITE_ID="default"
```

## Step 1: Find the FormKiQ API Endpoint

Open the [AWS CloudFormation console](https://console.aws.amazon.com/cloudformation), select your FormKiQ stack, and open the **Outputs** tab.

![CloudFormation Outputs](./img/cf-outputs-apis.png)

Use the `HttpApiUrl` output as `HTTP_API_URL`.

## Step 2: Add a Text Document

Use `POST /documents` for small documents and inline content.

```bash
curl -X POST "${HTTP_API_URL}/documents?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"path": "test.txt", "contentType": "text/plain", "content": "This is sample content"}'
```

A successful response returns a `documentId`. The response may also include the `siteId`.

```json
{
  "documentId": "b18e0d3b-48cb-4589-ab5d-f19e27b44f05",
  "siteId": "default"
}
```

## Step 3: Add a Base64-Encoded Document

Use base64 encoding when you need to send binary content directly in the API request body.

```bash
curl -X POST "${HTTP_API_URL}/documents?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"path": "sample.pdf", "contentType": "application/pdf", "isBase64": true, "content": "BASE64_CONTENT"}'
```

A successful response returns a `documentId`.

```json
{
  "documentId": "7e0aca55-f6b2-4b93-95df-c188691dcb99"
}
```

## Step 4: Upload a Large Document

For larger documents, request an upload URL from FormKiQ and then upload the file bytes directly to Amazon S3.

```bash
curl -X POST "${HTTP_API_URL}/documents/upload?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"path": "sample.pdf", "contentType": "application/pdf"}'
```

The response includes a presigned upload URL, a `documentId`, and may include headers that must be sent to Amazon S3.

```json
{
  "url": "https://formkiq-core-dev-documents-XXXXXX.s3.us-east-2.amazonaws.com/05c1dc43-e9f3-4bb5...",
  "documentId": "05c1dc43-e9f3-4bb5-9732-077c02dac2c9",
  "headers": {}
}
```

Upload the local file to the returned URL. If the response includes headers, send those headers exactly as returned.

```bash
curl -v -H "Content-Type: FILE_CONTENT_TYPE" \
  --upload-file FILE_NAME \
  "PRESIGNED_UPLOAD_URL"
```

If the response includes S3 headers, add each returned header to the upload request:

```bash
curl -v \
  -H "Content-Type: FILE_CONTENT_TYPE" \
  -H "RETURNED_HEADER_NAME: RETURNED_HEADER_VALUE" \
  --upload-file FILE_NAME \
  "PRESIGNED_UPLOAD_URL"
```

## Step 5: Get a Document Download URL

Use the `documentId` to request a temporary download URL.

```bash
curl -X GET "${HTTP_API_URL}/documents/DOCUMENT_ID/url?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

A successful response returns a URL for the document content.

```json
{
  "url": "https://formkiq-core-dev-documents-XXXXXX.s3.us-east-2.amazonaws.com/05c1dc43-e9f3-4bb5...",
  "documentId": "05c1dc43-e9f3-4bb5-9732-077c02dac2c9"
}
```

Download the document content.

```bash
curl "DOCUMENT_DOWNLOAD_URL" --output sample.pdf
```

## Verify the Result

Confirm the document was created by requesting its metadata.

```bash
curl -X GET "${HTTP_API_URL}/documents/DOCUMENT_ID?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

The response should include the document ID, path, content type, and related metadata.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| `401 Unauthorized` | Token is missing or expired. | Get a new JWT access token. |
| `403 Forbidden` | The user does not have permission to add or read documents. | Check FormKiQ user permissions. |
| `400 Bad Request` | Request body is malformed or required fields are missing. | Check `path`, `contentType`, and JSON formatting. |
| Upload to S3 fails | Content type, presigned URL usage, or returned headers are incorrect. | Use the returned URL exactly, include returned headers, and keep the expected content type. |
| Download URL expires | Presigned URLs are temporary. | Request a new document download URL. |
| Document is not found in a multi-site deployment | The request used the wrong site. | Confirm `SITE_ID` or omit it only when using the default site. |

## Next Steps

- [Add Document Tags](/docs/how-tos/api-add-document-tags)
- [Document Search](/docs/how-tos/api-document-search)
- [FormKiQ API Reference](/docs/api-reference/formkiq-api-jwt)
