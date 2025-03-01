---
sidebar_position: 25
---

# Schemas

## Overview

The Schemas and Classifications feature enables users to define a set of rules for document attributes. These rules help ensure data consistency and enforce required or optional attributes for each document. By utilizing this structure, you can create a robust framework for document categorization and validation.

### Site Schema

The site schema applies at the site level and establishes the foundational structure and rules for how documents should be organized and stored across a site. The site schema defines the required and optional attributes that all documents within a site must adhere to, ensuring consistency and integrity of the site’s document repository.


### Classification Schemas

Classification schemas are applied at the document level and is used to categorize or apply individual documents with additional metadata; this is done by applying a reserved Classification attribute to the document. This allows for more granular control and enables users to apply classification schemas that may influence how documents are searched, filtered, or managed without altering the underlying site schema. In other words, while the site schema governs the overall structure, site classification schemas provide a flexible way to add context or categorization to specific documents.

Both features use the same JSON structure outlined below, but they serve distinct purposes within the document management platform.

## Use Cases

### Site Schemas

#### Global Data Integrity

Enforce consistent data structures across all documents in a site, ensuring that critical information is always captured.

#### Standardization

Define uniform attribute rules for documents, so every document adheres to the same format and validation criteria.

#### Indexing and Search Optimization

Utilize composite keys and structured attributes to improve searchability and retrieval of documents across the entire site.

#### Compliance and Auditing
Ensure that documents meet regulatory or internal standards by requiring mandatory fields and controlled data formats.

#### Efficient Data Management
Simplify data ingestion, updates, and reporting processes by having a well-defined schema at the site level.

### Site Classification Schemas

#### Granular Document Tagging
Categorize individual documents with specific metadata that can be used to filter or search for documents based on context.

#### Enhanced Document Filtering
Apply classification schemas to support dynamic grouping or segmentation of documents, such as by department, project, or content type.

#### Contextual Metadata
Provide additional context to documents without altering the core site schema, enabling richer document insights.

#### Flexible Document Organization
Allow users to classify documents in ways that meet evolving business needs, such as temporary projects or ad hoc categorization.

#### Personalized Document Management
Enable tailored views and workflows by assigning classification schemas to documents that align with user roles or departmental requirements.

## Schema Structure

```JSON
{
  "name": "string",
  "attributes": {
    "compositeKeys": [],
    "required": [],
    "optional": [],
    "allowAdditionalAttributes": boolean
  }
}
```

### Core Components

| Component | Required | Description |
|-----------|----------|-------------|
| name | Yes | Schema identifier |
| attributes | Yes | Configuration object |
| compositeKeys | No | Custom Attribute Key generated for searching |
| required | No | Mandatory attribute rules |
| optional | No | Optional attribute rules |
| allowAdditionalAttributes | No | Allow undefined attributes |

### Attribute Types

Below are detailed description of the different components of the schema.

#### Composite Keys

When using DynamoDB endpoints for search, IE: /search. There is a limitation of only being able to search 1 attribute at a time. To search for multiple attributes you can either use a fulltext solution like Opensearch or Typesense, or you can setup composite keys which will automatically setup the indexes required for multiple attribute search.

For example: Below shows how to setup a composite key for attributes "department" and "date". When a document is added with both those attribute and composite index will be create that will allow for the searching of both attributes.

```json
{
  "compositeKeys": [
    {
      "attributeKeys": ["department", "date"]
    }
  ]
}
```

##### Parameters
- **attributeKeys**: Array of attribute keys that form the composite key
- Must contain 2-3 attributes per composite key
- Maximum of 5 composite keys per schema
- Order matters for key formation

:::note
When using three-key composite keys, searches must specify all three keys. If you need to search with only two of the three keys, create a separate composite key for that combination. For more complex search patterns, consider using the Fulltext Search Module.
:::


#### Required Attributes
Define mandatory document attributes with validation rules.

```json
{
  "required": [
    {
      "attributeKey": "string",
      "defaultValue": "string",
      "defaultValues": ["string"],
      "allowedValues": ["string"],
      "minNumberOfValues": number,
      "maxNumberOfValues": number
    }
  ]
}
```

##### Parameters
- **attributeKey**: Unique attribute identifier
- **defaultValue**: Single default value
- **defaultValues**: Multiple default options
- **allowedValues**: Valid value constraints
- **minNumberOfValues**: The minimum number of attribute values
- **maxNumberOfValues**: The maximum number of attribute values

