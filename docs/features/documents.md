---
sidebar_position: 5
---

# Documents

At the heart of the FormKiQ document management platform lies a sophisticated framework that seamlessly integrates storing, retrieving, and organizing documents. Our platform's robust storage capabilities ensure documents are securely housed and easily retrievable, leveraging cutting-edge technologies like Amazon S3 to guarantee data integrity and scalability. 

Documents can be organized in a way that mirrors their workflow, projects, or departments. This intuitive hierarchy ensures efficient navigation, as documents are logically grouped for swift access. Users can effortlessly retrieve specific files by browsing through familiar folder paths or by utilizing powerful search functionalities. This combination of advanced storage solutions and user-centric organization not only streamlines document management but also enhances collaboration and knowledge sharing across teams. Our platform transforms document handling into a seamless and structured process, offering a comprehensive solution for businesses seeking to optimize their document management practices.

[See full API documentation here](/docs/api-reference/add-document)

## Document Metadata

Metadata refers to additional information associated with a document that describes its properties. FormKiQ supports several different types of metadata.

### Standard Metadata

Standard document metadata: common metadata such as the path/filename, content type, checksum, and filesize, and one use-specific property, deepLinkPath, enabling an external document’s metadata to be included within FormKiQ while the file object itself is stored in another system.

### Extended Metadata

Document metadata is custom data that can be directly attach to a document. By embedding metadata within the document, users ensure that essential information remains intact and travels alongside the document, enhancing its context and discoverability.

When using document versioning, as documents evolve and new versions are created, the platform retains a historical record of metadata changes, providing a comprehensive history of the document's attributes across iterations. This powerful feature allows for the fosters accurate tracking and auditing for document controls.

Unlike a document tag (which is unversioned), metadata can only be searched when using one of FormKiQ's full-text solutions. Each document only support up to 25 Metadata entries.

:::note
Each document only support up to 25 Metadata entries.
:::

## Document Attributes

FormKiQ's document management platform revolutionizes the way documents are organized and retrieved by offering a robust document organizing capability through document attributes.

see [Attributes](/docs/features/attributes) for more details.

The Document Attribute feature is a powerful tool that enables users to add, categorize, and search document-specific metadata within the platform. By defining and applying attributes, users can efficiently classify documents, making retrieval faster and more accurate. This feature supports customized document management workflows and enhances the searchability and classification of documents through the use of structured metadata.

[See full API documentation here](/docs/api-reference/get-document-attributes)

### Key Features

1. **Customizable Document Attributes**
Users can define and assign specific attributes to each document. These attributes may include document type, author, creation date, department, confidentiality level, and more. By enabling tailored metadata, this feature supports various document management needs across different industries.

2. **Searchable Attributes**
Document attributes are searchable, allowing users to quickly locate documents based on specific metadata. The platform’s search functionality leverages these attributes to deliver highly accurate results, saving time and reducing search effort.

3. **Schema-based Classification**
Utilizing SiteSchema, document attributes can be organized into predefined classifications. This schema-based organization allows for consistency across documents and makes it easier to enforce organizational standards for document handling.

4. **Dynamic Document Classification**
Documents can be automatically or manually classified based on their attributes. This dynamic classification improves the accuracy of document categorization and simplifies document retrieval.

### Relationships

The Document Relationship feature enables users to create logical links between documents in the document management platform. This feature is essential for connecting related documents, such as different versions, attachments, or supplemental materials, allowing users to access a full range of associated information directly from any given document. By establishing these relationships, the platform enhances document organization and provides context to better understand how documents relate to each other.

#### Document Relationship Types

The platform supports several types of document relationships. Each type defines a specific relationship structure between documents and helps users understand the nature of their connections. Here are the available relationship types:

1.  **PRIMARY**
The main document to which other documents are attached or associated. This document serves as the principal source or version, with other documents complementing it.
  2.  **ATTACHMENT**
A document that is attached to the primary document. Attachments are usually supplementary files, like reference materials, exhibits, or related forms, that support the primary document.
  3.  **APPENDIX**
A document that serves as an appendix to the primary document. Appendices typically include additional data, reference tables, or supplementary details that provide further insights into the primary document.
  4.  **SUPPLEMENT**
A document that provides supplemental information to the primary document. Unlike attachments, supplements are often standalone documents that offer extended or detailed information directly related to the primary document’s content.
  5.  **ASSOCIATED**
A document that is associated with another document without a strict hierarchical relationship. This type of relationship is suitable for linking documents that share a connection, such as similar topics, projects, or case files, without one being subordinate to the other.
  6.  **RENDITION**
A version or rendition of a document that represents the same content in a different format or language. For example, a PDF version of a Word document or an English translation of a document in another language. Renditions allow users to see alternative representations of the original document.

