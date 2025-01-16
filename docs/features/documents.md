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
    "numberValue":"numeric",
    "numberValues":[]
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