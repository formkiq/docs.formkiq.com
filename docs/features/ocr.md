---
sidebar_position: 15
title: Optical Character Recognition (OCR)
---

# Optical Character Recognition (OCR)

## Overview

Optical Character Recognition (OCR) extracts text and structured data from images, scanned PDFs, and other supported document formats. In FormKiQ, OCR is usually run as a document action, workflow step, or part of an intelligent document processing flow.

OCR output can support:

- Full-text search
- Text extraction from scanned documents
- Key-value extraction from forms
- Table extraction
- Textract query-based extraction
- Metadata mapping into document attributes
- Workflow routing and downstream automation

## Where OCR Fits

OCR is one part of the document processing pipeline.

| Step | What happens |
| --- | --- |
| 1. Document is added | A document is uploaded, imported, or referenced. |
| 2. OCR action runs | FormKiQ extracts text or structured data using Tesseract or Amazon Textract. |
| 3. OCR result is stored | OCR text, tables, key-values, status, and output files can be retrieved through the API. |
| 4. Mappings can run | Extracted OCR output can be mapped into document attributes. |
| 5. Search and workflows use the output | OCR text can be indexed, and mapped attributes can drive rules, workflows, reporting, or access patterns. |

For mappings, see [Mappings](/docs/features/mappings). For document processing actions, see [Documents](/docs/features/documents#document-actions).

## OCR Providers

FormKiQ supports Tesseract and Amazon Textract.

| Provider | Best for | Availability |
| --- | --- | --- |
| Tesseract | Basic text extraction, simple scanned documents, lower-cost OCR processing. | Available in FormKiQ Core and all editions. |
| Amazon Textract | Higher-accuracy extraction, forms, tables, key-values, handwriting, and queries. | Available with Explore, commercial deployments, and optional OCR/IDP modules. |

### Tesseract

Tesseract is an open-source OCR engine. It is useful for straightforward text extraction when you do not need advanced form, table, or key-value analysis.

Use Tesseract when:

- You need basic OCR for scanned documents.
- Cost sensitivity matters more than advanced extraction.
- Documents are relatively clean and simple.
- You only need text output for search or review.

### Amazon Textract

Amazon Textract is an AWS machine learning service for OCR and document analysis. It is better suited to structured and semi-structured documents.

Use Textract when:

- You need forms or key-value extraction.
- You need table extraction.
- You need query-based extraction.
- You need better handling of complex layouts.
- You are processing invoices, forms, records, or other structured business documents.

For advanced processing, see [Enhanced Document OCR and Classification](/docs/formkiq-modules/modules/enhanced-document-ocr-and-classification).

## Supported Inputs and Outputs

Supported input formats depend on the engine, document conversion path, installed modules, and AWS service support in the target region.

Common OCR inputs include:

- PDF
- JPEG
- PNG
- TIFF
- Scanned image files
- Office documents when conversion support is available in the deployment

Common OCR outputs include:

| Output | Description |
| --- | --- |
| Text | Extracted text from the document. |
| Key-values | Label/value pairs from forms or structured documents. |
| Tables | Extracted table rows and cells. |
| CSV | Table output exported to CSV when configured. |
| Content URLs | Presigned URLs for OCR output files. |
| OCR status | Processing state such as requested, successful, failed, or skipped. |

Confirm supported formats and module behavior for your deployment before relying on OCR for production ingestion.

## OCR Action Parameters

OCR is commonly configured through document action parameters.

```json
{
  "type": "OCR",
  "parameters": {
    "ocrEngine": "TEXTRACT",
    "ocrParseTypes": "TEXT,TABLES",
    "ocrOutputType": "CSV",
    "ocrNumberOfPages": "10",
    "addPdfDetectedCharactersAsText": "true"
  }
}
```

| Parameter | Description | Notes |
| --- | --- | --- |
| `ocrEngine` | OCR engine to use. | `TESSERACT` or `TEXTRACT`. |
| `ocrParseTypes` | Types of data to extract. | `TEXT`, `FORMS`, `TABLES`, `QUERIES`. |
| `ocrTextractQueries` | Questions to ask Textract when using `QUERIES`. | Required when `ocrParseTypes` includes `QUERIES`. |
| `ocrOutputType` | Output conversion for supported results. | `CSV` is used for Textract table output. |
| `ocrNumberOfPages` | Number of pages to OCR from the start of the document. | `-1` processes all pages. |
| `addPdfDetectedCharactersAsText` | Rewrites PDF image text into searchable text where supported. | Useful for scanned PDFs. |

Use the generated API reference for exact request shape and supported values.

## Textract Parse Types

Amazon Textract can extract different kinds of information depending on the parse type.

| Parse type | Extracts | Use for |
| --- | --- | --- |
| `TEXT` | Lines and words. | Searchable text, basic extraction, downstream full-text indexing. |
| `FORMS` | Key-value pairs. | Invoices, applications, forms, and structured records. |
| `TABLES` | Table structure and cell values. | Statements, reports, tabular forms, and CSV export. |
| `QUERIES` | Answers to configured questions. | Targeted extraction when field labels vary or documents are less structured. |

When using `QUERIES`, provide `ocrTextractQueries` with the questions Textract should answer.

## OCR Results

OCR results can be retrieved from the document OCR API after processing completes.

Result data can include:

- Extracted text
- Key-value pairs
- Tables
- Output content URLs
- OCR engine used
- OCR status
- User ID
- Document ID
- Inserted date

The OCR status is useful for monitoring and retry workflows. Failed OCR actions should be surfaced in operational reports or queues so they can be retried or reviewed.

For endpoint details, see [Get document OCR content](/docs/api-reference/get-document-ocr).

## OCR with Mappings and Search

OCR output becomes more useful when combined with mappings and search.

| Feature | How OCR output is used |
| --- | --- |
| Mappings | Turns OCR text or key-value output into document attributes such as `invoiceNumber`, `vendorName`, or `documentDate`. |
| Full-text search | Indexes extracted text so scanned documents can be searched. |
| Workflows | Routes documents based on mapped OCR values or processing status. |
| Rulesets | Runs conditional automation after OCR or attribute extraction. |
| Reporting | Tracks OCR volume, failures, extracted fields, and processing trends. |

For related details, see [Mappings](/docs/features/mappings), [Search](/docs/features/search), [Rulesets](/docs/features/rulesets), and [Workflows](/docs/features/workflows).

## Common Use Cases

### Searchable Scanned Documents

Run OCR on scanned PDFs or images so users can search for text that was previously locked inside image content.

### Invoice and Form Processing

Use Textract forms, tables, or queries to extract invoice numbers, vendors, totals, dates, line items, and other structured fields.

### Metadata Extraction

Use OCR with mappings to populate document attributes used by search, reporting, workflows, and compliance processes.

### Table Extraction

Use Textract table extraction and optional CSV output for statements, reports, forms, or documents with tabular data.

### Workflow Automation

Trigger workflows after OCR completes, or route documents based on attributes populated from OCR output.

## Best Practices

### Choose the Right Engine

Use Tesseract for basic text extraction. Use Textract when document structure matters, especially forms, tables, handwriting, or query-based extraction.

### Prepare Documents for OCR

OCR quality depends heavily on source quality.

Recommended practices:

- Use clean scans.
- Use 300 DPI where possible.
- Avoid skewed or rotated pages.
- Remove unnecessary backgrounds.
- Prefer high-contrast images.
- Test with real production samples.

### Limit Page Volume When Appropriate

Use `ocrNumberOfPages` when only the first few pages matter. This can reduce cost and processing time for long documents.

### Use Specific Parse Types

Only request the parse types you need. For example, use `TEXT` for searchable text, add `FORMS` for key-values, and add `TABLES` only when table extraction is needed.

### Monitor Failures

Track OCR action status and failed OCR requests. Failed actions may indicate unsupported file types, poor image quality, missing module configuration, regional AWS service issues, or document conversion problems.

### Plan for Cost

OCR cost depends on page count, engine, parsing method, retries, and document volume. Textract-based processing should be estimated separately from core storage and API usage.

For cost guidance, see [Costs and AWS Usage](/docs/platform/costs#ocr-processing).

## API Operations

Use the generated API reference for exact request and response schemas.

| Operation | Purpose | API reference |
| --- | --- | --- |
| Add OCR action | Run OCR as a document action. | [`POST /documents/{documentId}/actions`](/docs/api-reference/add-document-actions) |
| Perform document OCR | Request OCR directly for a document. | [`POST /documents/{documentId}/ocr`](/docs/api-reference/add-document-ocr) |
| Get OCR result | Retrieve OCR text, tables, key-values, status, or output URLs. | [`GET /documents/{documentId}/ocr`](/docs/api-reference/get-document-ocr) |
| Set OCR result | Set OCR result data for a document. | [`PUT /documents/{documentId}/ocr`](/docs/api-reference/set-document-ocr) |
| Delete OCR result | Delete OCR result data for a document. | [`DELETE /documents/{documentId}/ocr`](/docs/api-reference/delete-document-ocr) |
| Add workflow | Configure OCR as part of a workflow. | [`POST /workflows`](/docs/api-reference/add-workflow) |
| Set workflow | Update workflow OCR action configuration. | [`PUT /workflows/{workflowId}`](/docs/api-reference/set-workflow) |
| Get configuration | Review site OCR configuration limits. | [`GET /sites/{siteId}/configuration`](/docs/api-reference/get-configuration) |
| Update configuration | Update site OCR configuration limits. | [`PATCH /sites/{siteId}/configuration`](/docs/api-reference/update-configuration) |

## Where to Go Next

- [Documents](/docs/features/documents)
- [Mappings](/docs/features/mappings)
- [Search](/docs/features/search)
- [Rulesets](/docs/features/rulesets)
- [Workflows](/docs/features/workflows)
- [Enhanced Document OCR and Classification](/docs/formkiq-modules/modules/enhanced-document-ocr-and-classification)
- [Costs and AWS Usage](/docs/platform/costs#ocr-processing)
