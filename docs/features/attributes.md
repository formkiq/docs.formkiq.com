---
sidebar_position: 2
---

# Attributes

The Attributes feature in FormKiQ allows for the definition and management of metadata attributes associated with documents. This feature is crucial for categorizing, searching, and managing documents based on specific metadata criteria.

Attributes are created at the site level and then assigned to an additional document or entity, that attribute will have access to any additional properties provided to the attribute, such as attribute data type, validation and security.

The main reason for this is to enable attribute-driven and attribute-aware actions within FormKiQ, such as creating a conditional workflow step. By sharing certain properties such as the data type, actions can be applied consistently.

An attribute is defined by its key, data type, and type. These properties ensure that each attribute is uniquely identified, appropriately typed, and categorized according to its usage within the system.

## Attribute Structure

An attribute is defined by its key, data type, and type. These properties ensure that each attribute is uniquely identified, appropriately typed, and categorized according to its usage within the system.

  - **Parameters:**
    - **key**: A string representing the unique key for the attribute.
    - **dataType**: Specifies the type of data that the attribute holds. Supported values are:
      - `STRING`: Used for attributes that contain textual information, such as titles, authors, or descriptions.
      - `NUMBER`: Used for attributes that contain numeric values, such as page counts, version numbers, or identifiers.
      - `BOOLEAN`: Used for attributes that hold true or false values, such as flags for review status or publication status.
      - `KEY_ONLY`: Used for attributes that are primarily identifiers without additional data, serving as unique keys.
    - **type**: Specifies the type of attribute. Supported values are:
      - `STANDARD`: Regular attributes used for general purposes.
      - `OPA`: Attributes that are used with Open Policy Agent for policy-based access control, enabling complex, attribute-based policies for document access and management.

### Example Attribute JSON

Here is an example configuration of an attribute using the supported structure and properties:

```json
{
  "attribute": {
    "key": "documentId",
    "dataType": "STRING",
    "type": "STANDARD"
  }
}
```

## Attribute Properties Explained

### Key
The unique identifier for the attribute within the system. This key is used to reference the attribute in various operations, such as searching and categorizing documents.

### DataType
Defines the type of data the attribute will hold. This ensures that the attribute's values are consistent and can be validated appropriately.

- **STRING**: Used for attributes that contain textual information, such as titles, authors, or descriptions.
- **NUMBER**: Used for attributes that contain numeric values, such as page counts, version numbers, or identifiers.
- **BOOLEAN**: Used for attributes that hold true or false values, such as flags for review status or publication status.
- **KEY_ONLY**: Used for attributes that are primarily identifiers without additional data, serving as unique keys.

### Type
Specifies the categorization of the attribute based on its usage within the DMS.

- **STANDARD**: Regular attributes that are used for general metadata purposes.
- **OPA**: Attributes that are used with Open Policy Agent for policy-based access control, enabling complex, attribute-based policies for document access and management.

## Example Attributes

Here are additional examples of attributes with various configurations:

```json
{
  "attribute": {
    "key": "author",
    "dataType": "STRING",
    "type": "STANDARD"
  }
}
```

```json
{
  "attribute": {
    "key": "pageCount",
    "dataType": "NUMBER",
    "type": "STANDARD"
  }
}
```

```json
{
  "attribute": {
    "key": "isReviewed",
    "dataType": "BOOLEAN",
    "type": "STANDARD"
  }
}
```


```json
{
  "attribute": {
    "key": "security",
    "dataType": "STRING",
    "type": "OPA"
  }
}
```
