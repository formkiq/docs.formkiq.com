---
sidebar_position: 10
title: Mappings
---

# Mappings

## Overview

Mappings define how FormKiQ turns extracted data, document metadata, classification output, malware scan output, or fixed values into document attributes. They are most often used with Intelligent Document Processing (IDP), OCR, workflows, and document actions.

Use mappings when you want FormKiQ to populate document attributes in a repeatable way instead of relying on users or integrations to manually assign every value.

Examples:

- Extract `invoiceNumber` from document text.
- Read `vendorName` from Textract key-value output.
- Set `sourceSystem = email-ingest` for documents from a workflow.
- Copy the document path into an attribute.
- Store a data classification result as an attribute.
- Store an anti-malware scan result as an attribute.

## Where Mappings Fit

Mappings sit between source data and document attributes.

| Step | What happens |
| --- | --- |
| 1. Source data is available | Content, key-value OCR output, document metadata, classification output, malware scan output, or a fixed value. |
| 2. Mapping evaluates the source | The mapping decides which source value should populate which document attribute. |
| 3. Validation and defaults are applied | Regex validation and default values can help normalize missing or inconsistent data. |
| 4. Document attributes are written | The mapped values become structured metadata on the document. |
| 5. Downstream features use the attributes | Search, schemas, rulesets, workflows, reporting, and access policies can use the resulting attributes. |

Mappings are commonly referenced by `mappingId` from document upload, document update, document actions, or workflows.

## Mapping Data Model

A mapping contains a name, optional description, and one or more attribute mapping rules.

```json
{
  "mapping": {
    "name": "Invoice Mapping",
    "description": "Extracts invoice fields from uploaded invoices",
    "attributes": [
      {
        "attributeKey": "invoiceNumber",
        "sourceType": "CONTENT",
        "labelTexts": ["invoice number", "invoice no", "invoice #"],
        "labelMatchingType": "FUZZY",
        "validationRegex": "INV-\\d{5}"
      }
    ]
  }
}
```

### Attribute Mapping Properties

| Property | Description |
| --- | --- |
| `attributeKey` | Document attribute to write. |
| `sourceType` | Source used to populate the attribute. |
| `labelTexts` | Labels or text patterns used to find a value in content or key-value output. |
| `labelMatchingType` | Matching strategy for `labelTexts`. |
| `defaultValue` | Single fallback value when no source value is found. |
| `defaultValues` | Multiple fallback values when no source values are found. |
| `metadataField` | Document metadata field to copy when `sourceType` is `METADATA`. |
| `validationRegex` | Regex used to validate or constrain matched values. |

Not every property applies to every source type. For example, `MANUAL` mappings usually use `defaultValue` or `defaultValues`, while `METADATA` mappings use `metadataField`.

## Source Types

| Source type | Use for | Typical supporting fields |
| --- | --- | --- |
| `CONTENT` | Extracting values from document text. | `labelTexts`, `labelMatchingType`, `validationRegex` |
| `CONTENT_KEY_VALUE` | Extracting values from key-value pairs, such as AWS Textract forms output. | `labelTexts`, `labelMatchingType`, `validationRegex` |
| `METADATA` | Copying FormKiQ document metadata into an attribute. | `metadataField` |
| `MANUAL` | Setting a fixed value or key-only attribute through a mapping. | `defaultValue`, `defaultValues` |
| `DATA_CLASSIFICATION` | Mapping output from document data classification. | Depends on classification output and mapping design. |
| `MALWARE_SCAN` | Mapping malware or antivirus scan output. | Depends on scan result output. |

### Metadata Fields

When `sourceType` is `METADATA`, the mapping can read one of these document metadata fields:

| Metadata field | Meaning |
| --- | --- |
| `USERNAME` | User who created or owns the document, depending on document context. |
| `PATH` | FormKiQ document path. |
| `CONTENT_TYPE` | Document content type. |

## Label Matching

