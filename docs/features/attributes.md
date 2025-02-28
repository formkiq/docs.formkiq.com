---
sidebar_position: 1
---

# Attributes

## Overview

Attributes represent structured metadata associated with documents in the FormKiQ Document Management Platform. They are used to store key/value(s) pairs that provide additional context, consistency in data structure and validation, support enhanced search capabilities, and drive workflow decisions. Unlike simple tags, attributes are designed to be more structured and may support multiple values per key.

## Key Concepts

### Attribute Structure
Each attribute consists of three fundamental components:
- **Key**: A unique identifier for the attribute
- **Data Type**: The type of data the attribute can hold
- **Type**: The attribute's purpose or classification within the system

### Data Types
FormKiQ supports the following data types for attributes:

- **STRING**: For text-based information (e.g., titles, descriptions, authors)
- **NUMBER**: For numeric values (e.g., version numbers, page counts)
- **BOOLEAN**: For true/false values (e.g., approval status, publication flags)
- **KEY_ONLY**: For identifier-only attributes without additional data
- **PUBLICATION**: For creating permanent publication links in documentation review processes
- **RELATIONSHIP**: For establishing connections between documents (e.g., attachments, parent-child relationships)
- **WATERMARK**: Identifying watermark attributes that can be attached to specific documents


### Attribute Types

FormKiQ offers two types of attributes:

- **STANDARD**: General-purpose attributes for common metadata needs
- **OPA (Open Policy Agent)**: Specialized attributes for implementing policy-based access control

## Common Use Cases

### Document Organization
- Create custom taxonomies
   - Example: A global consulting firm can create a taxonomy that categorizes documents by region (e.g., Americas, EMEA, APAC) and by service line (e.g., Financial Advisory, Risk Management). This allows users to filter documents quickly based on geography or specific service areas.

- Implement version control
   - Example: A legal team working on contract revisions can use version control to track changes. Each saved version is timestamped and attributed to the responsible user, ensuring that any modifications—from minor edits to major redrafts—are recorded. This way, if a dispute arises, it’s easy to revert to a previous version or review the evolution of the contract.

- Establish document hierarchies
   - Example: A university may organize its research documents by creating a hierarchical structure: University > College > Department > Research Group > Individual Project. This structure helps in navigating through thousands of files by logically grouping them into nested categories.

- Tag documents for easy retrieval
   - Example: A marketing agency can tag all campaign documents with relevant keywords like "Q1-campaign," "social-media," or "client-A." This tagging system supports quick searches and filtering, enabling team members to locate specific campaign materials without navigating through multiple folders.

### Workflow Management
- Track document status
   - Example: A publishing company can assign statuses such as "Draft," "Under Review," "Approved," and "Published" to manuscripts. This status tagging makes it clear at which stage a document is and helps manage deadlines efficiently.

- Manage approval processes
   - Example: In a pharmaceutical company, new drug trial protocols might require multiple approvals from different departments (e.g., regulatory, clinical, and legal). A workflow system can automatically route the protocol to the next approver once the current one signs off, ensuring that no step is missed.

- Monitor document lifecycle stages
   - Example: An IT department could track lifecycle stages for policy documents: creation, review, update, archival, and disposal. This enables them to set reminders for periodic reviews and ensures that outdated documents are archived or safely disposed of in accordance with compliance requirements.

- Implement conditional workflows
   - Example: A financial institution might set up a conditional workflow for loan documents. For instance, if a loan exceeds a certain amount, the document is automatically routed to a senior manager for additional review before final approval. This ensures that high-risk decisions receive extra oversight.

### Access Control
- Define document permissions
- Implement role-based access
- Create attribute-based policies
- Manage document sharing

## Reserved Attribute Keys

The following keys are reserved for FormKiQ system use:

- **Classification**: Used for document classification
- **Relationships**: Manages document relationships
- **MalwareScanResult**: Stores malware scan results
- **EsignatureDocusignEnvelopeId**: Tracks DocuSign envelope IDs
- **EsignatureDocusignStatus**: Monitors DocuSign signature status

## Data Types with Additional Properties

### Watermark

The WATERMARK attribute is defined as part of the attribute object. It is used to configure watermark settings for documents. The watermark object contains several properties that control the appearance and positioning of the watermark:

* **text**: The watermark text to display (e.g., “CONFIDENTIAL” or “DRAFT”).
* **rotation**: A number indicating the rotation angle for the watermark.
* **imageDocumentId**: The identifier of an image document to use as the watermark image.
* **scale**: A string value (either BEST_FIT or ORIGINAL) that specifies the watermark scale.
* **position**: An object that defines where the watermark is anchored and its offsets.
   * **xAnchor**: Horizontal anchor for the watermark (options: LEFT, CENTER, RIGHT).
   * **yAnchor**: Vertical anchor for the watermark (options: TOP, CENTER, BOTTOM).
   * **xOffset**: Horizontal offset value.
   * **yOffset**: Vertical offset value.

#### Use Cases

* **Security & Confidentiality**: Automatically overlay a “CONFIDENTIAL” watermark on sensitive documents.
* **Branding**: Embed a company logo (by referencing an image via imageDocumentId) or company tagline on every document.
* **Document Status**: Indicate the document state (e.g., “DRAFT”, “FINAL”) by setting the watermark text.
* **Visual Customization**: Adjust watermark rotation, scale, and position to meet aesthetic or functional requirements.

