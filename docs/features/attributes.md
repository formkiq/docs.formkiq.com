---
sidebar_position: 1
title: Attributes
---

# Attributes

## Overview

Attributes are structured metadata fields used to describe, classify, search, route, report on, and control access to documents. They are better suited than free-form tags when the value has business meaning, needs validation, drives automation, or should be used consistently across a site.

Examples:

- `documentType = invoice`
- `invoiceNumber = 1042`
- `department = Finance`
- `confidentiality = Restricted`
- `status = Approved`
- `retentionCategory = financial-record`

Attributes are commonly used with [Documents](/docs/features/documents), [Schemas](/docs/features/schemas), [Search](/docs/features/search), [Rulesets](/docs/features/rulesets), [Workflows](/docs/features/workflows), and [Security](/docs/platform/security).

## Attribute Definitions vs Document Attributes

There are two related concepts:

| Concept | What it means | Example API area |
| --- | --- | --- |
| Attribute definition | A reusable field definition available within a site. It describes the attribute key, data type, and behavior. | `/attributes` |
| Document attribute | A specific value attached to a specific document. | `/documents/{documentId}/attributes` |

Think of an attribute definition as the field setup, and a document attribute as the value stored on an individual document.

Example:

| Level | Example |
| --- | --- |
| Attribute definition | `department` is a `STRING` attribute available for the site. |
| Document attribute | Document `abc123` has `department = Finance`. |

## Attribute Data Model

An attribute is described by three main pieces:

| Field | Purpose |
| --- | --- |
| `key` | The attribute name, such as `department`, `invoiceNumber`, or `status`. |
| `dataType` | The kind of value the attribute stores. |
| `type` | The attribute's permission or system behavior, such as `STANDARD`, `GOVERNANCE`, or OPA-related access use. |

Document attribute values can be single-value or multi-value depending on the API shape and schema rules used by the site.

## Value Types and Special Types

FormKiQ supports standard value types and special-purpose attribute types.

### Value Types

| Data type | Use for | Example |
| --- | --- | --- |
| `STRING` | Text values, categories, identifiers, names, status values, and dates stored as strings. | `department = Finance` |
| `NUMBER` | Numeric values used for sorting, filtering, comparison, reporting, or calculations. | `invoiceTotal = 1250.75` |
| `BOOLEAN` | True/false values. | `isApproved = true` |

### Special Types

| Data type | Use for |
| --- | --- |
| `KEY_ONLY` | Identifier-only attributes where the presence of the key is meaningful. |
| `PUBLICATION` | Publication-related attributes for document review and publishing processes. |
| `RELATIONSHIP` | Relationships between documents, such as attachments or renditions. |
| `WATERMARK` | Watermark configuration that can be attached to documents. |

