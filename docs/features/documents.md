---
sidebar_position: 5
---

# Documents

## Overview

At the heart of the FormKiQ document management platform lies a sophisticated framework that seamlessly integrates storing, retrieving, and organizing documents. Built on Amazon S3, our platform's robust storage capabilities ensure documents are securely housed and easily retrievable, guaranteeing data integrity and scalability.

Documents can be organized in a way that mirrors their workflow, projects, or departments. This intuitive hierarchy ensures efficient navigation, as documents are logically grouped for swift access. Users can effortlessly retrieve specific files by browsing through familiar folder paths or by utilizing powerful search functionalities. This combination of advanced storage solutions and user-centric organization not only streamlines document management but also enhances collaboration and knowledge sharing across teams.

[See full API documentation here](/docs/api-reference/add-document)

## Core Components

### Document Metadata

FormKiQ supports two types of metadata for maximum flexibility:

#### Standard Metadata
Essential document properties tracked automatically:
- Path/filename
- Content type
- Checksum
- File size
- Deep link path (enabling an external document's metadata to be included within FormKiQ while the file object itself is stored in another system)

#### Extended Metadata
Custom data directly attached to documents:
- Supports up to 25 metadata entries per document
- Versioned with document changes
- Enables comprehensive audit trails
- Searchable through full-text solutions

When using document versioning, as documents evolve and new versions are created, the platform retains a historical record of metadata changes, providing a comprehensive history of the document's attributes across iterations. This powerful feature allows for accurate tracking and auditing for document controls.

:::note
Each document only supports up to 25 Metadata entries.
:::

### Document Attributes

FormKiQ's document management platform revolutionizes document organization through powerful document attributes that enable:
- Custom classification schemes
- Advanced search functionality
- Workflow automation
- Access control

[See full API documentation here](/docs/api-reference/get-document-attributes)
[Learn more about Attributes](/docs/features/attributes)

#### Key Features

1. **Customizable Document Attributes**
Users can define and assign specific attributes to each document. These attributes may include document type, author, creation date, department, confidentiality level, and more. By enabling tailored metadata, this feature supports various document management needs across different industries.

2. **Searchable Attributes**
Document attributes are searchable, allowing users to quickly locate documents based on specific metadata. The platform's search functionality leverages these attributes to deliver highly accurate results, saving time and reducing search effort.

3. **Schema-based Classification**
Utilizing SiteSchema, document attributes can be organized into predefined classifications. This schema-based organization allows for consistency across documents and makes it easier to enforce organizational standards for document handling.

4. **Dynamic Document Classification**
Documents can be automatically or manually classified based on their attributes. This dynamic classification improves the accuracy of document categorization and simplifies document retrieval.

### Document Relationships

The Document Relationship feature enables users to create logical links between documents, essential for connecting related files and providing context for how documents relate to each other.

#### Relationship Types:
1. **PRIMARY**: Main document serving as the principal source
2. **ATTACHMENT**: Supporting files linked to primary documents
3. **APPENDIX**: Additional reference materials
4. **SUPPLEMENT**: Standalone supplementary information
5. **ASSOCIATED**: Documents with non-hierarchical connections
6. **RENDITION**: Alternative formats or translations
7. **TEMPLATE**: Templates, such as those used in document generation
8. **DATASOURCE**: Datasources, such as those used in document generation

## Document Management Features

### Document Actions

FormKiQ supports various automated actions for document processing:

| Action | Description | Edition |
|--------|-------------|----------|
| ANTIVIRUS | Malware scanning using ClamAV | Essentials/Advanced/Enterprise |
| DOCUMENTTAGGING | AI-powered document categorization | Core |
| EVENTBRIDGE | AWS EventBridge integration | Core |
| FULLTEXT | Text extraction and indexing | Core + Add-On Options |
| IDP | Intelligent Document Processing | Essentials/Advanced/Enterprise + Add-On Options |
| NOTIFICATION | Email notifications | Core |
| OCR | Text extraction from images/PDFs | Core + Add-On Options |
| PUBLISH | Publication of approved documents | Essentials/Advanced/Enterprise |
| QUEUE | Workflow management | Essentials/Advanced/Enterprise |
| WEBHOOK | External system integration | Core |

#### ANTIVIRUS
Scans documents using [ClamAv](https://www.clamav.net) for detecting trojans, viruses, malware & other malicious threats.

:::note
Available as an Add-On Module
:::

#### DOCUMENTTAGGING
Intelligent document tagging using artificial intelligence.

- **Parameters:**
  - **engine**: The tagging engine to use. Supported value: `chatgpt`
  - **tags**: Comma-delimited list of keywords for tagging

:::note
Available as an Add-On Module
:::

#### EVENTBRIDGE
Enables AWS EventBridge integration for event-driven architectures. Sends document data and metadata as events for further processing.

Example Payload:
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
      "values": ["string"]
    }
  ],
  "attributes":[{
    "key":"string",
    "stringValue":"string",
    "stringValues":[],
    "numberValue": numeric,
    "numberValues":[],
    "booleanValue": boolean
  }],
  "url":"S3 Presigned Url"
}
```

#### FULLTEXT
Extracts and indexes text content for search capabilities.

- **Parameters:**
  - **characterMax**: Maximum characters to index (-1 for no limit)

:::note
[Typesense](https://typesense.org) is Supported in FormKiQ Core
[OpenSearch](https://aws.amazon.com/opensearch-service/) is available as an Add-On Module
:::

#### NOTIFICATION
Sends email notifications about document events.

- **Parameters:**
  - **notificationType**: Type of notification (email)
  - **notificationToCc**: CC recipients
  - **notificationToBcc**: BCC recipients
  - **notificationSubject**: Email subject
  - **notificationText**: Plain text content
  - **notificationHtml**: HTML content

#### OCR (Optical Character Recognition)
Converts images and PDFs to searchable text.

- **Parameters:**
  - **ocrParseTypes**: TEXT, FORMS, TABLES
  - **ocrEngine**: tesseract, textract
  - **ocrExportToCsv**: Convert tables to CSV
  - **ocrNumberOfPages**: Pages to process
  - **addPdfDetectedCharactersAsText**: Convert PDF image text

[See OCR Feature documentation](/docs/features/ocr)

:::note
[Tesseract](https://github.com/tesseract-ocr/tesseract) is Supported in FormKiQ Core
[Amazon Textract](https://aws.amazon.com/textract/) is Available as an Add-On Module
:::

#### QUEUE
Manages document workflows and approval processes.

- **Parameters:**
  - **queueId**: Queue identifier

#### WEBHOOK
Enables integration with external systems.

- **Parameters:**
  - **url**: Callback endpoint

#### IDP (Intelligent Document Processing)
Extracts and processes document data using Document Attributes.

- **Parameters:**
  - **mappingId**: Identity Provider mapping ID

### Document Versions

FormKiQ's versioning system (available as an Add-On Module) provides:
- Complete change history
- Version comparison
- Rollback capabilities
- Comprehensive audit trails

[See API documentation](/docs/api-reference/get-document-versions)

### Document User Activities

The platform tracks and logs all document interactions:
- View access
- Modifications
- Sharing events
- Deletion records

[See API documentation](/docs/api-reference/get-user-activities)

:::note
Available as an Add-On Module
:::

## Document Events Features

The Document Event System is a robust mechanism designed to enable real-time, scalable, and decoupled processing of document-related operations, such as creation, metadata updates, and deletions. By leveraging [Amazon EventBridge](https://aws.amazon.com/eventbridge/) (and maintaining support for legacy [Amazon SNS](https://aws.amazon.com/sns/)-based notifications), FormKiQ can easily integrate with various downstream applications and services.

This document outlines the design and implementation of the Document Event System in our Document Management System. The system captures events associated with document operations (such as creation, metadata updates, and deletions) and publishes them to Amazon EventBridge for downstream processing.

### Amazon EventBridge

![Document EventBridge](./img/eventbridge.png)

As of version 1.17.0, each FormKiQ installation comes with its own [Amazon EventBridge](https://aws.amazon.com/eventbridge/) setup to be connected to. FormKiQ publishes document events to Amazon EventBridge automatically. This allows easy integration for:

* Real-time Processing:
EventBridge routes events to subscribed targets for immediate handling.

* Scalability:
Leverages EventBridge’s ability to handle high volumes of events across distributed systems.

* Decoupling:
Separates the event production from consumption, allowing independent scaling and evolution of each component

#### Supported Event Types
 
Each document event uses the DetailType field in the EventBridge Message to distinguish between the different kinds of events. The supported DetailType event types are:

- **CONTENT**  
  - **DetailType:** `Document Create Event`  
  - **Description:** Triggered when a document is created or updated with new content.

- **METADATA**  
  - **DetailType:** `Document Create Metadata`  
  - **Description:** Triggered when metadata is added or updated for a document.

- **DELETE_METADATA**  
  - **DetailType:** `Document Delete Metadata`  
  - **Description:** Triggered when metadata is removed from a document.

- **SOFT_DELETE_METADATA**  
  - **DetailType:** `Document Soft Delete Metadata`  
  - **Description:** Triggered when metadata is soft-deleted (i.e., logically removed) for a document.

#### Event Payload Schema

Each event published to EventBridge follows a consistent JSON schema. The payload structure is as follows:

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
      "values": ["string"]
    }
  ],
  "attributes": [
    {
      "key": "string",
      "stringValue": "string",
      "stringValues": [],
      "numberValue": 0,
      "numberValues": [],
      "booleanValue": false
    }
  ],
  "url": "S3 Presigned Url"
}
```

