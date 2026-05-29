---
sidebar_position: 5
---

# Add Document Actions

Use this guide to attach actions to documents so FormKiQ can run processing steps such as webhooks, OCR, and full-text indexing.

## Before You Begin

Confirm you have:

- A deployed FormKiQ environment. See [Quick Start](/docs/getting-started/quick-start#install-formkiq).
- cURL or an API client such as Postman.
- A JWT access token. See [Get a JWT Authentication Token](/docs/how-tos/jwt-authentication-token).
- A webhook endpoint if you want to test webhook actions.
- OCR or full-text modules installed if you want to test enhanced OCR or OpenSearch-backed full-text indexing.
- Optional: [jq](https://jqlang.github.io/jq/) for formatting JSON responses.

## Variables Used

| Placeholder | Description |
| --- | --- |
| `HTTP_API_URL` | FormKiQ API endpoint from the CloudFormation stack output, including `https://`. |
| `AUTHORIZATION_TOKEN` | JWT access token used in the `Authorization` header. |
| `SITE_ID` | Optional FormKiQ site ID. Use `default` unless your deployment uses multiple sites. |
| `DOCUMENT_ID` | Document ID returned by FormKiQ. |
| `WEBHOOK_URL` | Endpoint that receives webhook action requests. |
| `BASE64_CONTENT` | Base64-encoded document content. |

The examples below use shell variables. Replace the values before running the commands:

```bash
export HTTP_API_URL="https://your-formkiq-api.example.com"
export AUTHORIZATION_TOKEN="your-jwt-access-token"
export SITE_ID="default"
export DOCUMENT_ID="your-document-id"
export WEBHOOK_URL="https://example.com/webhook"
```

## Step 1: Find the FormKiQ API Endpoint

Open the [AWS CloudFormation console](https://console.aws.amazon.com/cloudformation), select your FormKiQ stack, and open the **Outputs** tab.

![CloudFormation Outputs](./img/cf-outputs-apis.png)

Use the `HttpApiUrl` output as `HTTP_API_URL`.

## Step 2: Add a Webhook Action to an Existing Document

Use `POST /documents/{documentId}/actions` to add one or more actions to an existing document.

```bash
curl -X POST "${HTTP_API_URL}/documents/${DOCUMENT_ID}/actions?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "actions": [
      {
        "type": "WEBHOOK",
        "parameters": {
          "url": "'"${WEBHOOK_URL}"'"
        }
      }
    ]
  }'
```

This appends the action to the document. It does not replace existing actions.

## Step 3: Add OCR and Full-Text Actions to an Existing Document

Use OCR and full-text actions when document content should be extracted and indexed for search.

```bash
curl -X POST "${HTTP_API_URL}/documents/${DOCUMENT_ID}/actions?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "actions": [
      {
        "type": "OCR"
      },
      {
        "type": "FULLTEXT"
      }
    ]
  }'
```

:::note
FormKiQ Core includes OCR with Tesseract. Commercial offerings can include Amazon Textract and enhanced OCR or full-text modules, depending on the deployed configuration.
:::

## Step 4: Add a Document with a Webhook Action

The webhook action sends a `POST` request to the configured endpoint after the document is created.

```bash
curl -X POST "${HTTP_API_URL}/documents?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "test.txt",
    "contentType": "text/plain",
    "content": "This is sample content",
    "actions": [
      {
        "type": "WEBHOOK",
        "parameters": {
          "url": "'"${WEBHOOK_URL}"'"
        }
      }
    ]
  }'
```

A successful response returns the created `documentId`. The response may also include the `siteId`.

```json
{
  "documentId": "983a9d66-3833-4e09-b3b0-a1808b87502c",
  "siteId": "default"
}
```

## Step 5: Add a Document with OCR and Full-Text Actions

Use OCR and full-text actions when document content should be extracted and indexed for search.

```bash
curl -X POST "${HTTP_API_URL}/documents?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "sample.pdf",
    "contentType": "application/pdf",
    "isBase64": true,
    "content": "BASE64_CONTENT",
    "actions": [
      {
        "type": "OCR"
      },
      {
        "type": "FULLTEXT"
      }
    ]
  }'
```

A successful response returns the created `documentId`.

```json
{
  "documentId": "983a9d66-3833-4e09-b3b0-a1808b87502c"
}
```

## Step 6: Check Document Action Status

Use `GET /documents/{documentId}/actions` to inspect action status.

```bash
curl -X GET "${HTTP_API_URL}/documents/${DOCUMENT_ID}/actions?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

A successful response returns the configured actions and their status. Actions run asynchronously, so an action may be `PENDING`, `IN_QUEUE`, or `RUNNING` before it becomes `COMPLETE` or `FAILED`.

```json
{
  "actions": [
    {
      "type": "WEBHOOK",
      "parameters": {
        "url": "https://example.com/webhook"
      },
      "status": "COMPLETE"
    }
  ]
}
```

## Verify the Result

Confirm the action status becomes `COMPLETE`. For webhook actions, also confirm the receiving endpoint received a request. For OCR or full-text actions, confirm extracted text or search results are available after processing completes.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| Action remains pending | Background processing is delayed or failing. | Check queues, Lambda logs, and the [Dead-Letter Queue](/docs/platform/error_handling/dlq). |
| Webhook does not receive a request | Endpoint is unavailable or rejects the request. | Check the webhook URL, network access, and endpoint logs. |
| OCR or full-text action fails | Required module or permissions are missing. | Confirm OCR/full-text modules and AWS permissions. |
| `400 Bad Request` | Action body is malformed. | Check JSON formatting and action type names. |
| `401 Unauthorized` | Token is missing or expired. | Get a new JWT access token. |
| Action is missing in a multi-site deployment | The request used the wrong site. | Confirm `SITE_ID` or omit it only when using the default site. |

## Next Steps

- [Rulesets](/docs/features/rulesets)
- [Workflows](/docs/features/workflows)
- [Search Documents](/docs/how-tos/api-document-search)
