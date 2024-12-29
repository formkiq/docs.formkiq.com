---
sidebar_position: 25
---

# Schemas

## Overview

FormKiQ's Schema system provides a powerful way to define and enforce document organization rules. The platform supports two types of schemas:

- **Site Schemas**: Apply to ALL documents within a site
- **Classification Schemas**: Apply additional rules to specific document types

## Schema Structure

```json
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
| compositeKeys | No | Unique identifier definitions |
| required | No | Mandatory attribute rules |
| optional | No | Optional attribute rules |
| allowAdditionalAttributes | No | Allow undefined attributes |

## Attribute Types

### Composite Keys
Enable advanced search patterns using DynamoDB composite keys.

```json
{
  "compositeKeys": [
    {
      "attributeKeys": ["department", "year"]
    }
  ]
}
```

#### Parameters
- **attributeKeys**: Array of attribute keys that form the composite key
- Must contain 2-3 attributes per composite key
- Maximum of 5 composite keys per schema
- Order matters for key formation

:::note
When using three-key composite keys, searches must specify all three keys. If you need to search with only two of the three keys, create a separate composite key for that combination. For more complex search patterns, consider using the Fulltext Search Module.
:::


### Required Attributes
Define mandatory document attributes with validation rules.

```json
{
  "required": [
    {
      "attributeKey": "string",
      "defaultValue": "string",
      "defaultValues": ["string"],
      "allowedValues": ["string"]
    }
  ]
}
```

#### Parameters
- **attributeKey**: Unique attribute identifier
- **defaultValue**: Single default value
- **defaultValues**: Multiple default options
- **allowedValues**: Valid value constraints

### Optional Attributes
Define permitted but not mandatory attributes.

```json
{
  "optional": [
    {
      "attributeKey": "string",
      "allowedValues": ["string"]
    }
  ]
}
```

#### Parameters
- **attributeKey**: Unique attribute identifier
- **allowedValues**: Valid value constraints

## Practical Examples

### 1. Document Classification Schema
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

### 2. Financial Document Schema
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

### 3. HR Document Schema
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

1. **Schema Design**
   - Keep schemas focused and specific
   - Use clear naming conventions
   - Document schema purposes
   - Plan for scalability

2. **Composite Keys**
   - Choose attributes that create meaningful combinations
   - Consider query patterns
   - Keep key components minimal
   - Order attributes by specificity

3. **Attribute Management**
   - Define clear validation rules
   - Use appropriate default values
   - Document allowed values
   - Consider future needs

4. **Maintenance**
   - Regular schema reviews
   - Monitor validation failures
   - Update documentation
   - Test schema changes

## Common Use Cases

1. **Input Consistency**
   - Enforce consistent attribute requirements across multiple applications
   - Standardize document metadata regardless of source
   - Maintain data quality across systems
   - Validate inputs automatically

2. **Document Organization**
   - Department-specific rules
   - Project documentation
   - Compliance requirements
   - Customer records

2. **Access Control**
   - Security classifications
   - Department permissions
   - Role-based access
   - Data privacy

3. **Search Optimization**
   - Custom indexes
   - Filtered searches
   - Categorized queries
   - Related document lookup

## API Integration

For complete API documentation, see [Schema API Reference](/docs/api-reference/get-sites-schema).