#### Optional Attributes
Define permitted but not mandatory attributes.

```json
{
  "optional": [
    {
      "attributeKey": "string",
      "allowedValues": ["string"],
      "minNumberOfValues": number,
      "maxNumberOfValues": numbe
    }
  ]
}
```

##### Parameters
- **attributeKey**: Unique attribute identifier
- **allowedValues**: Valid value constraints
- **minNumberOfValues**: The minimum number of attribute values
- **maxNumberOfValues**: The maximum number of attribute values

### Applying a Classification Schema to a Document

```bash
curl -X PUT "https://api.example.com/documents/{documentId}/attributes/classificationId" \
  -H "Authorization: YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "{classificationId}"
  }'
```

:::note
NOTE: While it is possible to assign more than one Classification Schema to a document, no prioritization functionality has been implemented, so the attribute validation results may not be consistent in the case of overlap. Our recommendation is to only enable a site schema and one classification schema for each document.
:::

## Practical Examples

### Document Classification Schema
```json
{
  "name": "Legal Documents",
  "attributes": {
    "required": [
      {
        "attributeKey": "documentType",
        "allowedValues": ["contract", "agreement", "policy"]
      },
      {
        "attributeKey": "securityLevel",
        "defaultValue": "confidential",
        "allowedValues": ["public", "confidential", "restricted"]
      }
    ],
    "optional": [
      {
        "attributeKey": "department",
        "allowedValues": ["legal", "compliance", "operations"]
      }
    ],
    "allowAdditionalAttributes": false
  }
}
```

### Financial Document Schema
```json
{
  "name": "Financial Records",
  "attributes": {
    "compositeKeys": [
      {
        "attributeKeys": ["year", "quarter", "department"]
      }
    ],
    "required": [
      {
        "attributeKey": "documentType",
        "allowedValues": ["invoice", "receipt", "statement"]
      },
      {
        "attributeKey": "fiscalYear",
        "defaultValue": "2024"
      }
    ],
    "allowAdditionalAttributes": true
  }
}
```

### HR Document Schema
```json
{
  "name": "Employee Records",
  "attributes": {
    "compositeKeys": [
      {
        "attributeKeys": ["employeeId", "documentType"]
      }
    ],
    "required": [
      {
        "attributeKey": "documentType",
        "allowedValues": ["contract", "review", "certification"]
      },
      {
        "attributeKey": "employeeId"
      },
      {
        "attributeKey": "department"
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

### Schema Design
- **Keep schemas focused and specific:**
  - Instead of one general "Document" schema, create specific schemas like "Invoice", "Contract", etc.
  - Example: Create separate schemas for HR documents by type (employee contracts, performance reviews)

- **Use clear naming conventions:**
  - For attribute keys: `camelCase` or `snake_case` consistently (e.g., `documentType` or `document_type`)
  - FormKiQ's reserved attributes us `PascalCase`, having the first character of each word capitalized, e.g., `Classification`
  - Example schema naming: `department-documentType-version` (e.g., `finance-invoice-v1`)

- **Document schema purposes:**
  - Include detailed descriptions in schema definitions
  - Example: Create a data dictionary for each schema that explains each attribute's purpose and format

### Composite Keys
- **Choose attributes that create meaningful combinations:**
  - Example: `["projectId", "documentType"]` allows finding all specifications for a specific project
  - Example: `["department", "fiscalYear", "quarter"]` enables quarterly financial report lookups

- **Consider query patterns:**
  - Analyze most common searches before defining composite keys
  - Example: If users frequently search by both customer and product, create a composite key with both attributes

- **Order attributes by specificity:**
  - Place most specific attributes first in the composite key
  - Example: `["employeeId", "documentType", "year"]` rather than `["year", "documentType", "employeeId"]`

### Attribute Management
- **Define clear validation rules:**
  - For dates: Use specific formats (e.g., ISO 8601: YYYY-MM-DD)
  - For IDs: Define patterns like `"allowedValues": ["PR-\\d{4}"]` for project IDs

- **Use appropriate default values:**
  - Current year for `fiscalYear`: `"defaultValue": "2024"`
  - Current status for workflow: `"defaultValue": "draft"`

- **Document allowed values:**
  - Create an attribute reference guide with all possible values and their meanings
  - Example: For `priority` attribute, document that values `["high", "medium", "low"]` correspond to response times

## API Integration

For complete API documentation, see [Schema API Reference](/docs/api-reference/get-sites-schema).