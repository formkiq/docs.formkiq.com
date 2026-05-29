---
sidebar_position: 25
title: Schemas
---

# Schemas

## Overview

Schemas define rules for document attributes. They help keep metadata consistent by specifying which attributes are required, which are optional, which values are allowed, and which attribute combinations should be indexed for multi-attribute search.

FormKiQ supports two related schema concepts:

- **Site schema**: Applies to documents in a site.
- **Classification schema**: Applies to documents assigned to a specific classification.

Use schemas when document metadata needs structure, validation, consistency, search optimization, or localized allowed values.

## Site Schema vs Classification Schema

| Schema type | Scope | Best for |
| --- | --- | --- |
| Site schema | Applies at the site level. | Metadata rules that should apply broadly across the site. |
| Classification schema | Applies to documents with a specific classification. | Metadata rules for a document type, record class, business process, or department. |

Examples:

- A site schema might require every document to have `department`.
- An invoice classification might require `invoiceNumber`, `vendorName`, and `invoiceDate`.
- A contract classification might require `counterparty`, `effectiveDate`, and `contractType`.

Recommended model:

- Use the site schema for shared requirements.
- Use classification schemas for document-type-specific requirements.
- Avoid applying multiple overlapping classifications to one document unless the validation behavior is clearly understood and tested.

## How Schemas Work with Attributes

Schemas do not replace attributes. Schemas define rules for attributes.

| Concept | Role |
| --- | --- |
| Attribute definition | Defines an available field, such as `department` or `invoiceNumber`. |
| Document attribute | Stores a value on a document, such as `department = Finance`. |
| Site schema | Defines site-wide metadata expectations. |
| Classification schema | Defines metadata expectations for a specific document class. |
| Locale resource item | Provides localized display values for allowed values. |

For attribute details, see [Attributes](/docs/features/attributes). For localized allowed values, see [Locales](/docs/features/locales).

## Schema Structure

Site schemas and classification schemas use the same core structure.

```json
{
  "name": "Financial Records",
  "attributes": {
    "compositeKeys": [],
    "required": [],
    "optional": [],
    "allowAdditionalAttributes": true
  }
}
```

| Field | Description |
| --- | --- |
| `name` | Human-readable schema or classification name. |
| `attributes` | Container for schema rules. |
| `compositeKeys` | Attribute combinations indexed for multi-attribute search. |
| `required` | Attributes that must be present. |
| `optional` | Attributes that are allowed but not required. |
| `allowAdditionalAttributes` | Whether attributes outside the required and optional lists are allowed. |

## Required and Optional Attributes

Required and optional schema entries define rules for document attributes.

### Required Attributes

Required attributes must be present for documents governed by the schema.

```json
{
  "required": [
    {
      "attributeKey": "documentType",
      "allowedValues": ["invoice", "receipt", "statement"],
      "minNumberOfValues": 1,
      "maxNumberOfValues": 1
    }
  ]
}
```

### Optional Attributes

Optional attributes are permitted but not mandatory.

```json
{
  "optional": [
    {
      "attributeKey": "department",
      "allowedValues": ["finance", "legal", "operations"],
      "minNumberOfValues": 1,
      "maxNumberOfValues": 1
    }
  ]
}
```

| Field | Purpose |
| --- | --- |
| `attributeKey` | Attribute that the rule applies to. |
| `defaultValue` | Single default value. |
| `defaultValues` | Multiple default values. |
| `allowedValues` | Enumerated values the attribute may contain. |
| `minNumberOfValues` | Minimum number of values required. |
| `maxNumberOfValues` | Maximum number of values allowed. |

## Allowed Values and Localized Values

`allowedValues` define the canonical stored values that are accepted for an attribute.

```json
{
  "attributeKey": "priority",
  "allowedValues": ["HI", "MD", "LO"]
}
```

Allowed values are enumerated values. They are not regex patterns. If a value must match a pattern, model that validation separately in the process that creates or updates the attribute.

