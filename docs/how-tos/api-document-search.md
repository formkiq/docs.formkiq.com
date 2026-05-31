---
sidebar_position: 4
---

# Search Documents

Use this guide to search FormKiQ documents by tag, tag value, composite keys, and full-text content when the full-text module is enabled.

## Before You Begin

Confirm you have:

- A deployed FormKiQ environment. See [Quick Start](/docs/getting-started/quick-start#install-formkiq).
- cURL or an API client such as Postman.
- A JWT access token. See [Get a JWT Authentication Token](/docs/how-tos/jwt-authentication-token).
- Documents with tags or searchable content.
- Optional: [jq](https://jqlang.github.io/jq/) for formatting JSON responses.

## Variables Used

| Placeholder | Description |
| --- | --- |
| `HTTP_API_URL` | FormKiQ API endpoint from the CloudFormation stack output, including `https://`. |
| `AUTHORIZATION_TOKEN` | JWT access token used in the `Authorization` header. |
| `SITE_ID` | Optional FormKiQ site ID. Use `default` unless your deployment uses multiple sites. |
| `TAG_KEY` | Tag key to search, such as `category`. |
| `TAG_VALUE` | Tag value to match, such as `person`. |

The examples below use shell variables. Replace the values before running the commands:

```bash
export HTTP_API_URL="https://your-formkiq-api.example.com"
export AUTHORIZATION_TOKEN="your-jwt-access-token"
export SITE_ID="default"
export TAG_KEY="category"
export TAG_VALUE="person"
```

## Step 1: Find the FormKiQ API Endpoint

Open the [AWS CloudFormation console](https://console.aws.amazon.com/cloudformation), select your FormKiQ stack, and open the **Outputs** tab.

![CloudFormation Outputs](./img/cf-outputs-apis.png)

Use the `HttpApiUrl` output as `HTTP_API_URL`.

## Step 2: Search by Tag Key

Use `POST /search` to find documents with a specific tag key.

```bash
curl -X POST "${HTTP_API_URL}/search?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"query": {"tag": {"key": "category"}}}'
```

A successful response returns matching documents.

```json
{
  "documents": [
    {
      "documentId": "05c1dc43-e9f3-4bb5-9732-077c02dac2c9",
      "matchedTag": {
        "type": "USERDEFINED",
        "value": "person",
        "key": "category"
      },
      "contentType": "application/pdf"
    }
  ]
}
```

## Step 3: Search by Tag Key and Exact Value

Use `eq` to match a specific tag value.

```bash
curl -X POST "${HTTP_API_URL}/search?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"query": {"tag": {"key": "category", "eq": "person"}}}'
```

## Step 4: Search by Tag Value Prefix

Use `beginsWith` when the tag value should start with specific characters.

```bash
curl -X POST "${HTTP_API_URL}/search?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"query": {"tag": {"key": "category", "beginsWith": "p"}}}'
```

## Step 5: Search by Composite Key

If composite keys are configured at the site or classification level, use multiple tag conditions in one search request. DynamoDB-backed multiple-field searches require the relevant composite key to exist, and preceding fields usually need exact-match criteria such as `eq`.

```bash
curl -X POST "${HTTP_API_URL}/search?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"query": {"tags": [{"key": "category", "eq": "person"}, {"key": "playerId", "eq": "111"}]}}'
```

## Step 6: Search Full Text

Full-text search requires the enhanced full-text search module. See [Search](/docs/features/search) for feature details.

```bash
curl -X POST "${HTTP_API_URL}/searchFulltext?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"query": {"text": "sample content"}}'
```

A successful response returns matching documents.

```json
{
  "documents": [
    {
      "documentId": "83afd66e-9f16-4a62-a286-1e8c54c449d8",
      "path": "sample.pdf"
    }
  ]
}
```

## Step 7: Run an OpenSearch Query

When OpenSearch is enabled, `POST /queryFulltext` can run a custom OpenSearch query.

```bash
curl -X POST "${HTTP_API_URL}/queryFulltext?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"query": {"match_all": {}}}'
```

## Verify the Result

Confirm the response includes the expected `documentId`, path, matched tag, or full-text result. If the document was recently added, allow time for asynchronous indexing before retrying a full-text search.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| No documents returned | The tag key, value, or query does not match indexed documents. | Confirm the document tags and query body. |
| Full-text search returns no results | Full-text module is not enabled or indexing is not complete. | Check module installation and document processing status. |
| `400 Bad Request` | Search body is malformed. | Validate JSON and confirm the search operator is supported. |
| `401 Unauthorized` | Token is missing or expired. | Get a new JWT access token. |
| OpenSearch query fails | OpenSearch is not installed or the query DSL is invalid. | Confirm OpenSearch module status and query syntax. |
| Documents are missing in a multi-site deployment | The request searched the wrong site. | Confirm `SITE_ID` or omit it only when using the default site. |

## Next Steps

- [Search](/docs/features/search)
- [Add Document Tags](/docs/how-tos/api-add-document-tags)
- [Optical Character Recognition](/docs/features/ocr)
