---
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 2
---
# Entity Types, Entities, and Documents

## Overview

The Documents API is the core of the FormKiQ platform. It enables developers to create, manage, and retrieve documents and their associated metadata through RESTful endpoints.

## Prerequisites

- A valid FormKiQ account or API environment
- [Access credentials and FormKiQ API Endpoint URL](/docs/getting-started/api-walkthrough#acquire-access-token)
- Familiarity with REST APIs and JSON payloads

## Create Entity Types (CUSTOM vs PRESET)

Entity Types define the kind of entities you’ll store (e.g., Customer, Case, ModelPrompt). They can be CUSTOM (your own) or PRESET (built-in names you choose to use such as Checkout, LlmPrompt, CheckoutForLegalHold). 

Use this step to register an entity type so you can create entities of that type.

### Common use cases
- Standardize business concepts across sites (e.g., Customer, Contract, Matter).
- Enable downstream features (entities list, linking to documents).
- Adopt FormKiQ preset names for interoperable workflows (e.g., Checkout, LlmPrompt, CheckoutForLegalHold)

### Example - create a CUSTOM entity type
```bash
curl -X POST "$BASE_URL/entityTypes?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": {
      "namespace": "CUSTOM",
      "name": "Customer"
    }
  }'
```

### Example — create a PRESET entity type (e.g., Checkout)
```bash
curl -X POST "$BASE_URL/entityTypes?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": {
      "namespace": "PRESET",
      "name": "Checkout"
    }
  }'
```

### Example - list entity types
```bash
curl -X GET "$BASE_URL/entityTypes?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN"
```

## Create Entities

After defining an entity type, create entities (instances) under that type (e.g., an actual customer record). Entities can have a name and attributes and are identified by an entityId.

### Common use cases
- Store master data like customers, projects, cases, prompts.
- Attach attributes to entities for filtering and display.
- Prepare entities to be linked to one or more documents.

### Example - create an entity (CUSTOM type "Customer")

```bash
# Assume you already created an EntityType and have its ID in $ENTITY_TYPE_ID or Entity Type Name
curl -X POST "$BASE_URL/entities/$ENTITY_TYPE_ID?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entity": {
      "name": "ACME Corporation",
      "attributes": [
        {"key": "customerNumber", "stringValue": "CUST-001"},
        {"key": "region", "stringValue": "NA"}
      ]
    }
  }'
```

## Add Entities to Documents

Link one or more entities to a document using Document Attributes that reference an entityTypeId/entityId. FormKiQ’s schema includes a Document Entity Attribute shape, which lets you store a key on the document whose value points to an entity (and its type/namespace). This approach keeps the relationship explicit, queryable, and lightweight.  ￼

### Common use cases
- Attach a Customer entity to invoices for fast lookups.
- Link a Case entity to evidence documents.
- Reference a Checkout or LlmPrompt entity alongside related files.

### Example - link a Customer entity to a document
```bash
curl -X POST "$BASE_URL/documents/$DOC_ID/attributes?siteId=$SITE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "attributes": [
      {
        "key": "customer",
        "entityTypeId": "'"$ENTITY_TYPE_ID"'",
        "entityId": "'"$ENTITY_ID"'",
        "namespace": "CUSTOM"
      }
    ]
  }'
```

## Next Steps

- Explore [Document Tags, Attributes](/docs/tutorials/Documents/document-attributes-api)