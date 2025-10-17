---
sidebar_position: 5
toc_min_heading_level: 2
toc_max_heading_level: 2
---
# Document Attributes API

## Overview

Document Attributes in FormKiQ allow you to associate structured metadata with individual documents.  

Attributes are stored as key-value pairs and can describe properties such as department, project code, document classification, or workflow status.  

They can be used for searching, categorizing, or driving automation and retention policies across your document repository.

## Prerequisites

- A valid FormKiQ account or API environment
- [Access credentials and FormKiQ API Endpoint URL](/docs/getting-started/api-walkthrough#acquire-access-token)
- Familiarity with REST APIs and JSON payloads

## Create Attribute

Creates a new **attribute definition** in FormKiQ.  
Attribute definitions are reusable keys that define consistent metadata fields across multiple documents (for example: "Department", "ProjectCode", or "RetentionPeriod").  
Each attribute definition specifies its key, data type, and visibility.

### Common use cases
- Define standard metadata fields for your organization (e.g., department, documentType).  
- Control attribute data type and constraints (e.g., STRING, NUMBER, BOOLEAN).  
- Predefine keys that can be attached to many documents for consistency.

#### Example request
```bash
curl -X POST "$BASE_URL/attributes?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "attribute": {
      "key": "department",
      "dataType": "STRING",
      "type": "STANDARD"
    }
  }'
```

#### Example response
```json
{
  "message": "Attribute"
}
```

## Add / Update Document Attributes

Attach new attribute values or update existing attributes on a specific document.
Attributes can be added in bulk using the collection endpoint, or individually using the single-key endpoint.

If the attribute key does not exist on the document, it is created; if it does, the value is updated.

### Common use cases
- Add classification attributes to a document (e.g., department, sensitivity).
- Update attribute values as a document progresses through workflows.
- Apply bulk attributes to multiple documents programmatically.


### Example — add multiple attributes

```bash
curl -X POST "$BASE_URL/documents/$DOC_ID/attributes?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "attributes": [
      {"key": "department", "stringValue": "Finance"},
      {"key": "projectCode", "numberValue": 193},
      {"key": "confidential", "booleanValue": true}
    ]
  }'
```

### Example — update a single attribute

```bash
curl -X PUT "$BASE_URL/documents/$DOC_ID/attributes/department?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stringValue": "Accounting"
  }'
```


### Example response
```json
{
  "message": "Document Attributes updated"
}
```

## Get Document Attributes

Retrieve all attributes for a document, or get a specific attribute by key.

This allows client applications to display or validate the metadata currently associated with a document.

### Common use cases
- Display document metadata in a user interface.
- Confirm that attributes were applied successfully after upload.
- Retrieve metadata for indexing or downstream automation.

### Example — list all attributes

```bash
curl -X GET "$BASE_URL/documents/$DOC_ID/attributes?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### Example response

```json
{
  "attributes": [
    {"key": "department", "stringValue": "Finance"},
    {"key": "projectCode", "numberValue": 12345},
    {"key": "confidential", "booleanValue": true}
  ]
}
```

### Example — get specific attribute
```bash
curl -X GET "$BASE_URL/documents/$DOC_ID/attributes/department?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### Example response

```json
{
  "attribute": {
    "key": "department", "stringValue": "Finance"
  }
}
```


## Delete Document Attributes

Removes a specific attribute from a document.

Once deleted, the key/value pair is no longer associated with the document and will not appear in search or metadata listings.

### Common use cases

- Remove outdated metadata after workflow completion
- Correct metadata errors (e.g., wrong department or project)
- Clean up attributes before archiving or purging documents

### Example request

```bash
curl -X DELETE "$BASE_URL/documents/$DOC_ID/attributes/department?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN"
```

#### Example response

```json
{
  "message": "Attribute deleted",
}
```

## Search for Document Attributes

The POST /search endpoint allows you to search for documents that match specific attribute key/value pairs stored in FormKiQ.

By default, this endpoint supports searching for a single attribute, but Composite Keys can be used to search across multiple attributes at once.

For broader, content-based, or fuzzy text searches, use the POST /searchFulltext endpoint, which leverages OpenSearch for multi-attribute and full-text queries.

:::note
- POST /search — searches by attributes or tags in DynamoDB (single attribute unless using Composite Keys).
- POST /searchFulltext — performs full-text or multi-attribute search across attributes, tags, and metadata.
:::

### Common use cases

- Find all documents with a specific attribute (e.g., department = Finance)
- Use multiple attributes via Composite Keys (e.g., department + projectCode)

### Example — search by a single attribute

```bash
curl -X POST "$BASE_URL/search?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "attribute": {
        "key": "department",
        "eq": "Finance"
      }
    }
  }'
```

### Example response
```json
{
  "documents": [
    {
      "documentId": "9d372079-6e55-4d17-8fd7-0fcf154d48d6",
      "path": "reports/finance/Q1-2025.pdf"
    },
    {
      "documentId": "5ae577da-d9d9-4ee4-8b36-eafa51744004",
      "path": "reports/finance/Q2-2025.pdf",
    }
  ]
}
```

### Example — search by a single attribute and return selected attributes

The following example search for department and returns the values of other attributes / tags.

```bash
curl -X POST "$BASE_URL/search?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "attribute": { "key": "department", "eq": "Finance" }
    },
    "responseFields": {
      "attributes": ["department", "projectCode"],
      "tags": ["category"]
    }
  }'
```

### Define Composite Keys, then search with multiple attributes

Use PUT /sites/:siteId/schema/document to set your site schema, including attributes.compositeKeys.

```bash
curl -X PUT "$BASE_URL/sites/$SITE_ID/schema/document?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Default Schema",
    "attributes": {
      "compositeKeys": [
        {
          "attributeKeys": ["department", "projectCode"]
        }
      ]
    }
  }'
```

After updating schema, composite keys will be generated for new or changed documents, but existing documents can be reindex (optional but recommended) so composite keys are generated for them.

```bash
curl -X POST "$BASE_URL/reindex/documents/$DOC_ID?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "target": "ATTRIBUTE" }'
```

Searching for multiple attributes will use the composite key to find matching documents.

```bash
curl -X POST "$BASE_URL/search?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "attributes": [{
        "key": "department",
        "eq": "Finance"
      },{
        "key": "projectCode",
        "eq": "A123"
      }]
    }
  }'
```

### Example — using POST /searchFulltext for complex or multi-attribute queries

Using the `POST /searchFulltext` allow for multi-attribute searching without composite keys.

```
curl -X POST "$BASE_URL/searchFulltext?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "attributes": [
        {"key": "department", "eq": {"stringValue": "Finance"}},
        {"key": "projectCode", "eq": {"stringValue": "Q1-2025"}}
      ]
    }
  }'
```

## Advanced Search

The POST /queryFulltext endpoint provides direct access to the underlying OpenSearch API for FormKiQ’s full-text search index.

Unlike POST /searchFulltext, which wraps common search patterns, POST /queryFulltext accepts the raw OpenSearch query DSL, giving you complete control over advanced filters, multi-attribute conditions, sorting, and aggregations.

This endpoint is ideal for power users or integrations that need complex multi-attribute, full-text, or range-based searches.

:::note
This endpoint supports the same site-scoped authentication and requires a JSON body containing an OpenSearch-compatible query object.

The endpoint can handle both text-based and structured attribute queries.
:::

### Common use cases
- Combine full-text search with multiple attribute filters (e.g., documents containing “budget” and department=Finance).
- Run Boolean queries (must, should, must_not) for complex filtering.
- Perform range searches on numerical or date attributes (e.g., createdDate > 2025-01-01).
- Retrieve sorted or aggregated search results directly from OpenSearch.

### Example — full-text and multi-attribute search
```bash
curl -X POST "$BASE_URL/queryFulltext?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "bool": {
        "must": [
          { "match": { "content": "budget" } },
          { "term": { "attributes.department": "Finance" } },
          { "term": { "attributes.projectCode": "Q1-2025" } }
        ],
        "must_not": [
          { "term": { "attributes.confidential": "true" } }
        ]
      }
    },
    "sort": [
      { "createdDate": { "order": "desc" } }
    ],
    "size": 10
  }'
```

### Example response
```json
{
  "result": {
    "hits": {
      "total": 2,
      "hits": [
        {
          "_index": "formkiq-documents",
          "_id": "a1b2c3d4",
          "_source": {
            "documentId": "a1b2c3d4-...-z9",
            "path": "finance/budget/Q1-2025-summary.pdf",
            "attributes": {
              "department": "Finance",
              "projectCode": "Q1-2025"
            },
            "score": 2.13
          }
        },
        {
          "_index": "formkiq-documents",
          "_id": "f9e8d7c6",
          "_source": {
            "documentId": "f9e8d7c6-...-b2",
            "path": "finance/budget/Q1-2025-overview.pdf",
            "attributes": {
              "department": "Finance",
              "projectCode": "Q1-2025"
            },
            "score": 1.87
          }
        }
      ]
    }
  }
}
```

## Next Steps

- Explore [Document Tags, Attributes](/docs/tutorials/Documents/document-attributes-api)
