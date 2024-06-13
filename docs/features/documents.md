---
sidebar_position: 1
---

# Documents

```
API Endpoint: /documents
```

At the heart of the FormKiQ document management platform lies a sophisticated framework that seamlessly integrates storing, retrieving, and organizing documents. Our platform's robust storage capabilities ensure documents are securely housed and easily retrievable, leveraging cutting-edge technologies like Amazon S3 to guarantee data integrity and scalability. 

Documents can be organized in a way that mirrors their workflow, projects, or departments. This intuitive hierarchy ensures efficient navigation, as documents are logically grouped for swift access. Users can effortlessly retrieve specific files by browsing through familiar folder paths or by utilizing powerful search functionalities. This combination of advanced storage solutions and user-centric organization not only streamlines document management but also enhances collaboration and knowledge sharing across teams. Our platform transforms document handling into a seamless and structured process, offering a comprehensive solution for businesses seeking to optimize their document management practices.

## Metadata

FormKiQ has several types of metadata currently, separated into different resources:

### Standard

Standard document metadata: common metadata such as the path/filename, content type, checksum, and filesize, and one use-specific property, deepLinkPath, enabling an external document’s metadata to be included within FormKiQ while the file object itself is stored in another system.

### Attributes

```
API Endpoint: /documents/{documentId}/attributes
```

FormKiQ's document management platform revolutionizes the way documents are organized and retrieved by offering a robust document organizing capability through document attributes.

see [Attributes](/docs/features/attributes) for more details.

### Tags (Replace by Attributes)

```
API Endpoint: /documents/{documentId}/tags
```

FormKiQ's tagging feature, documents can be meticulously labeled using a variety of options: 

* a standalone key for broad categorization
* a key paired with a value for detailed classification
* or a key associated with multiple values for comprehensive tagging. 

This flexibility empowers users to tailor their tagging approach according to their specific needs, enhancing document discovery and navigation. Through tags, documents become rich with context, allowing users to quickly identify relevant materials and establish meaningful connections between files. Whether it's a simple keyword, an intricate set of attributes, or a combination of both, our platform's tagging functionality ensures documents are intelligently categorized and readily accessible, fostering a dynamic and user-centric document management experience.

### Document Metadata

Document metadata is custom data that can be directly attach to a document. By embedding metadata within the document, users ensure that essential information remains intact and travels alongside the document, enhancing its context and discoverability.

When using document versioning, as documents evolve and new versions are created, the platform retains a historical record of metadata changes, providing a comprehensive history of the document's attributes across iterations. This powerful feature allows for the fosters accurate tracking and auditing for document controls.

Unlike a document tag (which is unversioned), metadata can only be searched when using one of FormKiQ's full-text solutions. Each document only support up to 25 Metadata entries.

:::note
Each document only support up to 25 Metadata entries.
:::

## Document Actions

```
API Endpoint: /documents/{documentId}/actions
```

The FormKiQ document management platform offers a dynamic and customizable approach to document processing through a comprehensive set of document actions. With the platform, users can seamlessly chain together multiple actions, creating powerful workflows that enhance document processing efficiency. 

The supported document actions are listed below:

:::note
Actions are indicated which edition of FormKiQ they are supported in.
:::


### ANTIVIRUS

Scans the document using [ClamAv](https://www.clamav.net) for detecting trojans, viruses, malware & other malicious threats. Documents are automatically flagged with the scan result.

:::note
Supported in FormKiQ PRO / Enterprise
:::

### DOCUMENTTAGGING

Intelligent document tagging for accurate categorization of documents using artificial intelligence.

- **Parameters:**
  - **engine**: The tagging engine to use. Supported value: `chatgpt`
  - **tags**: Comma-delimited list of keywords for tagging. Example: `author,title,description`

:::note
Supported in FormKiQ Core / PRO / Enterprise
:::

### FULLTEXT

Extracts full text from documents for indexing and search purposes.

- **Parameters:**
  - **characterMax**: Maximum number of characters to add to Fulltext destination. Example: `-1` for no limit

:::note
[Typesense](https://typesense.org) is Supported in FormKiQ Core

[OpenSearch](https://aws.amazon.com/opensearch-service/) is Supported in FormKiQ PRO / Enterprise
:::

### NOTIFICATION

Sends notifications about document status or actions performed on a document.

- **Parameters:**
  - **notificationType**: Type of notification. Supported value: `email`
  - **notificationToCc**: Carbon Copy recipient(s). Example: `cc@yourdomain.com`
  - **notificationToBcc**: Blind Carbon Copy recipient(s). Example: `bcc@yourdomain.com`
  - **notificationSubject**: Subject of the notification email. Example: `Email Subject`
  - **notificationText**: Text content of the notification email. Example: `Email Text`
  - **notificationHtml**: HTML content of the notification email. Example: `Email HTML Text`

:::note
Supported in FormKiQ Core / PRO / Enterprise
:::

### Optical Character Recognition (OCR)

Optical Character Recognition (OCR) action to convert images and PDFs to text.

- **Parameters:**
  - **ocrParseTypes**: OCR parsing strategy. Supported values: `TEXT`, `FORMS`, `TABLES`
  - **ocrEngine**: OCR engine to use. Supported values: `tesseract`, `textract`
  - **ocrExportToCsv**: Convert OCR result to CSV (applicable to `textract` table only). Example: `true`
  - **ocrNumberOfPages**: Number of pages to OCR (from start). Example: `-1` for all pages
  - **addPdfDetectedCharactersAsText**: Convert detected characters in PDF images to text. Supported values: `true`, `false`

See [OCR Feature](/docs/features/ocr) for more details about this feature.

:::note
[Tesseract](https://github.com/tesseract-ocr/tesseract) is Supported in FormKiQ Core

[Amazon Textract](https://aws.amazon.com/textract/) is Supported in FormKiQ PRO / Enterprise
:::

### QUEUE

Manages document workflows by placing documents in specific queues. Queues can be used for an approval workflow step. 

- **Parameters:**
  - **queueId**: ID of the queue. Example: `queue1`

### WEBHOOK
Allows integration with external systems via HTTP callbacks.

- **Parameters:**
  - **url**: Webhook URL to send the callback to. Example: `https://yourdomain.com/webhook-endpoint`

### Intelligent Document Processing (IDP)

Intelligent Document Processing allows for the extract of data from documents and attaching values using Document Attributes.

- **Parameters:**
  - **mappingId**: ID of the mapping in the Identity Provider. Example: `mapping1`


## Document Versions

```
API Endpoint: /documents/{documentId}/actions
```

FormKiQ handling of document versions is designed to efficiently manage and track multiple iterations of documents throughout their lifecycle. This system ensures that every modification made to a document is recorded and saved as a new version, maintaining a comprehensive history of changes. 

Users can access previous versions, compare changes, and restore earlier iterations if necessary, providing a robust audit trail and enhancing collaboration.

:::note
only supported in FormKiQ PRO / Enterprise
:::

## Document User Activities

```
API Endpoint: /documents/{documentId}/userActivities
```

FormKiQ tracks user's document activities and logs all interactions users have with documents within the system. This includes actions such as viewing, editing, sharing, and deleting documents. By maintaining detailed activity logs, FormKiQ ensures transparency and accountability, allowing administrators to ensure security and compliance with any regulatory requirements.

:::note
only supported in FormKiQ PRO / Enterprise
:::