#### POST /attributes

Creates a new attribute definition for the site. In this example, the attribute key is WATERMARK_SETTING and it includes a watermark object with custom text, rotation, scale, and position details.

```
curl -X POST "https://<FORMKIQ_API>/attributes?siteId=site123" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
        "key": "WATERMARK_SETTING",
        "dataType": "WATERMARK",
        "watermark": {
          "text": "CONFIDENTIAL"
        }
      }'
```

## Best Practices Examples

### 1. Attribute Naming

**Use clear, descriptive keys:**
- Good: `invoiceNumber`, `clientName`, `projectDeadline`
- Poor: `invNum`, `cName`, `pDL`

**Follow a consistent naming convention:**
- camelCase: `documentOwner`, `approvalStatus`, `lastModifiedDate`
- snake_case: `document_owner`, `approval_status`, `last_modified_date`
- (Choose one style and apply it consistently)

**Avoid special characters:**
- Good: `taxPercentage`, `clientAddress`
- Poor: `tax%`, `client@address`

**Consider future scalability:**
- Instead of: `2023Budget`
- Better: `budgetYear2023` (allows for `budgetYear2024`, etc.)

### 2. Data Type Selection

**Choose appropriate data types for validation:**
- For dates: Use `STRING` with a standardized format (ISO 8601: YYYY-MM-DD)
- For monetary values: Use `NUMBER` to enable calculations
- For yes/no flags: Use `BOOLEAN` instead of strings like "yes"/"no"

**Consider reporting requirements:**
- If you need to generate reports on approval rates: Use `BOOLEAN` for `isApproved` rather than text values
- If you need to analyze processing times: Use `NUMBER` for time values to enable averaging

**Plan for data aggregation needs:**
- For department budgets that need summing: Use `NUMBER` instead of `STRING`
- For categorizing documents by region: Use `STRING` with consistent values like "APAC", "EMEA", etc.

**Account for search functionality:**
- For searchable fields like project names: Use `STRING`
- For range-based searches like date ranges: Use `NUMBER` for timestamp values

### 3. Attribute Organization

**Group related attributes logically:**
- Contract attributes: `contractValue`, `contractStartDate`, `contractEndDate`
- Author attributes: `authorName`, `authorDepartment`, `authorContact`

**Plan attribute hierarchies, as needed:**
- For complex properties, instead of flat attributes like `marketingCampaignName`, `marketingCampaignBudget`, `marketingCampaignStart`
- Consider creating a hierarchy: `campaign.name`, `campaign.budget`, `campaign.startDate`

**Document attribute relationships:**
- Consdier creating a data dictionary that shows how attributes relate to one another
- Example: `projectManager` is linked to `projectId` which is linked to `clientId`

## API Endpoints

### GET /attributes

Retrieves a list of all attribute definitions available for a given site. This endpoint is useful for building an interface that displays the available attributes (for example, in an administrative dashboard) and for understanding what metadata options are available when tagging documents.

#### Sample Request
```
curl -X GET "https://<FORMKIQ_API>/attributes?siteId=site123&limit=20" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Accept: application/json"
```

#### Sample Response (HTTP 200)
```
{
  "siteId": "site123",
  "attributes": [
    {
      "key": "department",
      "type": "STANDARD",
      "dataType": "STRING",
    },
    {
      "key": "priority",
      "type": "STANDARD",
      "dataType": "NUMBER"
    }
  ],
  "next": "tokenForNextPage"
}
```

### POST /attributes

Creates a new attribute definition for a site. Attribute definitions specify metadata options that can later be used when adding attributes to documents.

#### Sample Request
```
curl -X POST "https://<FORMKIQ_API>/attributes?siteId=site123" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
        "key": "region",
        "dataType": "STRING"
      }'
```

#### Sample Response (HTTP 200)

```
{
  "message": "Attribute created successfully",
  "attribute": {
    "key": "region",
    "dataType": "STRING"
  }
}
```

### GET /attributes/&lt;key&gt;

Retrieves the details for a specific attribute definition identified by its key. This endpoint is useful for reviewing the configuration or allowed values for a given attribute.

#### Sample Request

```
curl -X GET "https://<FORMKIQ_API>/attributes/priority?siteId=site123" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Accept: application/json"
```

#### Sample Response (HTTP 200)

```
{
  "attribute": {
    "key": "priority",
    "type": "STANDARD",
    "dataType": "NUMBER"
  }
}
```

### DELETE /attributes/&lt;key&gt;

Deletes an attribute definition from the site.

#### Sample Request

```
curl -X DELETE "https://<FORMKIQ_API>/attributes/region?siteId=site123" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Accept: application/json"
```

### GET /attributes/&lt;key&gt;/allowedValues

Retrieves the allowed values for a specific attribute definition. This endpoint displays all allowed values across all classifications and site schema.

#### Sample Request

```
curl -X GET "https://<FORMKIQ_API>/attributes/department/allowedValues?siteId=site123" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Accept: application/json"
```

#### Sample Response (HTTP 200)

```
{
  "allowedValues": [
    "val1", "val2"
  ]
}
```