### API Examples

#### Add Document Attribute Request

**Endpoint:** /documents/:documentId/attributes

**Method:** POST

Summary: Adds one or more attributes to a document. Supports different attribute types, including standard attributes, classifications, and relationships.

**Add Attribute(s)**

```
{
  "attributes": [
    {
      "key": "Department",
      "stringValue": "Human Resources"
    },
    {
      "key": "ReviewDate",
      "stringValue": "2024-06-01"
    },
    {
      "classificationId": "confidential"
    },
    {
      "documentId": "56789",
      "relationship": "ATTACHMENT",
      "inverseRelationship": "PRIMARY"
    }
  ]
}
```

## Tags (Replace by Attributes)

FormKiQ's tagging feature, documents can be meticulously labeled using a variety of options: 

* a standalone key for broad categorization
* a key paired with a value for detailed classification
* or a key associated with multiple values for comprehensive tagging. 

This flexibility empowers users to tailor their tagging approach according to their specific needs, enhancing document discovery and navigation. Through tags, documents become rich with context, allowing users to quickly identify relevant materials and establish meaningful connections between files. Whether it's a simple keyword, an intricate set of attributes, or a combination of both, our platform's tagging functionality ensures documents are intelligently categorized and readily accessible, fostering a dynamic and user-centric document management experience.

[See full API documentation here](/docs/api-reference/get-document-tags)

## Document Actions

The FormKiQ document management platform offers a dynamic and customizable approach to document processing through a comprehensive set of document actions. With the platform, users can seamlessly chain together multiple actions, creating powerful workflows that enhance document processing efficiency. 

[See full API documentation here](/docs/api-reference/get-document-actions)

The supported document actions are listed below:

:::note
Actions are indicated which edition of FormKiQ they are supported in.
:::

### ANTIVIRUS

Scans the document using [ClamAv](https://www.clamav.net) for detecting trojans, viruses, malware & other malicious threats. Documents are automatically flagged with the scan result.

:::note
Available as an Add-On Module
:::

### DOCUMENTTAGGING

Intelligent document tagging for accurate categorization of documents using artificial intelligence.

- **Parameters:**
  - **engine**: The tagging engine to use. Supported value: `chatgpt`
  - **tags**: Comma-delimited list of keywords for tagging. Example: `author,title,description`

:::note
Available as an Add-On Module
:::

### EVENTBRIDGE

The **EVENTBRIDGE** document action allows seamless integration with AWS EventBridge. When triggered, this action sends the document and associated metadata as an event to EventBridge, enabling further processing, automation, or integration with downstream AWS services.

This feature is ideal for building event-driven architectures where documents are a key part of your workflows.

#### Example Payload

When a document action is triggered, the following JSON payload is sent to the configured EventBridge event bus:

```json
{
  "siteId": "string",
  "path": "string",
  "deepLinkPath": "string",
  "insertedDate": "string",
  "lastModifiedDate": "string",
  "checksum": "string",
  "checksumType": "SHA1",
  "documentId": "string",
  "contentType": "string",
  "userId": "string",
  "contentLength": 0,
  "versionId": "string",
  "metadata": [
    {
      "key": "string",
      "value": "string",
      "values": [
        "string"
      ]
    }
  ],
  "attributes":[{
    "key":"string",
    "stringValue":"string",
    "stringValues":[],
    "numberValue":"numeric",
    "numberValues":[]
  }],
  "url":"S3 Presigned Url"
}
```

### FULLTEXT

Extracts full text from documents for indexing and search purposes.

- **Parameters:**
  - **characterMax**: Maximum number of characters to add to Fulltext destination. Example: `-1` for no limit

:::note
[Typesense](https://typesense.org) is Supported in FormKiQ Core

[OpenSearch](https://aws.amazon.com/opensearch-service/) is available as an Add-On Module
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

[Amazon Textract](https://aws.amazon.com/textract/) is Available as an Add-On Module
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


FormKiQ handling of document versions is designed to efficiently manage and track multiple iterations of documents throughout their lifecycle. This system ensures that every modification made to a document is recorded and saved as a new version, maintaining a comprehensive history of changes. 

Users can access previous versions, compare changes, and restore earlier iterations if necessary, providing a robust audit trail and enhancing collaboration.

[See full API documentation here](/docs/api-reference/get-document-versions)

:::note
Available as an Add-On Module
:::

## Document User Activities

FormKiQ tracks user's document activities and logs all interactions users have with documents within the system. This includes actions such as viewing, editing, sharing, and deleting documents. By maintaining detailed activity logs, FormKiQ ensures transparency and accountability, allowing administrators to ensure security and compliance with any regulatory requirements.

[See full API documentation here](/docs/api-reference/get-user-activities)

:::note
Available as an Add-On Module
:::