For document relationship examples, see [Documents](/docs/features/documents#relationships).

## Attribute Types

FormKiQ supports several attribute behavior types:

| Type | Purpose |
| --- | --- |
| `STANDARD` | General-purpose attributes used for classification, search, reporting, workflows, and integrations. |
| `GOVERNANCE` | Attributes that require `GOVERN` or `ADMIN` permissions to add, update, or delete. |
| OPA access attributes | Attributes used by Open Policy Agent policies for attribute-based access control. |

Use `GOVERNANCE` attributes for metadata that should be controlled by data governance or records-management roles. Use OPA-related access attributes when document metadata should influence access decisions.

For access-control details, see [Security](/docs/platform/security#attribute-based-access-control-abac) and [Open Policy Agent](/docs/formkiq-modules/modules/open_policy_agent).

## Common Use Cases

### Classification

Attributes can classify documents by type, department, region, owner, customer, or business process.

Examples:

- `documentType = contract`
- `department = Legal`
- `region = EMEA`
- `customerId = acme`

### Search and Filtering

Attributes make document search more precise than filename or full-text search alone.

Examples:

- Find invoices where `vendor = Acme`.
- Find contracts where `renewalDate` is within a date range.
- Find HR documents where `employeeId = 12345`.
- Find records where `confidentiality = Restricted`.

For search behavior, see [Search](/docs/features/search).

### Workflow Routing

Attributes can drive workflow and ruleset decisions.

Examples:

- Route `invoiceTotal > 10000` to a senior approver.
- Move `status = Approved` documents to a publication workflow.
- Trigger review when `retentionCategory = legal-hold`.
- Send documents from `department = Finance` to a finance queue.

For automation details, see [Rulesets](/docs/features/rulesets) and [Workflows](/docs/features/workflows).

### Governance and Access Control

Attributes can help enforce governance and access policies.

Examples:

- Use `confidentiality = Restricted` for sensitive records.
- Use `owner = username` for owner-only access patterns.
- Use `retentionCategory` to support retention review.
- Use `classification` attributes to drive OPA access policies.

For access control, see [Security](/docs/platform/security).

### Reporting and Analytics

Attributes are useful dimensions for reporting.

Examples:

- Documents by department
- Documents by document type
- Documents missing required metadata
- Documents by status or workflow stage
- Records by retention category

For reporting patterns, see [Reporting, Analytics, and Audit](/docs/platform/reporting-and-analytics).

## Schemas, Classifications, and Allowed Values

Attributes become more powerful when combined with schemas and classifications.

| Feature | How it relates to attributes |
| --- | --- |
| Site schema | Defines required and optional attributes for a site. |
| Classification | Defines required and optional attributes for a document class. |
| Allowed values | Restricts an attribute to approved values. |
| Composite keys | Supports efficient searching across multiple attributes. |
| Localized allowed values | Supports display values in different locales where configured. |

Use schemas when you need consistency. Use classifications when different document types require different metadata rules.

Examples:

- Invoice documents require `invoiceNumber`, `vendor`, and `invoiceDate`.
- Contract documents require `counterparty`, `effectiveDate`, and `renewalDate`.
- Employee records require `employeeId`, `recordType`, and `department`.

For details, see [Schemas](/docs/features/schemas) and [Locales](/docs/features/locales).

## Reserved Attribute Keys

Some attribute keys are reserved for FormKiQ system use. Avoid using these keys for custom business metadata.

| Reserved key | Purpose |
| --- | --- |
| `Classification` | Used for document classification. |
| `Relationships` | Used to manage document relationships. |
| `MalwareScanResult` | Stores malware scan results. |
| `EsignatureDocusignEnvelopeId` | Tracks DocuSign envelope IDs. |
| `EsignatureDocusignStatus` | Tracks DocuSign signature status. |

## Watermark Attributes

`WATERMARK` attributes define watermark settings that can be applied to documents. A watermark can include text, image reference, position, rotation, and scale settings.

Common use cases:

- Add `CONFIDENTIAL` to sensitive records.
- Add `DRAFT` to documents under review.
- Add a company logo or brand mark.
- Apply visual status indicators before external distribution.

Watermark configuration can include:

| Property | Purpose |
| --- | --- |
| `text` | Watermark text to display, such as `CONFIDENTIAL` or `DRAFT`. |
| `rotation` | Rotation angle. |
| `imageDocumentId` | Document ID of an image to use as a watermark. |
| `scale` | Scale behavior, such as `BEST_FIT` or `ORIGINAL`. |
| `position` | Anchor and offset settings for placement. |

Example attribute definition:

```json
{
  "key": "WATERMARK_SETTING",
  "dataType": "WATERMARK",
  "watermark": {
    "text": "CONFIDENTIAL"
  }
}
```

## Best Practices

### Naming

Use clear, stable names that will still make sense as the system grows.

Good examples:

- `invoiceNumber`
- `clientName`
- `projectDeadline`
- `approvalStatus`
- `retentionCategory`

Avoid unclear abbreviations, special characters, and names that are tied too tightly to one year or temporary project.

Use one naming convention consistently. `camelCase` is a practical default for custom attributes. FormKiQ reserved keys use PascalCase, such as `Classification`.

### Data Type Selection

Choose data types based on how the value will be searched, validated, sorted, and reported.

| Need | Recommended type |
| --- | --- |
| Category, status, owner, department, region | `STRING` |
| Amount, score, count, duration, timestamp number | `NUMBER` |
| Yes/no or enabled/disabled state | `BOOLEAN` |
| Presence-only flag | `KEY_ONLY` |
| Document relationship | `RELATIONSHIP` |

For dates, choose a consistent representation before production. ISO 8601 strings are readable, while numeric timestamps can be useful for range queries and reporting.

### Organization

Design attributes as a small data model, not as one-off labels.

Recommended practices:

- Maintain a data dictionary for important attributes.
- Define allowed values for controlled fields such as department, region, document type, and status.
- Use schemas or classifications for required metadata.
- Avoid duplicate meanings, such as both `client` and `customerName` unless the difference is intentional.
- Prefer stable identifiers, such as `customerId`, when names may change.
- Use composite keys when multi-attribute search performance matters.

### Governance

Use controlled attributes for metadata that affects compliance, access, retention, or business process outcomes.

Examples:

- `confidentiality`
- `retentionCategory`
- `legalHold`
- `recordType`
- `owner`
- `approvalStatus`

Review governance attributes before changing names, allowed values, or schema rules because downstream workflows, searches, reports, and access policies may depend on them.

## API Endpoints

Use the generated API reference for exact request and response schemas.

### Attribute Definition Operations

| Operation | Purpose | API reference |
| --- | --- | --- |
| List attributes | Retrieve attribute definitions available for a site. | [`GET /attributes`](/docs/api-reference/get-attributes) |
| Add attribute | Create a new attribute definition. | [`POST /attributes`](/docs/api-reference/add-attribute) |
| Get attribute | Retrieve a specific attribute definition. | [`GET /attributes/{key}`](/docs/api-reference/get-attribute) |
| Update attribute | Update an existing attribute definition. | [`PATCH /attributes/{key}`](/docs/api-reference/update-attribute) |
| Delete attribute | Delete an attribute definition. | [`DELETE /attributes/{key}`](/docs/api-reference/delete-attribute) |
| Get allowed values | Retrieve allowed values for an attribute. | [`GET /attributes/{key}/allowedValues`](/docs/api-reference/get-attribute-allowed-values) |

### Document Attribute Operations

| Operation | Purpose | API reference |
| --- | --- | --- |
| Add document attributes | Add multiple attributes to a document. | [`POST /documents/{documentId}/attributes`](/docs/api-reference/add-document-attributes) |
| Set document attributes | Set or replace document attributes. | [`PUT /documents/{documentId}/attributes`](/docs/api-reference/set-document-attributes) |
| Get document attributes | Retrieve all attributes for a document. | [`GET /documents/{documentId}/attributes`](/docs/api-reference/get-document-attributes) |
| Get document attribute | Retrieve one document attribute by key. | [`GET /documents/{documentId}/attributes/{attributeKey}`](/docs/api-reference/get-document-attribute) |
| Set document attribute value | Set a specific attribute value. | [`PUT /documents/{documentId}/attributes/{attributeKey}/value`](/docs/api-reference/set-document-attribute-value) |
| Delete document attribute | Delete an attribute from a document. | [`DELETE /documents/{documentId}/attributes/{attributeKey}`](/docs/api-reference/delete-document-attribute) |
| Delete document attribute value | Delete one value from a multi-value attribute. | [`DELETE /documents/{documentId}/attributes/{attributeKey}/value`](/docs/api-reference/delete-document-attribute-and-value) |

### Schema and Classification Operations

| Operation | Purpose | API reference |
| --- | --- | --- |
| Get site schema | Retrieve the site schema. | [`GET /sites/{siteId}/schema`](/docs/api-reference/get-sites-schema) |
| Set site schema | Create or update the site schema. | [`PUT /sites/{siteId}/schema`](/docs/api-reference/set-sites-schema) |
| Get schema allowed values | Retrieve schema allowed values for an attribute. | [`GET /sites/{siteId}/schema/document/attributes/{key}/allowedValues`](/docs/api-reference/get-sites-schema-attribute-allowed-values) |
| List classifications | Retrieve site classifications. | [`GET /sites/{siteId}/classifications`](/docs/api-reference/get-sites-classifications) |
| Add classification | Create a classification. | [`POST /sites/{siteId}/classifications`](/docs/api-reference/add-classification) |
| Get classification | Retrieve a classification. | [`GET /sites/{siteId}/classifications/{classificationId}`](/docs/api-reference/get-classification) |
| Set classification | Update a classification. | [`PUT /sites/{siteId}/classifications/{classificationId}`](/docs/api-reference/set-classification) |
| Delete classification | Delete a classification. | [`DELETE /sites/{siteId}/classifications/{classificationId}`](/docs/api-reference/delete-classification) |
| Get classification allowed values | Retrieve allowed values for a classification attribute. | [`GET /sites/{siteId}/classifications/{classificationId}/attributes/{key}/allowedValues`](/docs/api-reference/get-classification-attribute-allowed-values) |

## Where to Go Next

- [Documents](/docs/features/documents)
- [Document Attributes API Tutorial](/docs/tutorials/Documents/document-attributes-api)
- [Schemas](/docs/features/schemas)
- [Search](/docs/features/search)
- [Rulesets](/docs/features/rulesets)
- [Workflows](/docs/features/workflows)
- [Security](/docs/platform/security)
- [Open Policy Agent](/docs/formkiq-modules/modules/open_policy_agent)