### Amazon SNS (Legacy)

![Document EventBridge](./img/sns.png)

In addition to the current EventBridge-based event system, FormKiQ supports an event notification mechanism that utilizes Amazon SNS. From verion 1.17.0 onward, this legacy system is maintained for backward compatibility with systems that have not yet migrated to the new EventBridge-based architecture.


#### Supported Event Types

The following event types are supported, each with a corresponding `DetailType` used in Amazon EventBridge:

- **CONTENT**  
  - **DetailType:** `Document Create Event`  
  - **Description:** Triggered when a document is created or updated with new content.

- **DELETE_METADATA**  
  - **DetailType:** `Document Delete Metadata`  
  - **Description:** Triggered when metadata is removed from a document.

- **SOFT_DELETE_METADATA**  
  - **DetailType:** `Document Soft Delete Metadata`  
  - **Description:** Triggered when metadata is soft-deleted (i.e., logically removed) for a document.

#### SNS Subscription Policy Filter

For SNS-based legacy events, subscribers can use a subscription policy filter to receive only the event types they are interested in. The subscription filter inspects an attribute named type in the SNS message attributes. The supported values for this attribute are:
  • create: For document creation or content update events.
  • delete: For document metadata deletion events.
  • softDelete: For document metadata soft deletion events.

Example Policy Filter

To subscribe only to create events, the subscription filter policy can be defined as follows:

```
{
  "type": [
    "create"
  ]
}
```

Subscribers can also adjust the filter to include multiple event types. For example, to receive both delete and softDelete events:

```
{
  "type": [
    "delete",
    "softDelete"
  ]
}
```

#### Event Payload Schema

Each event published to Amazon SNS follows a consistent JSON schema. The payload structure is as follows:

```json
{
  "siteId": "string",
  "path": "string",
  "s3bucket": "string",
  "s3key": "string",
  "type": "string",
  "documentId": "string",
  "content": "string",
  "contentType": "string",
  "userId": "string",
  "url": "S3 Presigned Url"
}
```

## Best Practices

1. **Document Organization**
   - Implement consistent naming conventions
   - Use attributes for classification
   - Establish clear relationship hierarchies
   - Leverage metadata for searchability

2. **Version Control**
   - Enable versioning for critical documents
   - Document version changes
   - Implement approval workflows
   - Regular backup procedures

3. **Security**
   - Configure appropriate access controls
   - Regular security audits
   - Monitor user activities
   - Implement encryption where needed

4. **Performance**
   - Optimize file sizes
   - Use appropriate storage classes
   - Implement caching strategies
   - Monitor system metrics