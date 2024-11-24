---
sidebar_position: 10
---

# Mappings

The Mapping feature in FormKiQ allows users to define custom mappings for document attributes. This feature is essential for categorizing, searching, and managing documents effectively by associating specific attributes with document content or metadata.

## Mapping Structure

A mapping is defined by its name, description, and a set of attributes. Each attribute includes several key properties that determine how the attribute is sourced, labeled, and validated.

### Mapping Definition

- **name**: A string representing the name of the mapping. **(required)**
- **description**: A string providing a brief description of the mapping's purpose.
- **attributes**: An array of attribute objects that define the specific attributes to be mapped. **(required)**

### Attribute Structure

Each attribute within a mapping includes the following properties:

- **attributeKey**: A string representing the unique key for the attribute. **(required)**
- **sourceType**: Specifies the source type of the attribute. Supported values: `CONTENT`, `METADATA`. **(required)**
- **defaultValue**: A string representing the default value of the attribute if no other value is found.
- **defaultValues**: An array of default values for the attribute.
- **labelTexts**: An array of strings that represent label texts for the attribute. **(required)**
- **labelMatchingType**: Specifies the type of matching to be used for labels. Supported values: `FUZZY`, `EXACT`, `BEGINS_WITH`, `CONTAINS`. **(required)**
- **metadataField**: Specifies the metadata field associated with the attribute. Supported values: `USERNAME`, `PATH`, `CONTENT_TYPE`.
- **validationRegex**: A string representing a regular expression used to validate the attribute's value.

#### attributeKey
A unique identifier for the attribute within the mapping.

#### sourceType
Determines whether the attribute is sourced from the document's content or its metadata. Options are:
- `CONTENT`: Extracted directly from the document's content.
- `METADATA`: Extracted from the document's metadata.

#### defaultValue
Specifies a default value for the attribute if no value is provided or found.

#### defaultValues
An array of potential default values for the attribute, providing flexibility in default assignments.

#### labelTexts
An array of labels that can be used to identify or categorize the attribute.

#### labelMatchingType
Defines the type of matching used for the labels. Options are:
- `FUZZY`: Allows approximate matches.
- `EXACT`: Requires exact matches.
- `BEGINS_WITH`: Matches labels that start with a specified string.
- `CONTAINS`: Matches labels that contain a specified string.

#### metadataField
Specifies the metadata field that the attribute corresponds to. 

Options include:

- `USERNAME`: The username associated with the document.
- `PATH`: The file path of the document.
- `CONTENT_TYPE`: The MIME type or content type of the document.

:::note
Only required if sourceType is METADATA
:::

#### validationRegex
A regular expression used to validate the format or content of the attribute's value.

## Examples

Here are some example of using the `/mapping` API

### Extract Invoice No

This example extract an invoice number from a document. The invoice number follows the pattern of "INV-12345". It will look in the document content for "invoice no", "invoice number", "purchase order" and use FUZZY matching to find the best match. The matching value will be stored in the attribute "invoiceNumber" attached to the document.

POST /mappings

```json
{
  "mapping": {
    "name": "Extract Invoice No",
    "description": "This mapping extract invoice no from document",
    "attributes": [
      {
        "attributeKey": "invoiceNumber",
        "sourceType": "CONTENT",
        "labelTexts": [
          "invoice no",
          "invoice number",
          "purchase order"
        ],
        "labelMatchingType": "FUZZY",
        "validationRegex": "INV-\d+"
      }
    ]
  }
}
```