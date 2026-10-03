---
sidebar_position: 8
slug: /tutorials/documents/json-attributes
toc_min_heading_level: 2
toc_max_heading_level: 2
---

# Store and Search JSON Attributes

## What You Will Build

You will store invoice details as a JSON attribute, retrieve the object, and search its nested fields with `POST /search`. You will combine customer, approval, and total comparisons, search an array position, and use a scalar composite key to narrow candidates for a JSON filter.

The tutorial also shows how to replace and delete the complete JSON value.

## Why Use JSON Instead of a String?

Use a JSON attribute when related metadata belongs together as an object:

```json
{
  "total": 1250.50,
  "approved": true,
  "customer": {"name": "Acme"},
  "lineItems": [{"sku": "HOSTING", "quantity": 2}],
  "billing.city": "London"
}
```

| JSON attribute | A string containing serialized JSON |
| --- | --- |
| The API accepts and returns an object in `jsonValue`. | The API receives text in `stringValue`; an application parses that text itself. |
| Nested numbers and booleans retain their types. | Numbers, booleans, and structure are part of the text. |
| JSON search filters compare fields such as `$.customer.name` and `$.total`. | Scalar searches compare the string, without interpreting its nested JSON fields. |

FormKiQ stores the object as structured DynamoDB data. A JSON attribute does **not** automatically index every nested property. JSON search filters evaluate fields after candidate attribute records have been read; choose scalar attributes and composite keys for frequent index access patterns.

## Before You Begin

