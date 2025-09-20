---
sidebar_position: 8
---

# DynamoDB Schema

[Amazon DynamoDB](https://aws.amazon.com/dynamodb) is a NoSQL database service designed for high-performance, scalable, and low-latency applications.

In a DynamoDB table, the primary key is a fundamental component of the database schema, used to uniquely identify and organize items within a table. The primary key consists of two attributes: the partition key (PK) and the sort key (SK). The partition key is the primary attribute used to distribute data across multiple partitions for scalability.

The table may also include Global Secondary Indexes named using the prefix (GSI) which can be employed to facilitate efficient querying of data based on different attributes.

## Multi-Tenant

When an entity is stored for a specific `SiteId` other than the `default` site, the format of the `PK` is prefixed with `SiteId/`.

For example: When using a siteId of `finance`, the PK will store a document using `finance/docx#`.

## Sites

The following are the entities related to `Sites`.

### Sites

The Sites Entity

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

The Group to Sites permissions mapping.

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

The following are the entities related to `Documents`.

### Document

The Document Entity consists of attributes that capture essential information about a document.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "document" |
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

A Child Document Entity includes attributes that capture details specific to the subsidiary document.

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

A "soft delete" Document is moved into a different PK namespace than all other documents.

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

Contains all information about any optical character recognition (OCR) data for the document.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "ocr#" |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| inserteddate | Inserted Date |
| userId | Create by user |
| contentType | Mime Content Type |
| ocrEngine | Ocr Engine Used (textract, tesseract) |
| ocrStatus | Ocr Status (failed, requested, skipped, successful) |
| jobId | Ocr Job Id |
| ocrOutputType | Ocr Output Type (CSV) |

### Document Actions

Schema for Document Actions.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "action#" + idx + "#" + type |
| GSI1PK | "action#" + type + "#" + queueId |
| GSI1SK | "action#" + documentId + "#" + yyyy-MM-dd'T'HH:mm:ssZ |
| GSI2PK | "actions#" + status |
| GSI2SK | "action#" + documentId |

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
| workflowId | Workflow Id |
| workflowStepId | Workflow Step Id |
| workflowLastStep | Workflow Last Step |

### Document Sync

Schema for Document Sync Events.

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

Document Tag(s) entity.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "tags#" + tagKey |
| GSI1PK | "tag#" + tagKey + "#" + tagValue |
| GSI1SK | "yyyy-MM-dd'T'HH:mm:ssZ" + "#" + documentId |
| GSI2PK | "tag#" + tagKey |
| GSI2SK | tagValue + "#" + yyyy-MM-dd'T'HH:mm:ssZ + "#" + documentId |

#### Entity Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| type | Type of Tag |
| tagValue | Tag Value |
| userId | Create by user |
| inserteddate | Inserted Date |

### Document Tag (Multi-Value)

Document Tag(s) entity with multiple values.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "tags#" + tagKey + "#idx" + index |
| GSI1PK | "tag#" + tagKey + "#" + tagValue |
| GSI1SK | "yyyy-MM-dd'T'HH:mm:ssZ" + "#" + documentId |
| GSI2PK | "tag#" + tagKey |
| GSI2SK | tagValue + "#" + yyyy-MM-dd'T'HH:mm:ssZ + "#" + documentId |

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

Document Attribute entity.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "docs#" + documentId |
| SK | "attr#" + key + "#" + value |
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

Contains all information about Data Classification Result for the document.

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

### Document Publication

Document Publication entity.

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

:::note
These attributes are stored in the "audit" DynamoDB table.
:::

### EntityType Activity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "entityType#" + entityTypeId |
| SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss.ffffffZ + "#" + entityTypeId |
| GSI1PK | "activity#user#" + username |
| GSI1SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss.ffffffZ + "#" + entityTypeId |
| GSI2PK | "activity#" + yyyy-MM-dd |
| GSI2SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss.ffffffZ + "#" + entityTypeId |

### Entities Activity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "entity#" + entityTypeId + "#" documentId |
| SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss.ffffffZ + "#" + entityId |
| GSI1PK | "activity#user#" + username |
| GSI1SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss.ffffffZ + "#" + entityId |
| GSI2PK | "activity#" + yyyy-MM-dd |
| GSI2SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss.ffffffZ + "#" + entityId |

### Document Activity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "doc#" + documentId |
| SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss.ffffffZ + "#" + documentId |
| GSI1PK | "activity#user#" + username |
| GSI1SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss.ffffffZ + "#" + documentId |
| GSI2PK | "activity#" + yyyy-MM-dd |
| GSI2SK | "activity#" + yyyy-MM-dd'T'HH:mm:ss.ffffffZ + "#" + documentId |

### Activity Attributes

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

:::note
These attributes are stored in the "versions" DynamoDB table.
:::

### Document Activity

The main document user activity tracking record. Depending on the type of document activity, the versionPk, versionSk refers to the record associated with the activity.

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

The Attributes Entity consists of attributes that capture essential information about a document.

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

The Schema Entity consists of attributes configurations.

### Site Entity Schema

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

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "schemas" |
| SK | "attr#" + key |
| GSI1PK | "attr#" + key |
| GSI1SK | "true" |

### Attribute Allowed Values 

A searchable key for an attributes allowed values in a Site Schema.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "schemas" |
| SK | "attr#" + key + "#allowedvalue#" + value |
| GSI1PK | "attr#" + key + "#allowedvalue" |
| GSI1SK | "val#" + value |

## Classification 

The Classification Entity attributes.

### Classification Entity

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

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "schemas#" + documentId |
| SK | "attr#" + key |
| GSI1PK | "attr#" + key |
| GSI1SK | "true" |

### Attribute Allowed Values 

A searchable key for an attributes allowed values in a Classification

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "schemas#" + documentId |
| SK | "attr#" + key + "#allowedvalue#" + value |
| GSI1PK | "attr#" + key + "#allowedvalue" |
| GSI1SK | "val#" + value |

## Document Shares

The following are the entities related to sharing of Documents.

### Shares

A list of shares for a particular user role.

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

A list of shares for a particular user role.

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

Document folder / file listing index.

### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "global#folders#" + parentDocumentId |
| SK | "ff#" + path OR "fi#" + path |
| GSI1PK (folder only) | "folder#" + documentId |
| GSI1SK (folder only) | "folder" |

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

Document folder permission.

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

Queue entity object.

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

The following are the entities related to `Workflows`.

### Workflow

The workflow entity consists of attributes that capture essential information about a workflow.

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

The document workflow entity consists of attributes that capture essential information about a document in a workflow.

#### Entity Key Schema

| Attributes | Format |
|------------|---------|
| PK | "wfdoc#" + documentId |
| SK | "wf#" + workflowId |
| GSI1PK | "wfdoc#" + documentId |
| GSI1SK | "wf#" + workflowName + "#" + workflowId |
| GSI2PK | "wf#" + workflowId |
| GSI2SK | "wfdoc#" + documentId |

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

The following are the entities related to `Case Management`.

### Case

The Case Entity consists of attributes that capture essential information about a case.

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

The Case Entity consists of attributes that capture essential information about a task.

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

The Case Entity consists of attributes that capture essential information about a nigo.

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

The Document Entity consists of attributes that capture essential information about a document attached to a Case / Task / Nigo.

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

The following are the entities related to `Rulesets`.

### Ruleset

The Ruleset Entity consists of attributes that capture essential information about a ruleset.

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

The Rule Entity consists of attributes that capture essential information about a rule.

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

The following are the entities related to `Mappings`.

### Mapping

The Mapping Entity consists of attributes that capture essential information about a mapping.

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

Api Key(s) allow access to API.

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
| inserteddate | Inserted Date |

## Activities Events

Storage of activity Entity Events.

### Document Activities Events

Document Activities Events.

#### Entity Event Sourcing Key Schema

| Attributes | Format |
|------------|---------|
| PK | "documentEvent" |
| SK | "event#docs#activities#" + yyyy-MM-dd'T'HH:mm:ssZ + "#" + documentId + "#" + UUID |

#### Entity Event Sourcing Attributes

| Attributes | Description |
|------------|-------------|
| documentId | Document Identifier |
| siteId | Site Identifier |
| activityKeys | List of Activities Key |
| inserteddate | Inserted Date |
| TimeToLive | Record Time to Live |

## Entities Types

Storage of entity types

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

Storage of entity

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

The storing of Locale information.

### Locale List

The listing of all locale setup.

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

Locale schema for the managing of Locale for Interface, Schema, Classification:

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

Open Policy Agent configuration.

### Entity Key Schema (Full)

| Attributes | Format |
|------------|---------|
| PK | "controlpolicy#opa" |
| SK | "opa#full#" + siteId + "#policy" |

### Entity Key Schema (Policy)

| Attributes | Format |
|------------|---------|
| PK | "controlpolicy#opa" |
| SK | "opa#policy#" + siteId + "#policy" |

### Entity Key Schema (Policy Item)

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
