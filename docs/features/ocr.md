---
sidebar_position: 15
---

# Optical Character Recognition (OCR)

## Overview

FormKiQ's Optical Character Recognition (OCR) capabilities transform images and scanned documents into searchable, editable text. This feature enhances document accessibility and enables powerful search functionality across your document repository.

## OCR Providers

FormKiQ supports two powerful OCR solutions:

### Amazon Textract
- Advanced ML-powered OCR service
- Handles complex document formats
- Available in FormKiQ Essentials, Advanced, and Enterprise editions
- Supports automated form field extraction
- Handles tables and structured data
- Processes handwritten text

### Tesseract OCR
- Open-source OCR engine by Google
- Available in all FormKiQ editions, including Core
- Ideal for basic text extraction
- Supports multiple languages
- Lightweight and efficient

## Supported Document Types

| Feature | Tesseract | Amazon Textract |
|---------|-----------|-----------------|
| PDF | ✓ | ✓ |
| JPEG | ✓ | ✓ |
| TIFF | ✓ | ✓ |
| PNG | ✓ | ✓ |
| GIF | ✓ | |
| WEBP | ✓ | |
| BMP | ✓ | |
| DOC | ✓ | |
| DOCX | ✓ | |
| XLS | ✓ | |
| XLSX | ✓ | |

## OCR Configuration

### Document Action Parameters
```json
{
  "ocrEngine": "tesseract|textract",
  "ocrParseTypes": ["TEXT", "FORMS", "TABLES"],
  "ocrExportToCsv": true,
  "ocrNumberOfPages": -1,
  "addPdfDetectedCharactersAsText": true
}
```

### Parameter Details

| Parameter | Description | Default | Notes |
|-----------|-------------|---------|--------|
| ocrEngine | OCR provider to use | tesseract | Choose between 'tesseract' or 'textract' |
| ocrParseTypes | Types of content to extract | ["TEXT"] | Options: TEXT, FORMS, TABLES |
| ocrExportToCsv | Export table data to CSV | false | Only applicable for textract table extraction |
| ocrNumberOfPages | Number of pages to process | -1 | -1 processes all pages |
| addPdfDetectedCharactersAsText | Convert PDF image text | false | Enhances PDF processing |

## Features by Provider

### Tesseract Features
- Basic text extraction
- Multi-language support
- Page segmentation
- Character recognition
- PDF text layer generation

### Amazon Textract Features
- Advanced text extraction
- Form field detection
- Table structure recognition
- Key-value pair identification
- Handwriting recognition
- Document layout analysis

## Best Practices

1. **Document Preparation**
   - Ensure good image quality
   - Use appropriate resolution (300 DPI recommended)
   - Properly align documents
   - Remove unnecessary backgrounds

2. **Provider Selection**
   - Use Textract for complex documents
   - Choose Tesseract for basic text extraction
   - Consider volume requirements
   - Evaluate accuracy needs

3. **Performance Optimization**
   - Process appropriate page ranges
   - Use specific parse types
   - Enable CSV export only when needed
   - Configure appropriate timeout values

4. **Error Handling**
   - Implement retry mechanisms
   - Monitor OCR quality
   - Validate output format
   - Handle failed conversions

## Common Use Cases

1. **Document Digitization**
   - Convert paper documents to searchable PDFs
   - Extract text from scanned images
   - Create searchable document archives

2. **Form Processing**
   - Extract form fields automatically
   - Process structured documents
   - Validate form data

3. **Data Extraction**
   - Pull information from tables
   - Extract key-value pairs
   - Process invoice data

4. **Content Search**
   - Enable full-text search
   - Index document content
   - Improve document discovery

## API Integration

```json
// Example: Configure OCR Document Action
POST /documents/{documentId}/actions
{
  "action": "OCR",
  "parameters": {
    "ocrEngine": "textract",
    "ocrParseTypes": ["TEXT", "TABLES"],
    "ocrExportToCsv": true,
    "ocrNumberOfPages": 10
  }
}
```

For complete API documentation, see [Document Actions API Reference](/docs/api-reference/get-document-actions).