Localized display values can be added through locale resource items. The stored value can remain stable while users see translated or region-specific labels.

Example:

| Stored value | `en-US` display | `fr-CA` display |
| --- | --- | --- |
| `HI` | High | Eleve |
| `MD` | Medium | Moyen |
| `LO` | Low | Faible |

For details, see [Locales](/docs/features/locales).

## Composite Keys

Composite keys optimize multi-attribute searches through the DynamoDB-backed `/search` endpoint.

By default, DynamoDB-style attribute search is best for targeted lookup patterns. Composite keys let you define common multi-attribute combinations that FormKiQ should index.

Example:

```json
{
  "compositeKeys": [
    {
      "attributeKeys": ["department", "fiscalYear", "quarter"]
    }
  ]
}
```

Use composite keys when users or integrations frequently search by the same attribute combination.

Guidelines:

- Use 2 to 3 attributes per composite key.
- Define no more than 5 composite keys per schema.
- Order matters for key formation.
- Three-key composite searches should provide all three keys.
- Create a separate two-key composite key if users need that two-key search.
- Use full-text search or OpenSearch for broader ad hoc search patterns.

For search guidance, see [Search](/docs/features/search).

## `allowAdditionalAttributes`

`allowAdditionalAttributes` controls whether documents can include attributes that are not listed in the schema's `required` or `optional` sections.

| Setting | Behavior | Best for |
| --- | --- | --- |
| `true` | Documents can include additional attributes beyond the schema. | Flexible metadata capture, evolving processes, exploratory use cases. |
| `false` | Documents are limited to the schema-defined attributes. | Regulated records, controlled forms, strict classification, data governance. |

Use `false` when metadata consistency is more important than flexibility. Use `true` when teams need room to add new attributes without changing the schema first.

## Applying Classifications to Documents

A classification schema applies when a document is assigned a classification. The classification is represented through document attributes using the API-supported classification attribute shape.

Use the generated document attribute APIs for exact request formats:

