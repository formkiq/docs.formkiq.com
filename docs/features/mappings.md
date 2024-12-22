---
sidebar_position: 10
---

# Mappings

## Overview

The Mapping feature in FormKiQ provides a powerful system for automatically extracting and organizing document information through custom attribute mappings. This feature enables intelligent document processing by defining how content and metadata should be interpreted and stored as document attributes.

## Mapping Configuration

### Basic Structure
```json
{
  "mapping": {
    "name": "string",           // Required
    "description": "string",    // Optional
    "attributes": []            // Required
  }
}
```

### Attribute Properties

| Property | Required | Description | Options |
|----------|----------|-------------|----------|
| attributeKey | ✓ | Unique identifier for the attribute | String |
| sourceType | ✓ | Source of the attribute data | `CONTENT`, `METADATA` |
| labelTexts | ✓ | Array of text patterns to match | String[] |
| labelMatchingType | ✓ | Type of pattern matching | `FUZZY`, `EXACT`, `BEGINS_WITH`, `CONTAINS` |
| defaultValue |  | Fallback value if no match found | String |
| defaultValues |  | Array of fallback values | String[] |
| metadataField |  | Specific metadata field to match | `USERNAME`, `PATH`, `CONTENT_TYPE` |
| validationRegex |  | Validation pattern for matched values | Regex string |

## Source Types

### Content-Based Mapping
- Extracts information directly from document text
- Useful for processing structured documents like invoices or forms
- Supports multiple label patterns for flexible matching

### Metadata-Based Mapping
- Processes document metadata fields
- Ideal for file-level attributes like ownership or content types
- Available fields:
  - USERNAME: Document owner/creator
  - PATH: Document location/path
  - CONTENT_TYPE: Document format

## Label Matching Types

### FUZZY
- Allows for approximate matches
- Handles minor typos and variations
- Best for natural language content

### EXACT
- Requires perfect matches
- Case-sensitive comparison
- Ideal for standardized formats

### BEGINS_WITH
- Matches text starting patterns
- Useful for prefixed content
- Case-sensitive matching

### CONTAINS
- Finds substrings within content
- More flexible than exact matching
- Good for embedded information

## Practical Example

### Invoice Number Extraction
```json
{
  "mapping": {
    "name": "Invoice Number Extractor",
    "description": "Extracts standardized invoice numbers",
    "attributes": [{
      "attributeKey": "invoiceNumber",
      "sourceType": "CONTENT",
      "labelTexts": [
        "invoice no",
        "invoice number",
        "invoice #"
      ],
      "labelMatchingType": "FUZZY",
      "validationRegex": "INV-\\d{5}"
    }]
  }
}
```

## Best Practices

1. **Label Design**
   - Use multiple label variations for better matching
   - Consider common misspellings and formats
   - Test patterns with sample documents

2. **Validation**
   - Use specific regex patterns for structured data
   - Include format validation for critical fields
   - Set appropriate default values

3. **Performance**
   - Limit the number of label texts per attribute
   - Use exact matching when possible
   - Balance flexibility with processing speed

4. **Maintenance**
   - Document mapping configurations
   - Review and update patterns regularly
   - Monitor matching success rates

## API Reference

For complete API documentation, see [Mapping API Reference](/docs/api-reference/add-mapping).