- A FormKiQ deployment supporting the `JSON` attribute data type, JSON path search, and partial composite-key selection.
- A JWT access token with permission to create and modify attributes and documents, search, set the site schema, and reindex attributes. See [Get a JWT Authentication Token](/docs/how-tos/jwt-authentication-token).
- cURL and [jq](https://jqlang.github.io/jq/).
- An empty test site, or a test deployment using the default site.

```bash
export BASE_URL="https://your-formkiq-api.example.com"
export TOKEN="your-jwt-access-token"
export SITE_ID="default"
```

Use this site for every request. If it already has a schema, ensure that the tutorial's attributes are permitted by that schema.

## Step 1: Define a JSON Attribute

Create a reusable attribute definition using [`POST /attributes`](/docs/api-reference/add-attribute):

```bash
curl --fail -sS -X POST "${BASE_URL}/attributes?siteId=${SITE_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "attribute": {
      "key": "invoiceDetails",
      "dataType": "JSON",
      "type": "STANDARD"
    }
  }'
```

`dataType: JSON` defines the value format. `type: STANDARD` specifies ordinary attribute behavior; it does not change the JSON structure.

## Step 2: Attach an Object to a Document

Create a document and save its ID:

```bash
DOCUMENT_ID=$(curl --fail -sS -X POST "${BASE_URL}/documents?siteId=${SITE_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "json-tutorial/invoice-1001.txt",
    "contentType": "text/plain",
    "content": "Invoice 1001"
  }' | jq -er '.documentId')

printf '%s\n' "$DOCUMENT_ID" > json-tutorial-document-ids.txt
```

Add the JSON attribute with [`POST /documents/{documentId}/attributes`](/docs/api-reference/add-document-attributes):

```bash
curl --fail -sS -X POST \
  "${BASE_URL}/documents/${DOCUMENT_ID}/attributes?siteId=${SITE_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "attributes": [
      {
        "key": "invoiceDetails",
        "jsonValue": {
          "total": 1250.50,
          "approved": true,
          "customer": {"name": "Acme"},
          "lineItems": [{"sku": "HOSTING", "quantity": 2}],
          "billing.city": "London"
        }
      }
    ]
  }'
```

Send the object directly in `jsonValue`. Do not serialize it into an escaped string first. A JSON attribute can also be included in the `attributes` array when creating a document, as the examples below demonstrate.

The top-level value must be an object. `{}` is accepted; a top-level array, string, number, boolean, or `null` is rejected. Nested objects, arrays, and empty arrays are allowed. Nested null values are accepted, but null-valued properties may be omitted on a round trip; do not depend on them being returned.

Do not combine `jsonValue` with `stringValue`, `numberValue`, `booleanValue`, date/list value fields, or other attribute value forms on the same attribute. Invalid combinations return HTTP 400.

## Step 3: Retrieve the JSON Value

Get the individual attribute:

```bash
curl --fail -sS \
  "${BASE_URL}/documents/${DOCUMENT_ID}/attributes/invoiceDetails?siteId=${SITE_ID}" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.attribute.jsonValue'
```

The response contains an object, including the numeric `total` and boolean `approved`. Property order and original number formatting are not preserved; `1250.50` may appear as `1250.5`.

You can also retrieve the value from the document's attribute list:

```bash
curl --fail -sS "${BASE_URL}/documents/${DOCUMENT_ID}/attributes?siteId=${SITE_ID}" \
  -H "Authorization: Bearer ${TOKEN}" | \
  jq '.attributes[] | select(.key == "invoiceDetails")'
```

## Step 4: Search Nested Fields

Create three comparison documents. These demonstrate why JSON value types matter:

| Document | Customer | approved | total |
| --- | --- | --- | --- |
| `invoice-1001.txt` (already created) | Acme | `true` | `1250.50` |
| `invoice-1002.txt` | Beta | `true` | `1300` |
| `invoice-1003.txt` | Acme | `false` | `900` |
| `invoice-1004.txt` | Acme | `"true"` (string) | `"1250.50"` (string) |

```bash
while IFS= read -r SAMPLE; do
  printf '%s\n' "$SAMPLE" | jq '{
    path: ("json-tutorial/" + .filename),
    contentType: "text/plain",
    content: "JSON comparison document",
    attributes: [{key: "invoiceDetails", jsonValue: .details}]
  }' | \
    curl --fail -sS -X POST "${BASE_URL}/documents?siteId=${SITE_ID}" \
      -H "Authorization: Bearer ${TOKEN}" \
      -H "Content-Type: application/json" \
      --data-binary @- | jq -er '.documentId'
done >> json-tutorial-document-ids.txt <<'DOCUMENTS'
{"filename":"invoice-1002.txt","details":{"customer":{"name":"Beta"},"approved":true,"total":1300}}
{"filename":"invoice-1003.txt","details":{"customer":{"name":"Acme"},"approved":false,"total":900}}
{"filename":"invoice-1004.txt","details":{"customer":{"name":"Acme"},"approved":"true","total":"1250.50"}}
DOCUMENTS
```

Save the following body as `json-search.json`:

```json
{
  "query": {
    "attribute": {
      "key": "invoiceDetails",
      "json": {"path": "$.customer.name", "eq": "Acme"}
    }
  }
}
```

Run the search:

```bash
curl --fail -sS -X POST "${BASE_URL}/search?siteId=${SITE_ID}&limit=10" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  --data-binary @json-search.json | jq .
```

Invoices 1001, 1003, and 1004 match this customer-name search. DynamoDB indexes are eventually consistent; allow index updates to complete if newly written documents are missing.

For this JSON-driven search, `matchedAttribute.key` is `invoiceDetails`, `matchedAttribute.jsonPath` is `$.customer.name`, and `matchedAttribute.jsonValue` contains the **whole object**, not just the customer's name.

### Combine Comparisons on the Same JSON Attribute

Replace `json-search.json` with this body and repeat the search command:

```json
{
  "query": {
    "attributes": [
      {
        "key": "invoiceDetails",
        "json": {"path": "$.customer.name", "eq": "Acme"}
      },
      {
        "key": "invoiceDetails",
        "json": {"path": "$.approved", "eq": true}
      },
      {
        "key": "invoiceDetails",
        "json": {"path": "$.total", "gte": 1000, "lte": 1500}
      }
    ]
  }
}
```

Only invoice 1001 matches. The array combines criteria with **AND**, while `gte` and `lte` form an inclusive numeric interval within one criterion. Invoice 1004 does not match: the string `"true"` is not boolean `true`, and the string `"1250.50"` is not a number.

Use separate criteria for different paths under the same key. Repeating the same key and path is rejected; combine bounds for one path in one `json` filter.

### Search Arrays and Quoted Property Names

This body also matches only invoice 1001:

```json
{
  "query": {
    "attributes": [
      {
        "key": "invoiceDetails",
        "json": {"path": "$.lineItems[0].quantity", "eq": 2}
      },
      {
        "key": "invoiceDetails",
        "json": {"path": "$[\"billing.city\"]", "eq": "London"}
      }
    ]
  }
}
```

Array positions are zero-based: `[0]` searches the first line item only. `$["billing.city"]` selects the literal property named `billing.city`; `$.billing.city` would select `city` inside a `billing` object.

### Available Operators and Paths

| Operator | Example inside `json` | Field type |
| --- | --- | --- |
| `eq` | `"path": "$.approved", "eq": true` | String, number, or boolean |
| `eqOr` | `"path": "$.customer.name", "eqOr": ["Acme", "Beta"]` | Any listed string, number, or boolean |
| `beginsWith` | `"path": "$.customer.name", "beginsWith": "Ac"` | String |
| `gt`, `gte`, `lt`, `lte` | `"path": "$.total", "gt": 1000, "lte": 1500` | Number |

Supply `path` and at least one comparison. All comparisons in a filter are combined with AND; `eqOr` matches any listed value. Numbers are compared numerically, so `1250.50` and `1250.5` are equal. Missing fields, incompatible types, and out-of-range array positions do not match.

Paths start with `$` and contain at least one property or array position. Dot properties, quoted bracket properties, and explicit array positions are supported. Wildcards such as `$.lineItems[*].quantity`, recursive descent, slices, and filter expressions are unsupported.

Comparison values cannot be objects, arrays, or null. Use `gt`/`gte`/`lt`/`lte` for numeric bounds; the legacy `range` operator is not supported inside `json`. Do not combine `json` with top-level `eq`, `eqOr`, `beginsWith`, or `range` in the same criterion. Existing scalar attribute searches continue to use their original string-valued `eq` and `eqOr` fields.

## Step 5: Narrow Candidates with a Scalar Composite Key

JSON path filters are applied after reading candidate records. For frequent searches such as approved Finance invoices, store `department` and `documentType` as scalar attributes and use their composite key to narrow candidates before checking the JSON approval flag.

Create the scalar definitions and add their values to all four sample documents:

```bash
for KEY in department documentType; do
  jq -n --arg key "$KEY" \
    '{attribute: {key: $key, dataType: "STRING", type: "STANDARD"}}' | \
    curl --fail -sS -X POST "${BASE_URL}/attributes?siteId=${SITE_ID}" \
      -H "Authorization: Bearer ${TOKEN}" \
      -H "Content-Type: application/json" \
      --data-binary @-
done

while IFS= read -r ID; do
  curl --fail -sS -X POST "${BASE_URL}/documents/${ID}/attributes?siteId=${SITE_ID}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"attributes": [
      {"key": "department", "stringValue": "Finance"},
      {"key": "documentType", "stringValue": "invoice"}
    ]}'
done < json-tutorial-document-ids.txt
```

Set this test site's schema. This PUT replaces its document schema; merge these definitions into the existing schema when using an established site.

```bash
curl --fail -sS -X PUT "${BASE_URL}/sites/${SITE_ID}/schema/document" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JSON Attribute Tutorial",
    "attributes": {
      "optional": [
        {"attributeKey": "invoiceDetails"},
        {"attributeKey": "department"},
        {"attributeKey": "documentType"}
      ],
      "compositeKeys": [
        {"attributeKeys": ["department", "documentType"]}
      ],
      "allowAdditionalAttributes": true
    }
  }'
```

JSON attributes can appear in the schema's required or optional lists. They **cannot be composite-key members**: including `invoiceDetails` in `compositeKeys` returns HTTP 400, even when additional attributes are allowed.

Reindex the existing documents to generate their composite attributes:

```bash
while IFS= read -r ID; do
  curl --fail -sS -X POST "${BASE_URL}/reindex/documents/${ID}?siteId=${SITE_ID}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"target": "ATTRIBUTE"}'
done < json-tutorial-document-ids.txt
```

After reindexing and index updates complete, save this body in `json-search.json` and run the search command again:

```json
{
  "query": {
    "attributes": [
      {"key": "department", "eq": "Finance"},
      {"key": "documentType", "eq": "invoice"},
      {"key": "invoiceDetails", "json": {"path": "$.approved", "eq": true}}
    ]
  }
}
```

Invoices 1001 and 1002 match. The scalar `department::documentType` composite drives candidate selection; the boolean JSON filter excludes invoices 1003 and 1004. `matchedAttribute` describes the composite in this case, so it does not include `jsonPath` or the invoice object.

To include JSON metadata in results, add this top-level field alongside `query` in the request:

```json
{
  "responseFields": {"attributes": ["invoiceDetails"]}
}
```

This is a request fragment, not a complete search body. Results then include the JSON value under `attributes.invoiceDetails.jsonValue`.

For the full composite-key walkthrough, see [Search Documents with Multiple Attributes](/docs/tutorials/documents/multi-attribute-search).

## Step 6: Handle Pagination and Counts

JSON filtering does not reduce the read capacity consumed for candidate records. The `limit` parameter controls returned matches, and more candidates may be read to find them.

Continue while the response includes `next`, passing that URL-encoded token to another `POST /search` with the same body and site. An empty `documents` array can still have a continuation token. Candidate and time limits can produce `truncated: true`; continue with `next` when present.

Count the current Finance-invoice approval query using:

```bash
curl --fail -sS -X POST "${BASE_URL}/search?siteId=${SITE_ID}&projection=COUNT" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  --data-binary @json-search.json | jq .
```

The sample count should be `2`. A truncated count is a partial lower bound rather than a complete total. All conditions must match the same document or artifact; fields from a parent and an artifact are not combined.

## Step 7: Replace the Entire JSON Object

Use the single-key PUT endpoint to update the original invoice:

```bash
curl --fail -sS -X PUT \
  "${BASE_URL}/documents/${DOCUMENT_ID}/attributes/invoiceDetails?siteId=${SITE_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonValue": {
      "customer": {"name": "Acme"},
      "approved": false,
      "total": 950,
      "lineItems": []
    }
  }'
```

The PUT replaces the complete object; it does not merge nested properties. Get `invoiceDetails` again to confirm that `billing.city` and the old line item are gone. The unrelated scalar attributes remain on the document. The collection PUT endpoint also replaces the object when setting this attribute.

After index updates complete, the boolean approval query excludes invoice 1001 and the count becomes `1`. Use PUT for replacement; POST adds a new document attribute and rejects a key already present on the document.

## Step 8: Delete the JSON Attribute by Key

```bash
curl --fail -sS -X DELETE \
  "${BASE_URL}/documents/${DOCUMENT_ID}/attributes/invoiceDetails?siteId=${SITE_ID}" \
  -H "Authorization: Bearer ${TOKEN}"
```

This deletes the entire JSON attribute, subject to permissions and schema requirements. A required attribute cannot simply be removed; this tutorial lists `invoiceDetails` as optional.

The value-specific DELETE endpoint, `/documents/{documentId}/attributes/{attributeKey}/{attributeValue}`, rejects JSON attributes with HTTP 400. To remove one nested field, PUT the complete revised object without that field.

## Verify the Result

- GET returns `invoiceDetails.jsonValue` as an object.
- The customer-name search matches invoices 1001, 1003, and 1004.
- The three JSON comparisons match only invoice 1001.
- Array-position and quoted-property searches match the original invoice's corresponding fields.
- The scalar composite plus boolean JSON filter matches invoices 1001 and 1002 before replacement.
- Replacement removes omitted fields and changes the approval search result.
- Key-based DELETE removes the entire JSON attribute.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| HTTP 400 when writing `jsonValue` | Define the key with `dataType: JSON`, send a top-level object, and omit other value forms. |
| HTTP 400 when searching | Supply a supported path and comparison; do not mix JSON and scalar operators in one criterion. |
| A field does not match | Check its type and path. Numeric strings, boolean strings, missing fields, and absent array positions do not match typed comparisons. |
| A large object is rejected | The full DynamoDB item must fit within 400 KB; nesting includes the attribute wrapper, and numbers must fit DynamoDB's range and precision limits. |
| Recently changed results are missing | Allow index updates to complete and continue through all pages. |
| HTTP 400 when defining a composite key | Keep JSON attributes in the schema but outside `compositeKeys`. |

## Clean Up

Delete the four sample documents when finished. If you changed an existing test site's schema, restore its previous schema. Keep attribute definitions only if you want to reuse them.

## Next Steps

- [Document Attributes API](/docs/tutorials/Documents/document-attributes-api)
- [Search Documents with Multiple Attributes](/docs/tutorials/documents/multi-attribute-search)
- [Attributes](/docs/features/attributes)
- [Search](/docs/features/search)
- [POST /search API Reference](/docs/api-reference/document-search)