- [Add attribute to document](/docs/api-reference/add-document-attributes)
- [Set document's attributes](/docs/api-reference/set-document-attributes)
- [Get document's attributes](/docs/api-reference/get-document-attributes)

:::note
Although a document can be assigned more than one classification, overlapping classification schemas can produce confusing validation behavior. Prefer one site schema plus one classification schema per document unless multiple classifications have been explicitly tested.
:::

## Practical Examples

### Site Schema Example

Use a site schema for attributes expected across the site.

```json
{
  "name": "Site Metadata",
  "attributes": {
    "required": [
      {
        "attributeKey": "department",
        "allowedValues": ["finance", "legal", "operations"]
      }
    ],
    "optional": [
      {
        "attributeKey": "region",
        "allowedValues": ["NA", "EMEA", "APAC"]
      }
    ],
    "allowAdditionalAttributes": true
  }
}
```

### Invoice Classification Example

Use a classification schema for attributes required by a specific document type.

```json
{
  "name": "Invoice",
  "attributes": {
    "compositeKeys": [
      {
        "attributeKeys": ["vendorName", "invoiceDate"]
      }
    ],
    "required": [
      {
        "attributeKey": "documentType",
        "defaultValue": "invoice",
        "allowedValues": ["invoice"]
      },
      {
        "attributeKey": "invoiceNumber"
      },
      {
        "attributeKey": "vendorName"
      }
    ],
    "optional": [
      {
        "attributeKey": "purchaseOrderNumber"
      }
    ],
    "allowAdditionalAttributes": false
  }
}
```

### HR Record Classification Example

```json
{
  "name": "Employee Record",
  "attributes": {
    "compositeKeys": [
      {
        "attributeKeys": ["employeeId", "documentType"]
      }
    ],
    "required": [
      {
        "attributeKey": "employeeId"
      },
      {
        "attributeKey": "documentType",
        "allowedValues": ["contract", "review", "certification"]
      }
    ],
    "optional": [
      {
        "attributeKey": "year"
      },
      {
        "attributeKey": "manager"
      }
    ],
    "allowAdditionalAttributes": false
  }
}
```

## Best Practices

### Start with Attribute Design

Define the attributes first, then use schemas to control how those attributes are used.

Good candidates for schema rules:

- `documentType`
- `department`
- `region`
- `customerId`
- `invoiceNumber`
- `retentionCategory`
- `confidentiality`

### Use Site Schema for Shared Rules

Keep site schema focused on metadata that applies broadly. Avoid overloading the site schema with every document-type-specific field.

### Use Classifications for Document Types

Create classification schemas for document types or business processes that need their own required fields.

Examples:

- Invoice
- Contract
- HR Record
- Policy
- Case Evidence

### Keep Allowed Values Stable

Use canonical stored values that are stable across languages and user interfaces. Use locales for translated display values.

### Design Composite Keys from Real Searches

Create composite keys only for search patterns that users or integrations actually need. Too many unused composite keys add complexity without improving the user experience.

### Test Strict Schemas Before Production

If `allowAdditionalAttributes` is `false`, test document creation, upload, mapping, workflow, and integration paths before production. Strict schemas can reject or block metadata that was accepted previously.

## API Operations

Use the generated API reference for exact request and response schemas.

### Site Schema Operations

| Operation | Purpose | API reference |
| --- | --- | --- |
| Get site schema | Retrieve the site schema. | [`GET /sites/{siteId}/schema/document`](/docs/api-reference/get-sites-schema) |
| Set site schema | Create or update the site schema. | [`PUT /sites/{siteId}/schema/document`](/docs/api-reference/set-sites-schema) |
| Get schema allowed values | Retrieve allowed values and localized values for a site schema attribute. | [`GET /sites/{siteId}/schema/document/attributes/{key}/allowedValues`](/docs/api-reference/get-sites-schema-attribute-allowed-values) |

### Classification Operations

| Operation | Purpose | API reference |
| --- | --- | --- |
| List classifications | Retrieve classifications for a site. | [`GET /sites/{siteId}/classifications`](/docs/api-reference/get-sites-classifications) |
| Add classification | Create a classification schema. | [`POST /sites/{siteId}/classifications`](/docs/api-reference/add-classification) |
| Get classification | Retrieve one classification schema. | [`GET /sites/{siteId}/classifications/{classificationId}`](/docs/api-reference/get-classification) |
| Set classification | Update a classification schema. | [`PUT /sites/{siteId}/classifications/{classificationId}`](/docs/api-reference/set-classification) |
| Delete classification | Delete a classification schema. | [`DELETE /sites/{siteId}/classifications/{classificationId}`](/docs/api-reference/delete-classification) |
| Get classification allowed values | Retrieve allowed values and localized values for a classification attribute. | [`GET /sites/{siteId}/classifications/{classificationId}/attributes/{key}/allowedValues`](/docs/api-reference/get-classification-attribute-allowed-values) |

### Related Document and Search Operations

| Operation | Purpose | API reference |
| --- | --- | --- |
| Add document attributes | Assign attributes or classifications to a document. | [`POST /documents/{documentId}/attributes`](/docs/api-reference/add-document-attributes) |
| Set document attributes | Set document attributes. | [`PUT /documents/{documentId}/attributes`](/docs/api-reference/set-document-attributes) |
| Search documents | Search by metadata and attributes, including composite key patterns. | [`POST /search`](/docs/api-reference/document-search) |
| Full-text search | Search broader text and indexed content where enabled. | [`POST /searchFulltext`](/docs/api-reference/search-fulltext) |

## Where to Go Next

- [Attributes](/docs/features/attributes)
- [Locales](/docs/features/locales)
- [Search](/docs/features/search)
- [Documents](/docs/features/documents)
- [Mappings](/docs/features/mappings)
- [Site Classification Schemas Tutorial](/docs/tutorials/Documents/site-classification-schemas)