Label matching tells FormKiQ how to find a source value when using content-based or key-value extraction.

| Matching type | Behavior | Best for |
| --- | --- | --- |
| `FUZZY` | Allows approximate matches. | OCR text with small variations, typos, or inconsistent labels. |
| `EXACT` | Requires an exact label match. | Standardized forms or controlled templates. |
| `BEGINS_WITH` | Matches labels that begin with the supplied text. | Labels with consistent prefixes. |
| `CONTAINS` | Matches labels that contain the supplied text. | Less structured content where labels may appear inside longer phrases. |

Use multiple `labelTexts` values when documents use different label wording.

```json
{
  "labelTexts": [
    "invoice date",
    "date of invoice",
    "invoice dt",
    "billing date"
  ],
  "labelMatchingType": "FUZZY"
}
```

## Validation and Defaults

Use `validationRegex` to reject values that do not match the expected format.

Example invoice number validation:

```json
{
  "validationRegex": "INV-\\d{5}"
}
```

Example date validation:

```json
{
  "validationRegex": "\\d{4}-\\d{2}-\\d{2}"
}
```

Use `defaultValue` or `defaultValues` when a value should still be written if no match is found.

```json
{
  "attributeKey": "sourceSystem",
  "sourceType": "MANUAL",
  "defaultValue": "email-ingest"
}
```

## Practical Examples

### CONTENT Extraction

Use `CONTENT` when FormKiQ should search document text for a value near a label.

```json
{
  "mapping": {
    "name": "Invoice Number From Text",
    "description": "Extracts invoice numbers from document text",
    "attributes": [
      {
        "attributeKey": "invoiceNumber",
        "sourceType": "CONTENT",
        "labelTexts": ["invoice no", "invoice number", "invoice #"],
        "labelMatchingType": "FUZZY",
        "validationRegex": "INV-\\d{5}"
      }
    ]
  }
}
```

### CONTENT_KEY_VALUE Extraction

Use `CONTENT_KEY_VALUE` when OCR or Textract forms output provides key-value pairs.

```json
{
  "mapping": {
    "name": "Invoice Number From Form Fields",
    "description": "Extracts invoice number from key-value OCR output",
    "attributes": [
      {
        "attributeKey": "invoiceNumber",
        "sourceType": "CONTENT_KEY_VALUE",
        "labelTexts": ["invoice no", "invoice number", "invoice #"],
        "labelMatchingType": "FUZZY",
        "validationRegex": "INV-\\d{5}"
      }
    ]
  }
}
```

### METADATA Mapping

Use `METADATA` to copy FormKiQ document metadata into a document attribute.

```json
{
  "mapping": {
    "name": "Copy Content Type",
    "description": "Stores document content type as an attribute",
    "attributes": [
      {
        "attributeKey": "documentContentType",
        "sourceType": "METADATA",
        "metadataField": "CONTENT_TYPE"
      }
    ]
  }
}
```

### MANUAL Attribute Value

Use `MANUAL` to set a fixed value as part of a workflow, upload process, or document action.

```json
{
  "mapping": {
    "name": "Set Source System",
    "description": "Marks documents as email-ingest documents",
    "attributes": [
      {
        "attributeKey": "sourceSystem",
        "sourceType": "MANUAL",
        "defaultValue": "email-ingest"
      }
    ]
  }
}
```

### DATA_CLASSIFICATION Mapping

Use `DATA_CLASSIFICATION` when classification or extraction output should become document attributes.

Example use cases:

- Store extracted `documentType`.
- Store classification confidence.
- Store extracted entities from a classification result.
- Normalize classification output into attributes used by workflows or search.

### MALWARE_SCAN Mapping

Use `MALWARE_SCAN` when scan output should become document attributes.

Example use cases:

- Store malware scan status.
- Store scan engine output.
- Trigger rules or workflows based on clean, infected, or failed scan results.

For malware-specific behavior, see [Anti-Malware / Antivirus](/docs/formkiq-modules/modules/anti-malware-antivirus).

