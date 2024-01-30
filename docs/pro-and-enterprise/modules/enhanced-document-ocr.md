---
sidebar_position: 1
---

# Enhanced Document OCR using Textract

![FormKiQ OCR Architecture](./img/architecture_formkiq_and_ocr.png)

✅ Use Amazon Textract to extract text and structured table or form data from documents

Enhanced Document OCR is a FormKiQ Module that provides enhanced optical character recognition (OCR) for the extraction of text and structured table or form data from documents. While FormKiQ uses Tesseract by default to process images and PDFs, this module uses [Amazon Textract](https://aws.amazon.com/textract) and enables additional functionality, such as extracting table data, form data, and adding a searchable text layer to non-searchable PDFs.

## Use Case

* If you would like to add metadata for document retrieval, this module can provide that metadata from scanned documents; you can then create tags (in the case of form or table data) or enable the entire OCR result to be searched using the Fulltext Search module
