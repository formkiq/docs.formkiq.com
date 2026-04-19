---
sidebar_position: 8
---

# DynamoDB Schema

[Amazon DynamoDB](https://aws.amazon.com/dynamodb) is a NoSQL database service designed for high-performance, scalable, and low-latency applications.

In a DynamoDB table, the primary key is a fundamental component of the database schema, used to uniquely identify and organize items within a table. The primary key consists of two attributes: the partition key (PK) and the sort key (SK). The partition key is the primary attribute used to distribute data across multiple partitions for scalability.

The table may also include Global Secondary Indexes named using the prefix (GSI) which can be employed to facilitate efficient querying of data based on different attributes.

This page describes the DynamoDB item patterns used by FormKiQ. It is intended for troubleshooting, reporting, migration planning, and architectural review. Application integrations should normally use the FormKiQ APIs instead of reading or writing these tables directly.

## Multi-Tenant

When an entity is stored for a specific `SiteId` other than the `default` site, the format of the `PK` is prefixed with `SiteId/`.

For example: When using a siteId of `finance`, the PK will store a document using `finance/docx#`.

This prefixing pattern keeps data for separate sites logically isolated while still allowing the same table design to support single-site and multi-site deployments. When reviewing records, always confirm whether a key is scoped to the default site or a named site.

## Sites

The following entities define sites and site-level permissions. A site is the primary logical boundary for document access, metadata, and tenant-style partitioning in FormKiQ.

### Sites

The Sites entity stores the site record itself, including display information and lifecycle status. It is used when listing available sites, validating whether a site is active, and enforcing site-scoped behavior across documents and users.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "sites" |
| SK | "sites#" + siteId |
| GSI1PK | "sites" |
| GSI1SK | "sites#" + status + "#" + siteId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| siteId | Site Id |
| title | Site Title |
| status | Site Status (ACTIVE / INACTIVE) |

### Group Permissions

The Group Permissions entity maps a group to the site permissions that group receives. It supports role-based access decisions by connecting identity-group membership to site-level capabilities such as read, write, delete, or administrative behavior.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "sitegroups" |
| SK | "group#" + groupName + "#site#" + siteId |
| GSI1PK | "sitegroups" |
| GSI1SK | "site#" + siteId + "#group#" + groupName |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| groupName | Name of Group |
| siteId | Site Id |
| permissions | List of Group permissions for site |

## Documents

The following entities store document metadata, lifecycle state, processing state, tags, attributes, and document-related module results. Document content is stored in Amazon S3; DynamoDB stores the metadata and indexes required to manage and find that content.

### Document

The Document entity is the primary metadata record for a stored document. It connects the user-facing document identifier to its path, content type, S3 version, checksum information, user ownership, and date fields used for listing and audit-style queries.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "document" |
| SK (artifact) | "document_art#" + ULID |
| GSI1PK | ShortDate(yyyy-MM-ddd) |
| GSI1SK | FullDate("yyyy-MM-dd'T'HH:mm:ssZ") + "#" + documentId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| inserteddate | Inserted Date |
| lastModifiedDate | Last Modified Date |
| userId | Create by user |
| path | Document path |
| deepLinkPath | Document deep link path |
| metadata | Key / Value with Key starting with "md#" |
| contentType | Mime Content Type |
| contentLength | Content Length |
| checksum | Document content checksum |
| checksumType | Document content checksum type |
| s3version | Document Content S3 version |

### Child Document

A Child Document entity represents a relationship between a parent document and a subsidiary or derived document. This pattern is used when one document is associated with another document as part of a larger document set, generated output, extraction result, or related processing flow.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "document#" + childDocumentId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| belongsToDocumentId | Parent Id of document |

### Document (Soft Delete)

A soft-deleted document is moved into a separate key namespace so it no longer appears in normal active-document queries. The record can still retain enough metadata to support deleted-document listings, restore behavior, audit review, and retention workflows.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "softdelete#docs#" |
| SK | "softdelete#document" + documentId |
| GSI1PK | ShortDate(yyyy-MM-ddd) |
| GSI1SK | FullDate("yyyy-MM-dd'T'HH:mm:ssZ") + "#" + documentId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| inserteddate | Inserted Date |
| lastModifiedDate | Last Modified Date |
| userId | Create by user |
| path | Document path |
| deepLinkPath | Document deep link path |
| contentType | Mime Content Type |
| checksum | Document content checksum |
| tagSchemaId | Tag Schema for document |

### Document OCR

The Document OCR entity stores OCR processing metadata for a document. It tracks which OCR engine was used, whether the OCR request succeeded, failed, or was skipped, and any job identifier needed to connect the FormKiQ document record to asynchronous OCR processing results.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "ocr#" |
| SK (artifact) | "ocr_art#" + artifactId + "#" |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| artifactId | Artifact Identifier |
| inserteddate | Inserted Date |
| userId | Create by user |
| contentType | Mime Content Type |
| ocrEngine | Ocr Engine Used (textract, tesseract) |
| ocrStatus | Ocr Status (failed, requested, skipped, successful) |
| jobId | Ocr Job Id |
| ocrOutputType | Ocr Output Type (CSV) |

### Document Actions

Document Actions store queued or completed processing requests for a document. Actions are used for automation such as OCR, full-text extraction, webhooks, notifications, antivirus scanning, ruleset execution, or workflow-related processing.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "action#" + idx + "#" + type |
| SK (artifact) | "action_art#" + artifactId + "#" + idx + "#" + type |
| GSI1PK | "action#" + type + "#" + queueId |
| GSI1SK | "action#" + documentId + "#" + yyyy-MM-dd'T'HH:mm:ssZ |
| GSI1SK (artifact) | "action_art#" + documentId + "#" + artifactId + "#" + yyyy-MM-dd'T'HH:mm:ssZ |
| GSI2PK | "actions#" + status + "#" |
| GSI2SK | "action#" + documentId |
| GSI2SK (artifact) | "action_art#" + documentId + "#" + artifactId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| type | Type of Action |
| status | Status of Action |
| parameters | Parameters for Action |
| metadata | Metadata for Action |
| userId | Create by user |
| inserteddate | Inserted Date |
| startDate | Start Date of action |
| completedDate | Completed Date |
| message | Action message |
| queueId | Queue Id |
| retryCount | action retry count |
| maxRetries | Maximum number of retries |
| workflowId | Workflow Id |
| workflowStepId | Workflow Step Id |
| workflowLastStep | Workflow Last Step |

### Document Sync

Document Sync records track synchronization work between FormKiQ and an external service or module. They provide status, service, type, and message fields so synchronization attempts can be listed, retried, audited, or diagnosed.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "syncs#" + yyyy-MM-dd'T'HH:mm:ssZ |
| GSI1PK | "doc#syncs#" + service + "#" + status + "#" |
| GSI1SK | "sync#" + type + "#" + yyyy-MM-dd'T'HH:mm:ssZ + "#" + documentId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| service | Service synced to |
| syncDate | Sync Date |
| userId | Create by user |
| status | Status of Sync |
| type | Type of data synced |
| message | sync message |


### Document Tag

Document Tag records support legacy key-value metadata for documents. They are indexed so documents can be found by tag key and tag value without scanning all document records.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "tags#" + tagKey |
| SK (artifact) | "tags_art#" + ULID + "#" + tagKey |
| GSI1PK | "tag#" + tagKey + "#" + tagValue |
| GSI1SK | "yyyy-MM-dd'T'HH:mm:ssZ" + "#" + documentId |
| GSI2PK | "tag#" + tagKey |
| GSI2SK | tagValue|

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| type | Type of Tag |
| tagValue | Tag Value |
| userId | Create by user |
| inserteddate | Inserted Date |

### Document Tag (Multi-Value)

Document Tag (Multi-Value) records support tags where a single key can have more than one value. The indexed value pattern allows each value to participate in tag search while preserving the document-level relationship to the original tag key.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "tags#" + tagKey + "#idx" + index |
| SK (artifact) | "tags_art#" + tagKey + "#idx" + index |
| GSI1PK | "tag#" + tagKey + "#" + tagValue |
| GSI1SK | "yyyy-MM-dd'T'HH:mm:ssZ" + "#" + documentId |
| GSI2PK | "tag#" + tagKey |
| GSI2SK | tagValue |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| type | Type of Tag |
| tagValue | Tag Value |
| tagValues | Tag Values |
| userId | Create by user |
| inserteddate | Inserted Date |

### Document Attribute

Document Attribute records store structured metadata values attached to documents. Attributes support typed values and are the preferred metadata model for validation, filtering, workflow decisions, and richer document classification.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "attr#" + key + "#" + value |
| SK (artifact) | "attr_art#" + ULID + "#" + key + "#" + value |
| GSI1PK | "doc#attr#" + key |
| GSI1SK | value |
| GSI2PK | "docs#" + documentId  |
| GSI2SK | "attr#" + valueType + "#" + key |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| key | attribute key |
| index | attribute index |
| valueType | Type of Attribute (string, number, boolean, watermark (GSI2), publication) |
| stringValue | string value |
| numberValue | number value |
| booleanValue | boolean value |

### Document Data Classification Result

Document Data Classification Result records store the output of classification or LLM-assisted classification processing for a document. They preserve the prompt/entity name, generated content, extracted attributes, and audit fields needed to understand when and how classification was produced.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "llmresult#" + TIMESTAMP + "#" + llmPromptEntityName |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| llmPromptEntityName | LLM Prompt Entity Name |
| content | Result from the LLM Prompt |
| attributes | List of Attributes found in the LLM prompt result |
| inserteddate | Inserted Date |
| userId | Create by user |

### Document Metadata Extraction Result

Document Metadata Extraction Result records store extracted metadata produced from document processing. These records make extraction output available for review, later automation, and comparison across multiple extraction runs for the same document.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "mdextractionresult#" + llmPromptEntityName + "#" + TIMESTAMP |
| GSI1PK | "docs#" + documentId |
| GSI1SK | "mdextractionresult#" + TIMESTAMP + "#" + llmPromptEntityName |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| llmPromptEntityName | LLM Prompt Entity Name |
| content | Result from the LLM Prompt |
| attributes | List of Attributes found in the LLM prompt result |
| inserteddate | Inserted Date |
| userId | Create by user |

### Document MalwareScan Result

Document MalwareScan Result records store the outcome of malware or antivirus scanning for a document version. They help determine whether a file was clean, malicious, or failed scanning and preserve the scan engine and S3 version associated with the result.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "malware#result#" + TIMESTAMP + "#" + ID |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| scanStatus | MALICIOUS, ERROR, CLEAN |
| engine | Malware Scan Engine |
| s3version | S3 version id |
| inserteddate | Inserted Date |

### Document Publication

Document Publication records store publication-specific information for documents that are exposed through a publication workflow or public-facing document path. They connect the published path and content type back to the source document and S3 version.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "publication" |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| path | Document Path |
| contentType | Document Content-Type |
| s3Version | Document S3 Version Key |
| documentId | Document Identifier |
| userId | Create by user |

## Resource User Activity

User Activities refers to the tracking and logging of actions performed on document/entities within a system.

These activities typically include operations such as CREATE, VIEW, DELETE, and MODIFY, allowing administrators or users to monitor the lifecycle and interactions with documents. 

This tracking provides visibility into who accessed or altered a document, when the action occurred, and what changes were made. Document Activities are crucial for auditing, security, compliance, and overall document management, ensuring accountability and transparency in document usage.

Resource user activity is broader than document-only activity. It can capture actions against documents, entity types, entities, and other managed resources so administrators can review activity by resource, user, and date.

:::note
These attributes are stored in the "audit" DynamoDB table.
:::

### EntityType Activity Key Schema

EntityType activity keys store audit records for actions performed against entity type definitions. They support lookups by entity type, user, and activity date.

| Attributes | Format |
|------------|---------|
| PK | "entityType#" + entityTypeId |
| SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss + "#" + entityTypeId + "#" + ulid |
| GSI1PK | "activity#user#" + username |
| GSI1SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss + "#" + entityTypeId + "#" + ulid |
| GSI2PK | "activity#" + yyyy-MM-dd |
| GSI2SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss + "#" + entityTypeId + "#" + ulid |

### Entities Activity Key Schema

Entities activity keys store audit records for actions performed against individual entity records. They support entity-level timelines and user/date-based activity queries.

| Attributes | Format |
|------------|---------|
| PK | "entity#" + entityTypeId + "#" documentId |
| SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss + "#" + entityId + "#" + ulid |
| GSI1PK | "activity#user#" + username |
| GSI1SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss + "#" + entityId + "#" + ulid |
| GSI2PK | "activity#" + yyyy-MM-dd |
| GSI2SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss + "#" + entityId + "#" + ulid |

### Document Activity Key Schema

Document activity keys store audit records for document actions. They support document timelines as well as cross-document activity views by user and date.

| Attributes | Format |
|------------|---------|
| PK | "doc#" + documentId |
| PK (artifact) | "doc#" + documentId + "#art#" + artifactId |
| SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss + "#" + documentId + "#" + ulid|
| GSI1PK | "activity#user#" + username |
| GSI1SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss + "#" + documentId + "#" + ulid|
| GSI2PK | "activity#" + yyyy-MM-dd |
| GSI2SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss + "#" + documentId + "#" + ulid|

### Activity Attributes

Activity attributes describe the actor, resource, operation, status, source, and change details associated with an activity record.

| Attributes | Description |
|------------|-------------|
| siteId | Site Identifier |
| resource | Activity Resource (document, entity, entityType, etc) |
| type | Type of User Activity (view, add, change, delete) |
| status | Activity Status (COMPLETE, FAILED, UNAUTHORIZED) |
| sourceIpAddress | Source Ip Address for activity request |
| source | Source of activity request |
| userId | Create by user |
| documentId | Document Identifier |
| attributeKey | Document Attribute Key |
| entityTypeId | EntityType Identifier |
| entityId | Entity Identifier |
| changeSet | Map of new / old value by key |
| inserteddate | Inserted Date |

## Document User Activity

Document User Activities refers to the tracking and logging of actions performed on documents within a system.

These activities typically include operations such as CREATE, VIEW, DELETE, and MODIFY, allowing administrators or users to monitor the lifecycle and interactions with documents. 

This tracking provides visibility into who accessed or altered a document, when the action occurred, and what changes were made. Document Activities are crucial for auditing, security, compliance, and overall document management, ensuring accountability and transparency in document usage.

Document user activity is stored alongside version-related records so a document's metadata and content changes can be tied back to the activity that created or modified them.

:::note
These attributes are stored in the "versions" DynamoDB table.
:::

### Document Activity

The main document user activity tracking record. Depending on the type of document activity, the versionPk, versionSk refers to the record associated with the activity.

This record acts as the activity timeline entry for a document. The version key references allow the activity entry to point to the metadata or content snapshot associated with the user action.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "doc#" + documentId |
| SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss.ffffffZ |
| GSI1PK | "activity#user#" + username |
| GSI1SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss.ffffffZ + "#" + documentId |
| GSI2PK | "activity#" |
| GSI2SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss.ffffffZ + "#" + documentId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| type | Type of User Activity (view, add, change, delete) |
| userId | Create by user |
| versionPk | PK key for version table |
| versionSk | SK key for version table |
| inserteddate | Inserted Date |

### Document Metadata

Document Metadata refers to the metadata information attached to the document.

These records capture metadata snapshots for version and activity tracking. They help preserve what metadata was present at a point in time, rather than only storing the latest active document state.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "doc#" + yyyy-MM-dd'T'HH:mm:ss |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| path | Document path |
| inserteddate | Inserted Date |
| lastModifiedDate | Last Modified Date |
| deepLinkPath | Document deep link path |
| metadata | Key / Value with Key starting with "md#" |

### Document Version

Document Version Tracking refers to the process of recording and managing changes made to the content of a document over time. Each time a document is edited or updated, a new version is created, allowing users to track and compare previous iterations of the document.

The version record stores content-level information such as content type, size, checksum, and S3 version. This allows FormKiQ to associate document history with the correct stored object version.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "document#" + yyyy-MM-dd'T'HH:mm:ss |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| contentType | Mime Content Type |
| contentLength | Mime Content Type |
| checksum | Document content checksum |
| checksumType | Document content checksum type |
| s3version | Document Content S3 version |

### Document Attribute Version

Document Attribute Tracking refers to the monitoring and recording of changes made to the metadata or properties associated with a document.

Attribute version records preserve the state of structured metadata over time. They support auditability for changes to attributes that may drive workflows, search behavior, compliance status, or business classification.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "doc#" + documentId |
| SK | "attr#" + key + "#" + yyyy-MM-dd'T'HH:mm:ss + "#" + value |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| archive#SK | "attr#" + key + "#" + value |
| documentId | Document Identifier |
| key | attribute key |
| index | attribute index |
| valueType | Type of Attribute (string, number, boolean, publication) |
| stringValue | string value |
| numberValue | number value |
| booleanValue | boolean value |

## Attributes

The Attributes entity defines reusable metadata fields that can be attached to documents. Attribute definitions describe the key, type, data type, and usage state so documents can use structured metadata consistently across sites, schemas, search, and workflows.

### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "attr#" + key |
| SK | "attribute" |
| GSI1PK | "attr#" |
| GSI1SK | "attr#" + key |
| GSI2PK | "attr#" |
| GSI2SK | "attr#" + dataType |

### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Attribute Key |
| type | Attribute Type (IE: OPA) |
| dataType | Data Type (STRING, NUMBER, BOOLEAN, KEY_ONLY, WATERMARK, PUBLICATION ) |
| key | Attribute key |
| isInUse | Is Attribute in use |
| watermarkText | Watermark Text |

## Schema

Schema entities define allowed metadata structures for sites and documents. They are used to validate expected attributes, support composite-key search patterns, and constrain allowed values where structured metadata is required.

### Site Entity Schema

The Site Entity Schema stores the JSON schema configuration for a site-level entity. It defines the metadata shape and validation expectations used for documents or other site-scoped records.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "schemas" |
| SK | "site#" + entity |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| name | Name of Schema |
| schema | Schema JSON document |

### Site Composite Key

Site Composite Key records support multi-attribute query patterns. They store configured combinations of attribute keys so FormKiQ can search efficiently across more than one metadata field.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "schemas" |
| SK | "compositeKey#" + UUID |
| GSI1PK | "schemas#compositeKey" |
| GSI1SK | "key#" + keys |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| keys | List of Keys |

### Site Attribute Key

Site Attribute Key records provide a searchable index of attribute keys referenced by a site schema. This helps FormKiQ identify schema-managed attributes without parsing every schema document.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "schemas" |
| SK | "attr#" + key |
| GSI1PK | "attr#" + key |
| GSI1SK | "true" |

### Attribute Allowed Values 

A searchable key for an attributes allowed values in a Site Schema.

Allowed-value records make enumerated values queryable. They support validation and user-interface experiences where a schema limits an attribute to a known list of values.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "schemas" |
| SK | "attr#" + key + "#allowedvalue#" + value |
| GSI1PK | "attr#" + key + "#allowedvalue" |
| GSI1SK | "val#" + value |

## Classification 

Classification entities define document classification schemas and related search helpers. They allow FormKiQ to model category-specific metadata rules, composite keys, and allowed values for classified documents.

### Classification Entity

The Classification Entity stores the schema document for a classification. A classification can define the expected metadata shape for documents assigned to that class.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "schemas#" + documentId |
| SK | "class#" + entity |
| GSI1PK | "class#" + entity |
| GSI1SK | "attr#" + name |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| name | Name of Classification |
| documentId | Classification Identifier |
| schema | Schema JSON document |

### Classification Composite Key 

Classification Composite Key records support efficient searches across configured combinations of classification attributes.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "schemas#" + documentId |
| SK | "compositeKey#" + UUID |
| GSI1PK | "schemas#compositeKey" |
| GSI1SK | "key#" + keys |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Classification Identifier |
| keys | List of Keys |

### Site Attribute Key

Classification Site Attribute Key records index the attribute keys used by a classification schema.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "schemas#" + documentId |
| SK | "attr#" + key |
| GSI1PK | "attr#" + key |
| GSI1SK | "true" |

### Attribute Allowed Values 

A searchable key for an attributes allowed values in a Classification

Classification allowed-value records make classification-specific enumerations searchable and enforceable.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "schemas#" + documentId |
| SK | "attr#" + key + "#allowedvalue#" + value |
| GSI1PK | "attr#" + key + "#allowedvalue" |
| GSI1SK | "val#" + value |

## Document Shares

The following entities support document sharing. They model which users or groups can access shared files or directories and how a shared document can be looked up by the share name, path, document, or site.

### Shares

Shares records list the documents or folders shared with a particular group or user. They are used to resolve what a principal can access and what permission type applies to the shared resource.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "shares#" + (group/user) + "#" + name |
| SK | "share#" + siteId + "#" + documentId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| type | Type of Share (File or Directory) |
| inserteddate | Inserted Date |
| userId | Create by user |
| path | Folder path |
| name | Name of share |
| siteId | SiteId share is part of |
| permissionType | Type of permission |
| permissions | List of permissions |

### Document Share

Document Share records provide a document-centric lookup for a share. They make it possible to find share metadata from the shared document identifier, path, and share name.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "shares#" + documentId |
| SK | "share" |
| GSI1PK | "share#" + name |
| GSI1SK | "share#" + path + "#" + documentId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Share Identifier |
| sharedDocumentId | Shared Document Id |
| name | Name of share |
| type | Type of Share (File or Directory) |
| inserteddate | Inserted Date |
| userId | Create by user |
| path | Folder path |
| siteId | SiteId share is part of |
| permissionType | Type of permission |
| permissions | List of permissions |

## Document Folder

Document Folder records maintain folder and file listing indexes for document paths. They support browsing folder-style structures without scanning every document in the site.

### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "global#folders#" + parentDocumentId |
| SK | "ff#" + path OR "fi#" + path |
| GSI1PK (folder only) | "folder#" + documentId |
| GSI1SK (folder only) | "folder" |
| GSI1PK (file only - as of 1.19) | "file#" + documentId |
| GSI1SK (file only) | "file" |
| GSI2PK  | "global#filename#" + &lt;first 2 characters of filename&gt; + "#s" + shardId|
| GSI2SK  | "fi#" + filename + "#" + documentId or "ff#" + folder + "#" + documentId |

### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Share Identifier |
| path | Folder path |
| type | Type of Share (File or Directory) |
| parentDocumentId | Parent Document Id |
| inserteddate | Inserted Date |
| lastModifiedDate | Last Modified Date |
| userId | Create by user |

## Document Folder Permission

Document Folder Permission records store path-based permissions for folder-style document organization. They allow role permissions to be attached to a folder path and evaluated during folder browsing or document access.

### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "global#folders#permissions" |
| SK | "ff#" + path |

### Entity Attributes

| Attributes | Description |
|------------|-------------|
| path | Folder path |
| type | Type of Share (File or Directory) |
| inserteddate | Inserted Date |
| userId | Create by user |
| "role#" + roleName | Permissions of Role |

## Queue

Queue records define workflow or review queues that documents can be routed into. Queues are used by workflow and document action processing to group documents awaiting human or automated handling.

### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "queues#" + documentId |
| SK | "queue" |
| GSI1PK | "queues#" |
| GSI1SK | "queue#" + name + "#" + documentId |

### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Share Identifier |
| name | Name of Queue |

## Workflows

The following entities define workflow templates and track documents currently moving through workflows. Workflows connect rules, queues, actions, and document state transitions.

### Workflow

The Workflow entity stores the workflow definition and operational metadata. It identifies the workflow by name and status and stores the workflow JSON used by processing logic.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "workflows#" + documentId |
| SK | "workflow" |
| GSI1PK | "workflows#" |
| GSI1SK | "workflow#" + name + "#" + documentId |
| GSI2PK | "workflows#" |
| GSI2SK | "workflow#" + status + "#" + name + "#" + documentId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| name | Name of Workflow |
| inUse | Whether Workflow is in use |
| status | Workflow status |
| description | Workflow description |
| userId | Create by user |
| json | Workflow JSON blob |

### Document Workflow

The Document Workflow entity tracks a specific document's progress through a workflow. It records the workflow, current step, action references, and status needed to resume or inspect workflow execution.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "wfdoc#" + documentId |
| PK - as of 1.19 | "docs#" + documentId |
| SK | "wf#" + workflowId |
| SK (artifact) | "wf#" + workflowId + "#art#" + artifactId |
| GSI1PK | "wfdoc#" + documentId |
| GSI1PK (artifact) | "wfdoc#" + documentId + "#art#" + artifactId |
| GSI1SK | "wf#" + workflowName + "#" + workflowId |
| GSI2PK | "wf#" + workflowId |
| GSI2SK (artifact) | "wfdoc#" + documentId + "_art#" + artifactId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| workflowId | Workflow identifier |
| workflowName | Workflow name |
| status | Workflow status |
| actionPk | Action PK |
| actionSk | Action SK |
| currentStepId | Current Workflow step Id |

## Case Management

The following entities support case management. Cases group tasks, NIGO items, and related documents so document-centric work can be tracked as a larger business process.

### Case

The Case entity stores the top-level case record, including its status, date range, case number, and metadata. It acts as the parent object for tasks, NIGO records, and case-related documents.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "case#" + caseId |
| SK | "case" |
| GSI1PK | "case#" |
| GSI1SK | "case#" + caseId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Case Identifier |
| name | Case Name |
| description | Case Description |
| status | Case Status |
| caseNumber | Case Number |
| documentNumber | Document Number |
| metadata | Case Metadata |
| inserteddate | Inserted Date |
| startDate | Start Date |
| endDate | End Date |

### Task

The Task entity stores work items under a case. A task can represent a review step, operational assignment, or follow-up action with its own status and date fields.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "case#" + caseId |
| SK | "task#" + taskId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Task Identifier |
| caseId | Case Identifier |
| name | Task Name |
| description | Task description |
| status | Task Status |
| metadata | Task Metadata |
| inserteddate | Inserted Date |
| startDate | Start Date |
| endDate | End Date |

### Nigo

The Nigo entity stores "not in good order" items associated with a case. These records can represent missing, invalid, or incomplete information that must be resolved before the case can proceed.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "case#" + caseId |
| SK | "nigo#" + nigoId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Nigo Identifier |
| caseId | Case Identifier |
| name | Nigo name |
| description | Nigo description |
| status | Nigo Status |
| metadata | Nigo Metadata |
| inserteddate | Inserted Date |
| startDate | Start Date |
| endDate | End Date |

### Document

The Case Management Document entity links a FormKiQ document to a case, task, or NIGO record. It provides the relationship between the document and the business object it supports.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "case#" + caseId |
| SK | "doc#" + type + "#" + objectId + "#" + documentId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| caseId | Case Identifier |
| objectId | Case / Task / Nigo Identifier |
| type | Document Type (Case / Task / Nigo) |
| inserteddate | Inserted Date |

## Rulesets

The following entities define rulesets and rules used for automation. Rulesets evaluate document conditions and can trigger workflows or other actions when matching documents are created or updated.

### Ruleset

The Ruleset entity stores a versioned set of automation rules. Priority and status determine whether and how the ruleset participates in document processing.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "rulesets" |
| SK | "ruleset#" + status + "#" + priority + "#" + rulesetId |
| GSI1PK | "ruleset#" |
| GSI1SK | "ruleset#" + rulesetId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Ruleset Identifier |
| description | Ruleset description |
| version | Ruleset version |
| priority | Ruleset priority |
| status | Ruleset status |

### Rule

The Rule entity stores the conditions and target workflow for an individual rule. Rules are ordered by priority and evaluated as part of the parent ruleset.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "ruleset#" + rulesetId |
| SK | "rule#" + ruleId |
| GSI1PK | "ruleset#" + rulesetId |
| GSI1SK | "rule#" + priority + "#" + ruleId |

| Attributes | Format |
|------------|---------|
| PK | "ruleset#" |
| SK | "rule#" + status + "#" + rulesetId + "#" + priority + "#" + ruleId |
| GSI1PK | "ruleset#" + rulesetId |
| GSI1SK | "rule#" + ruleId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| rulesetId | Ruleset Identifier |
| documentId | Rule Identifier |
| description | Rule description |
| priority | Rule priority |
| workflowId | Workflow to run on match |
| conditions | Rule conditions |
| status | Rules status |

## Mappings

The following entities support mappings, which translate or connect external data structures to FormKiQ document attributes and metadata.

### Mapping

The Mapping entity stores a named metadata mapping definition. Mappings are useful when importing, transforming, or synchronizing document metadata from another system.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "mappings#" + documentId |
| SK | "mapping" |
| GSI1PK | "mappings#" |
| GSI1SK | "mapping#" + name |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Mapping Identifier |
| name | Mapping name |
| description | Mapping description |
| attributes | Mapping attributes |

## API Keys

API Key records store API key metadata used for key-based API access. API keys are scoped to a site and can include permissions and group claims used by the API authorization layer.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "apikeys#" |
| SK | "apikey#" + apiKey |
| GSI1PK | siteId + "/apikeys#" |
| GSI1SK | "apikey#" + name + apiKey |
| GSI2PK | siteId/"apikeys#" |
| GSI2SK | "apikey#" + apiKey (mask) |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| apiKey | API Key |
| name | API Key Name |
| userId | Create by user |
| siteId | Site Identifier |
| permissions | List of API Key permissions (read/write/delete) |
| groups | List Groups to add to the API JWT custom claims |
| inserteddate | Inserted Date |

## Activities Events

Activity event records provide event-sourcing support for activity data. They preserve references to activity records and can use time-to-live behavior for retention management.

### Document Activities Events

Document Activities Events store event records related to document activity. They allow activity changes to be processed or retained separately from the current activity records themselves.

#### Entity Event Sourcing Key Schema

| Attributes | Format |
|------------|---------|
| PK | "documentEvent" |
| SK | "event#docs#activities#" + yyyy-MM-dd'T'HH:mm:ssZ + "#" + documentId + "#" + UUID |
| SK (artifact) | "event#docs#activities#" + yyyy-MM-dd'T'HH:mm:ssZ + "#" + documentId + "_art#" + ULID |

#### Entity Event Sourcing Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| siteId | Site Identifier |
| activityKeys | List of Activities Key |
| inserteddate | Inserted Date |
| TimeToLive | Record Time to Live |

## Entities Types

Entity Types define custom business object types that can be managed alongside documents. They provide the namespace and name used to group related entities under a reusable type definition.

### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "entityType#" + documentId |
| SK | "entityType"  |
| GSI1PK | "entityType#" |
| GSI1SK | "entityType#" + namespace + "#" + name + "#"  |

### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Entity Type Identifier |
| namespace | Entity Type Namespace |
| name | Entity Type Name |
| inserteddate | Inserted Date |

## Entity

Entity records store instances of a configured entity type. They are useful for representing business objects that relate to documents, such as customers, vendors, cases, assets, or other domain-specific records.

### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "entity#" + entityTypeId + "#" documentId |
| SK | "entity"  |
| GSI1PK | "entity#" + entityTypeId |
| GSI1SK | "entity#" + name + "#" + documentId  |

### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Entity Identifier |
| entityTypeId | Entity Type Identifier |
| name | Entity Name |
| inserteddate | Inserted Date |

:::note
Entity attributes metadata are stored with the prefix of attr#
:::

## Locale

Locale records store localized labels and values used by the interface, schemas, classifications, and allowed values. They allow the same FormKiQ configuration to present user-facing text in different languages or regional formats.

### Locale List

Locale List records track the locales configured for the deployment. They allow the system to enumerate which locale values are available.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "locale#" |
| SK | "locale# + locale |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| locale | Locale |

### Locale Type

Locale Type records store localized values for interface labels, schema attributes, classification attributes, and allowed values.

Fetch patterns include:

- Get ALL values for a specific locale
- Get Locale using
  - locale, interfaceKey
  - locale, schema, attributeKey
  - locale, classification, attributeKey

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "locale#type" |
| SK | locale + "#" + type + "#" + interfaceKey |
|  | locale + "#" + type + "#" + attributeKey + "#" + allowedValue |
|  | locale + "#" + type + "#" + classificationId + "#" + attributeKey + "#" + allowedValue |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| itemType | Type of Locale Resource |
| interfaceKey | Interface Key |
| attributeKey | Attribute Key |
| allowedValue | Allowed Value |
| classificationId | Classification Id |
| locale | Locale |
| localizedValue | Localized Value | 

## Open Policy (OPA)

Open Policy Agent records store policy configuration used for advanced authorization decisions. OPA policies can evaluate document, user, role, and attribute context to enforce access-control rules beyond basic group membership.

### Entity Key Schema (Full)

The full OPA policy record stores the complete policy document for a site. It is useful when the policy should be read or replaced as a single unit.

| Attributes | Format |
|------------|---------|
| PK | "controlpolicy#opa" |
| SK | "opa#full#" + siteId + "#policy" |

### Entity Key Schema (Policy)

The policy OPA record stores the policy body for a site-level access-control configuration.

| Attributes | Format |
|------------|---------|
| PK | "controlpolicy#opa" |
| SK | "opa#policy#" + siteId + "#policy" |

### Entity Key Schema (Policy Item)

Policy item records store individual indexed policy fragments. This supports policies that are managed or evaluated as ordered items rather than only as one complete document.

| Attributes | Format |
|------------|---------|
| PK | "controlpolicy#opa" |
| SK | "opa#item#" + siteId + "#policy#" + index |

### Entity Attributes

| Attributes | Description |
|------------|-------------|
| siteId | Site Identifier |
| policy | OPA Policy |
| type | OPA Policy Type (FULL, POLICY, POLICY_ITEM) |
| index | Index |