## Using Mappings with IDP and Workflows

Mappings are most useful when connected to document processing.

| Integration point | How mappings are used |
| --- | --- |
| Document upload | A `mappingId` can be supplied so attributes are populated as part of ingestion. |
| Document update | A `mappingId` can be supplied when updating a document. |
| Document actions | An `IDP` action can reference a `mappingId`. |
| Workflows | A workflow can reference a `mappingId` so documents entering the workflow are processed consistently. |
| Rulesets | Rules can respond to attributes populated by mappings. |

Related docs:

- [Document Actions](/docs/features/documents#document-actions)
- [OCR](/docs/features/ocr)
- [Rulesets](/docs/features/rulesets)
- [Workflows](/docs/features/workflows)
- [Enhanced Document OCR and Classification](/docs/formkiq-modules/modules/enhanced-document-ocr-and-classification)

## Best Practices

### Design Mappings Around Attributes

Start by deciding which document attributes you want to populate. Then design the mapping source, labels, validation, and defaults around those attributes.

Good mapping targets:

- `invoiceNumber`
- `invoiceDate`
- `vendorName`
- `documentType`
- `sourceSystem`
- `scanStatus`
- `classification`

### Use Precise Labels for Critical Fields

For high-value fields such as invoice numbers, customer IDs, or policy numbers, prefer labels and validation rules that reduce false matches.

Use `EXACT` for standardized forms and `FUZZY` only when OCR variation requires it.

### Use Defaults Deliberately

Defaults are useful, but they can hide extraction failures if overused. Use defaults for known constants, such as `sourceSystem`, and be careful when defaulting extracted business fields.

### Validate Extracted Values

Use `validationRegex` for values with expected formats:

- Invoice numbers
- Email addresses
- Dates
- Customer IDs
- Policy numbers

### Test with Real Documents

Test mappings against real examples from each document type. Include:

- Clean digital PDFs
- Scanned PDFs
- Low-quality OCR results
- Regional label variations
- Missing labels
- Unexpected formatting

### Layer Mappings by Document Type

For production IDP, use a tiered strategy:

1. Core attributes that apply to every document.
2. Document-type specific attributes.
3. Optional enrichment attributes.
4. Governance or compliance attributes.

## API Operations

Use the generated API reference for exact request and response schemas.

| Operation | Purpose | API reference |
| --- | --- | --- |
| List mappings | Retrieve mappings available to a site. | [`GET /mappings`](/docs/api-reference/get-mappings) |
| Add mapping | Create a new mapping. | [`POST /mappings`](/docs/api-reference/add-mapping) |
| Get mapping | Retrieve one mapping by ID. | [`GET /mappings/{mappingId}`](/docs/api-reference/get-mapping) |
| Set mapping | Update or replace a mapping. | [`PUT /mappings/{mappingId}`](/docs/api-reference/set-mapping) |
| Delete mapping | Delete a mapping. | [`DELETE /mappings/{mappingId}`](/docs/api-reference/delete-mapping) |
| Add document action | Run an IDP or related action with a mapping. | [`POST /documents/{documentId}/actions`](/docs/api-reference/add-document-actions) |
| Add workflow | Create a workflow that may reference a mapping. | [`POST /workflows`](/docs/api-reference/add-workflow) |
| Set workflow | Update a workflow that may reference a mapping. | [`PUT /workflows/{workflowId}`](/docs/api-reference/set-workflow) |

## Where to Go Next

- [Attributes](/docs/features/attributes)
- [Documents](/docs/features/documents)
- [OCR](/docs/features/ocr)
- [Rulesets](/docs/features/rulesets)
- [Workflows](/docs/features/workflows)
- [Enhanced Document OCR and Classification](/docs/formkiq-modules/modules/enhanced-document-ocr-and-classification)
- [Document Attributes API Tutorial](/docs/tutorials/Documents/document-attributes-api)
