---
sidebar_position: 7
slug: /tutorials/documents/multi-attribute-search
toc_min_heading_level: 2
toc_max_heading_level: 2
---

# Search Documents with Multiple Attributes

## What You Will Build

You will find approved Finance invoices using three document attributes: `department`, `documentType`, and `status`. First, you will search without a composite key. Then, you will create a composite key for **two of the three attributes** and run the same search again.

The composite key narrows the documents that FormKiQ reads. The third attribute remains a filter, so the search still requires all three conditions to match.

## Before You Begin

- A FormKiQ deployment that supports multi-attribute filtering and partial composite-key selection through `POST /search`. Earlier releases can require a composite key covering every search attribute; use a release with the filtering support described here.
- A JWT access token with permission to create attributes, set the site schema, create documents, reindex attributes, and search. See [Get a JWT Authentication Token](/docs/how-tos/jwt-authentication-token).
- cURL and [jq](https://jqlang.github.io/jq/).
- An empty test site, or a test deployment using the default site.

`PUT /sites/{siteId}/schema/document` replaces the site's document schema. The examples set a schema for this tutorial. For an existing site, merge the attribute and composite-key definitions into its current schema instead.

Set these shell variables:

```bash
export BASE_URL="https://your-formkiq-api.example.com"
export TOKEN="your-jwt-access-token"
export SITE_ID="default"
```

Use the same `SITE_ID` throughout the tutorial.

## Workflow Overview

1. Define three string attributes and a site schema.
2. Create four sample documents.
3. Search with three attribute conditions and no composite key.
4. Add a composite key for `department` and `documentType`.
5. Reindex the sample documents and repeat the search.
6. Handle pagination and request a count.

## Step 1: Define the Attributes and Schema

Create the three attribute definitions using [`POST /attributes`](/docs/api-reference/add-attribute):

```bash
for KEY in department documentType status; do
  jq -n --arg key "$KEY" \
    '{attribute: {key: $key, dataType: "STRING", type: "STANDARD"}}' | \
    curl --fail -sS -X POST "${BASE_URL}/attributes?siteId=${SITE_ID}" \
      -H "Authorization: Bearer ${TOKEN}" \
      -H "Content-Type: application/json" \
      --data-binary @-
done
```

Set a schema that requires all three attributes. Start with an empty `compositeKeys` list:

```bash
curl --fail -sS -X PUT "${BASE_URL}/sites/${SITE_ID}/schema/document" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Multi-Attribute Search Tutorial",
    "attributes": {
      "required": [
        {"attributeKey": "department"},
        {"attributeKey": "documentType"},
        {"attributeKey": "status"}
      ],
      "compositeKeys": [],
      "allowAdditionalAttributes": true
    }
  }'
```

Attribute definitions describe the metadata types. The schema requires those fields on documents; a composite key is a separate index configuration.

## Step 2: Create Sample Documents

Create these documents so you can distinguish a complete match from documents matching only some conditions:

| Path | department | documentType | status | Matches all three conditions? |
| --- | --- | --- | --- | --- |
| `search-tutorial/invoice-1001.txt` | Finance | invoice | approved | Yes |
| `search-tutorial/invoice-1002.txt` | Finance | invoice | pending | No: status differs |
| `search-tutorial/receipt-1003.txt` | Finance | receipt | approved | No: document type differs |
| `search-tutorial/invoice-1004.txt` | HR | invoice | approved | No: department differs |

The following loop uses [`POST /documents`](/docs/api-reference/add-document) and saves the returned IDs in `tutorial-document-ids.txt` for reindexing later:

```bash
while IFS='|' read -r DOC_PATH DEPARTMENT DOCUMENT_TYPE STATUS; do
  jq -n \
    --arg path "$DOC_PATH" \
    --arg department "$DEPARTMENT" \
    --arg documentType "$DOCUMENT_TYPE" \
    --arg status "$STATUS" \
    '{
      path: $path,
      contentType: "text/plain",
      content: "Sample document for multi-attribute search.",
      attributes: [
        {key: "department", stringValue: $department},
        {key: "documentType", stringValue: $documentType},
        {key: "status", stringValue: $status}
      ]
    }' | \
    curl --fail -sS -X POST "${BASE_URL}/documents?siteId=${SITE_ID}" \
      -H "Authorization: Bearer ${TOKEN}" \
      -H "Content-Type: application/json" \
      --data-binary @- | jq -er '.documentId'
done > tutorial-document-ids.txt <<'DOCUMENTS'
search-tutorial/invoice-1001.txt|Finance|invoice|approved
search-tutorial/invoice-1002.txt|Finance|invoice|pending
search-tutorial/receipt-1003.txt|Finance|receipt|approved
search-tutorial/invoice-1004.txt|HR|invoice|approved
DOCUMENTS
```

## Step 3: Search with Three Attribute Conditions

Save this request as `multi-attribute-search.json`:

```json
{
  "query": {
    "attributes": [
      {"key": "department", "eq": "Finance"},
      {"key": "documentType", "eq": "invoice"},
      {"key": "status", "eq": "approved"}
    ]
  }
}
```

Submit it to [`POST /search`](/docs/api-reference/document-search):

```bash
curl --fail -sS -X POST "${BASE_URL}/search?siteId=${SITE_ID}&limit=10" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  --data-binary @multi-attribute-search.json | jq .
```

`query.attributes` combines conditions with **AND**. Only `search-tutorial/invoice-1001.txt` should match. If documents have artifacts, every condition must match the same document or artifact; values from a parent and an artifact are not combined to satisfy a search.

Without a usable composite key, FormKiQ uses the first attribute criterion to read candidates and checks the remaining attributes. Here, `department = Finance` identifies three candidates, and the other two conditions leave one result. Put a selective condition first when using this fallback.

DynamoDB attribute indexes are eventually consistent. If a newly created document is missing, allow the index to catch up and repeat the search.

## Step 4: Add a Composite Key for Two Attributes

Configure a composite key containing `department` and `documentType`. **Leave `status` outside the composite key**:

```bash
curl --fail -sS -X PUT "${BASE_URL}/sites/${SITE_ID}/schema/document" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Multi-Attribute Search Tutorial",
    "attributes": {
      "required": [
        {"attributeKey": "department"},
        {"attributeKey": "documentType"},
        {"attributeKey": "status"}
      ],
      "compositeKeys": [
        {"attributeKeys": ["department", "documentType"]}
      ],
      "allowAdditionalAttributes": true
    }
  }'
```

FormKiQ generates a combined attribute such as `department::documentType` with the value `Finance::invoice`. Applications continue to write the original attributes and search their original keys; FormKiQ maintains and selects the composite index.

Composite key order matters. For this key, `department` is the leading field and uses `eq`. The final field, `documentType`, can use an exact value or a supported prefix, list, or range criterion. A composite key is usable only when the search supplies criteria for all its member attributes. If several partial composite keys are usable, FormKiQ prefers the one covering the most attributes.

JSON attributes can belong to a schema's required or optional lists, but they cannot belong to a composite key. Putting a JSON attribute in `compositeKeys` returns HTTP 400. Keep JSON path conditions as additional search filters alongside scalar composite members.

## Step 5: Reindex and Repeat the Same Search

The documents were created before the composite key existed. Regenerate their composite attributes using [`POST /reindex/documents/{documentId}`](/docs/api-reference/add-reindex-document) with the `ATTRIBUTE` target:

```bash
while IFS= read -r DOCUMENT_ID; do
  curl --fail -sS -X POST \
    "${BASE_URL}/reindex/documents/${DOCUMENT_ID}?siteId=${SITE_ID}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"target": "ATTRIBUTE"}'
done < tutorial-document-ids.txt
```

Allow reindexing and index updates to complete, then repeat the command from Step 3 with the **unchanged three-attribute request**.

FormKiQ now uses the two-attribute composite key for candidate selection, then checks the third attribute:

| Stage | Criteria | Sample documents remaining |
| --- | --- | --- |
| Read composite index | `department = Finance` AND `documentType = invoice` | `invoice-1001.txt`, `invoice-1002.txt` |
| Check remaining attribute | `status = approved` | `invoice-1001.txt` |

An illustrative response excerpt is:

```json
{
  "documents": [
    {
      "documentId": "your-invoice-1001-document-id",
      "path": "search-tutorial/invoice-1001.txt",
      "matchedAttribute": {
        "key": "department::documentType",
        "stringValue": "Finance::invoice"
      }
    }
  ]
}
```

`matchedAttribute` identifies the attribute driving candidate selection. It does not list every condition that passed. All three conditions still apply even though this response shows the two-attribute composite.

The result is the same as before. The improvement is that FormKiQ reads Finance invoices as candidates instead of all Finance documents. In a larger repository, that can reduce candidate reads, subsequent attribute checks, and the work required to fill a result page.

Composite indexes also add stored records and write work. Configure combinations used by frequent queries. A two-field composite can be reused when callers vary additional filters such as `status`; a three-field composite can further narrow candidates when all three fields are a stable, frequent access pattern.

## Step 6: Handle Pagination and Counts

The `limit` parameter limits returned matches. FormKiQ may read more candidate records to find those matches.

If the response has a `next` token, send another `POST /search` with the same request body and `siteId`, passing the token as the URL-encoded `next` query parameter. Continue until `next` is absent, including when a filtered page has an empty `documents` array. Do not use an empty page alone as the end-of-results signal.

Searches that need additional attribute filtering use a 10,000-candidate cap and a 25-second processing budget per request. A response with `truncated: true` indicates that processing stopped at a bound. For document results, continue using `next` when present. Composite keys can reduce the candidate set, but they do not remove these bounds when another attribute still needs filtering.

To count matching documents, use the same body with `projection=COUNT`:

```bash
curl --fail -sS -X POST "${BASE_URL}/search?siteId=${SITE_ID}&projection=COUNT" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  --data-binary @multi-attribute-search.json | jq .
```

In the empty test site, `count` should be `1`. Check `truncated`: a truncated count is a partial lower bound rather than a complete total. Count responses do not provide document-page continuation tokens.

## Verify the Result

- The three-condition search returns the approved Finance invoice and excludes the other three documents.
- After reindexing, the same request returns the same document using `department::documentType` as its `matchedAttribute.key`.
- The pending Finance invoice is excluded by the third condition, even though it matches the composite key.
- The count is `1` and is not truncated for this sample data.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Multi-attribute search requires a complete composite key | Confirm the deployment supports multi-attribute filtering and partial composite-key selection. |
| Search stops matching after adding the composite key | Reindex older documents with `target: ATTRIBUTE` and allow index updates to complete. |
| The composite key is not selected | Supply every composite member and use compatible operators in the configured key order. |
| A recently added document is missing | Check its attribute values and site, then retry after the DynamoDB index updates. |
| A page is empty but has `next` | Continue pagination with the same criteria. |
| JSON composite key creation returns HTTP 400 | Remove the JSON attribute from `compositeKeys`; keep it in the schema and use a JSON path filter. |

## Clean Up

Delete the four sample documents when finished. If you used an existing test site, restore its previous schema. Keep attribute definitions only if you want to reuse them.

## Next Steps

- [Document Attributes API](/docs/tutorials/Documents/document-attributes-api)
- [Site / Classification Schemas](/docs/tutorials/Documents/site-classification-schemas)
- [Search](/docs/features/search)
- [Schemas](/docs/features/schemas)
- [POST /search API Reference](/docs/api-reference/document-search)
