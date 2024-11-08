---
sidebar_position: 25
---

# Site / Classification Schemas

The Site / Classification Schemas feature in FormKiQ defines the structure and rules for how documents are organized, ensuring consistency and adherence to specified requirements. This feature allows administrators to specify mandatory and optional attributes, enforce value constraints, and manage composite keys for unique document identification.

The difference between Site and Classification schemas, is that a Site schema applies to ALL documents added at a site level and Classification is additional structures and rules that can be applied on a specific document.

## Components

A site schema is defined by its name and a set of attributes. The attributes are categorized into composite keys, required attributes, optional attributes, and an option to allow additional attributes.

- **name**: A string representing the name of the schema.
- **attributes**: An object that defines various attribute categories and rules.

### Composite Keys

Composite keys are used to create unique identifiers for documents based on multiple attributes. This allows for enhanced searching and data retrieval patterns using [Amazon Dynamodb](https://aws.amazon.com/dynamodb).

  - **Parameters:**
    - **compositeKeys**: An array of composite key objects.
      - **attributeKeys**: An array of strings representing the attribute keys that make up the composite key.

### Required Attributes

Specifies mandatory attributes that must be present in each document. These attributes can have default values and allowed values to enforce constraints.

  - **Parameters:**
    - **required**: An array of required attribute objects.
      - **attributeKey**: A string representing the unique key for the attribute.
      - **defaultValue**: A string representing the default value of the attribute if no other value is found.
      - **defaultValues**: An array of default values for the attribute.
      - **allowedValues**: An array of allowed values for the attribute, enforcing value constraints.

### Optional Attributes

Specifies attributes that are not mandatory but can have allowed values defined.

  - **Parameters:**
    - **optional**: An array of optional attribute objects.
      - **attributeKey**: A string representing the unique key for the attribute.
      - **allowedValues**: An array of allowed values for the attribute.

### Additional Attributes

Indicates whether attributes not defined in the schema are permitted. This provides flexibility for extending the schema as needed.

  - **Parameters:**
    - **allowAdditionalAttributes**: A boolean value indicating whether additional attributes are allowed. Possible values: `true`, `false`.

## Examples

The following are examples for different site schema configuration.

### Composite Key

This Site Schema create 2 composite key. If a document is added to FormKiQ with attributes matching a composite key, a composite key is added.

```json
{
  "name": "Additional Search Patterns",
  "attributes": {
    "compositeKeys": [
      {
        "attributeKeys": [
          "category",
          "date"
        ]
      },{
        "attributeKeys": [
          "companyId",
          "departmentId"
        ]
      }
    ]
  }
}
```

### Required Attributes

This Site Schema ensure that the `security` attribute is added for each document. A document missing this attribute will be rejected.

```json
{
  "name": "Required Attributes",
  "attributes": {
    "required": [
      {
        "attributeKey": "security",
        "allowedValues": [
          "private",
          "public"
        ]
      }
    ]
  }
}
```

### Limited Attributes

This Site Schema have a limited number of attributes allowed for a document and does not allow any other attributes.

```json
{
  "name": "Limited Attributes",
  "attributes": {
    "required": [
      {
        "attributeKey": "security"
      }
    ],
    "optional": [
      {
        "attributeKey": "documentType"
      },
      {
        "attributeKey": "category",
        "allowedValues": [
          "invoice",
          "receipt"
        ]
      }
    ],
    "allowAdditionalAttributes": false
  }
}
```