---
sidebar_position: 25
---

# Schemas

## Overview

The Schema and Classification feature enables users to define a set of rules for document attributes. These rules help ensure data consistency and enforce required or optional attributes for each document. By utilizing this structure, you can create a robust framework for document categorization and validation.

### Site Schema

Applies at the site level and establishes the foundational structure and rules for how documents should be organized and stored across a site. The site schema defines the required and optional attributes that all documents within a site must adhere to, ensuring consistency and integrity of the site’s document repository.


### Site Classifications:

Applies at the document level and is used to categorize or apply individual documents with additional metadata. This allows for more granular control and enables users to apply classifications that may influence how documents are searched, filtered, or managed without altering the underlying site schema. In other words, while the site schema governs the overall structure, site classifications provide a flexible way to add context or categorization to specific documents.

Both features use the same JSON structure outlined below, but they serve distinct purposes within the document management platform.

## Use Cases

### Site Schema

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

### Site Classification

#### Granular Document Tagging
Categorize individual documents with specific metadata that can be used to filter or search for documents based on context.

#### Enhanced Document Filtering
Apply classifications to support dynamic grouping or segmentation of documents, such as by department, project, or content type.

#### Contextual Metadata
Provide additional context to documents without altering the core site schema, enabling richer document insights.

#### Flexible Document Organization
Allow users to classify documents in ways that meet evolving business needs, such as temporary projects or ad hoc categorization.

#### Personalized Document Management
Enable tailored views and workflows by tagging documents with classifications that align with user roles or departmental requirements.

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
   - Keep schemas focused and specific
   - Use clear naming conventions
   - Document schema purposes
   - Plan for scalability

### Composite Keys
   - Choose attributes that create meaningful combinations
   - Consider query patterns
   - Keep key components minimal
   - Order attributes by specificity

### Attribute Management
   - Define clear validation rules
   - Use appropriate default values
   - Document allowed values
   - Consider future needs

### Maintenance
   - Regular schema reviews
   - Monitor validation failures
   - Update documentation
   - Test schema changes

## Common Use Cases

### Input Consistency
   - Enforce consistent attribute requirements across multiple applications
   - Standardize document metadata regardless of source
   - Maintain data quality across systems
   - Validate inputs automatically

### Document Organization
   - Department-specific rules
   - Project documentation
   - Compliance requirements
   - Customer records

### Access Control
   - Security classifications
   - Department permissions
   - Role-based access
   - Data privacy

### Search Optimization
   - Custom indexes
   - Filtered searches
   - Categorized queries
   - Related document lookup

## API Integration

For complete API documentation, see [Schema API Reference](/docs/api-reference/get-sites-schema).