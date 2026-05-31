---
sidebar_position: 6
title: Entity Types and Entities
---

# Entity Types and Entities

## Overview

Entity Types and Entities let you model business objects that exist alongside documents. They are useful when a document needs to be connected to a customer, project, case, asset, policy, prompt, retention rule, or external system record.

An **Entity Type** defines the kind of object you want to manage, such as `Customer`, `Project`, or `Case`. An **Entity** is a specific instance of that type, such as `ACME Corporation`, `Project Apollo`, or `Case 2026-1042`.

Use entities when you need a reusable business record that can be linked to many documents or used across multiple workflows.

## Entity Types vs Entities

| Concept | Description | Example |
| --- | --- | --- |
| Entity Type | Defines a category of related entities. | `Customer` |
| Entity | A specific record that belongs to an entity type. | `ACME Corporation` |
| Entity attributes | Structured values stored on the entity record. | `region = North America` |
| Document link | A document attribute that points to an entity. | Invoice document linked to customer `ACME Corporation` |

Example entity:

```json
{
  "entityTypeId": "customers",
  "entityId": "cust-12345",
  "name": "ACME Corporation",
  "attributes": [
    { "key": "industry", "stringValue": "Manufacturing" },
    { "key": "employees", "numberValue": 350 },
    { "key": "active", "booleanValue": true }
  ]
}
```

## When to Use Entities

Use entities when the data represents a real business object, system object, or reusable record.

| Use entities when | Use document attributes when |
| --- | --- |
| The value has its own identity and lifecycle. | The value only describes one document. |
| Multiple documents should point to the same record. | The value is simple metadata such as status or department. |
| The record has attributes of its own. | The value does not need its own structured record. |
| You need to mirror records from another system, such as CRM, ERP, or case management. | You only need filtering, search, or workflow routing on a document. |
| Users need to browse or manage the object independently from documents. | Users only need to see the value on the document. |

Examples:

- Use a `Customer` entity when many invoices, contracts, support records, and onboarding documents belong to the same customer.
- Use a `Project` entity when documents, workflows, and reports should all reference the same project.
- Use a `Case` entity when evidence, correspondence, decisions, and generated documents need to be grouped around a case record.
- Use a `RetentionPolicy` entity when document categories need to reference centrally managed retention rules.

## Entities vs Attributes

Entities and attributes work together, but they solve different problems.

| Feature | Attributes | Entities |
| --- | --- | --- |
| Primary purpose | Describe a document or entity with structured metadata. | Model reusable business records. |
| Scope | Stored directly on a document or entity. | Managed as a separate record under an entity type. |
| Best for | `status`, `department`, `documentType`, `invoiceDate`. | `Customer`, `Project`, `Case`, `Asset`, `RetentionPolicy`. |
| Reuse | Repeated values can exist on many documents. | One entity can be referenced by many documents. |
| Lifecycle | Usually changes with the document. | Can be managed independently from documents. |

For attribute details, see [Attributes](/docs/features/attributes).

## Namespaces: CUSTOM and PRESET

Entity types have a namespace that indicates whether they are customer-defined or FormKiQ-defined.

| Namespace | Purpose |
| --- | --- |
| `CUSTOM` | Entity types created for your business model, integrations, or application needs. |
| `PRESET` | Entity types used by FormKiQ features or modules. |

Most application-specific models should use `CUSTOM`. Use `PRESET` when working with entity types that FormKiQ expects for a platform feature or module.

## Preset Entity Types

Preset Entity Types are built-in entity types used by FormKiQ features or modules. They are available for platform-defined behavior and should not be treated as general-purpose custom types.

| Preset Entity Type | Description | Common attributes |
| --- | --- | --- |
| `LlmPrompt` | Represents prompts used by LLM integrations or automation workflows. | `UserPrompt` |
| `Checkout` | Tracks documents checked out or locked by a user. | `LockedBy`, `LockedDate` |
| `CheckoutForLegalHold` | Tracks documents locked due to an active legal hold. | `LockedBy`, `LockedDate` |

Preset entity types cannot be deleted like normal custom modeling choices. Their entities may still be managed through supported API operations where applicable.

## Linking Entities to Documents

Entities can be linked to documents through document attributes. This keeps the document record lightweight while allowing it to reference a reusable business object.

Example document-to-entity links:

| Document | Linked entity |
| --- | --- |
| `invoice-1042.pdf` | Customer entity `ACME Corporation` |
| `project-plan.docx` | Project entity `Project Apollo` |
| `evidence-photo.jpg` | Case entity `Case 2026-1042` |
| `policy-update.pdf` | RetentionPolicy entity `Financial Records - 7 Years` |

This pattern is useful when:

- Many documents need to reference the same object.
- The linked object has its own metadata.
- External systems use stable IDs that should be preserved.
- Reporting needs to group documents by customer, case, project, or asset.

For a walkthrough, see [Entity Types, Entities, and Documents](/docs/tutorials/Entities/entity-api).

## Common Use Cases

### Customer and Account Records

Create a `Customer` entity type and one entity for each customer. Link contracts, invoices, onboarding documents, support files, and correspondence to the customer entity.

Useful attributes:

- `customerNumber`
- `region`
- `industry`
- `accountOwner`
- `active`

### Project Tracking

Create a `Project` entity type for project-based document organization. Link project plans, statements of work, deliverables, meeting notes, and approvals to the project.

Useful attributes:

- `projectCode`
- `projectManager`
- `status`
- `startDate`
- `endDate`

### Case Management

Create a `Case` entity type for legal, compliance, support, insurance, HR, or operational case files. Link evidence, forms, correspondence, generated documents, and decisions to the case.

Useful attributes:

- `caseNumber`
- `priority`
- `assignedUser`
- `status`
- `openedDate`

### External System Integration

Use entities to mirror records from CRM, ERP, HRIS, ticketing, case management, or line-of-business systems. Store the external ID on the entity and link documents back to it.

Useful attributes:

- `externalSystem`
- `externalId`
- `syncStatus`
- `lastSyncedDate`

### Retention and Compliance

Create a `RetentionPolicy` entity type for retention schedules or compliance rules. Link documents or document categories to the relevant policy entity.

Useful attributes:

- `retentionPeriod`
- `effectiveDate`
- `reviewDate`
- `dispositionAction`
- `legalHoldEligible`

## Modeling Best Practices

### Start with the Business Object

Create an entity type only when the object has meaning outside a single document. Good candidates include customers, projects, assets, cases, vendors, employees, prompts, and retention policies.

### Use Stable Identifiers

Use stable identifiers from source systems when possible. Names can change, but IDs should remain durable.

Examples:

- `customerNumber`
- `projectCode`
- `caseNumber`
- `externalId`

### Keep Entity Attributes Focused

Entity attributes should describe the entity itself. Document-specific state should stay on the document.

Example:

| Belongs on entity | Belongs on document |
| --- | --- |
| Customer region | Document approval status |
| Customer account owner | Document confidentiality level |
| Project code | Document OCR status |
| Case priority | Document retention hold flag |

### Avoid Recreating a Full Database

Entities are useful for document-centered business records, but they should not replace every operational database in an application. Keep the entity model focused on records that need to connect to documents, workflows, search, or FormKiQ reporting.

### Plan for Reporting and Search

Choose entity types and attributes that make reporting easier:

- Documents by customer
- Documents by project
- Cases by status
- Records by retention policy
- Documents linked to an external system record

For reporting patterns, see [Reporting, Analytics, and Audit](/docs/platform/reporting-and-analytics).

## API Operations

Use the generated API reference for exact request and response schemas.

### Entity Type Operations

| Operation | Purpose | API reference |
| --- | --- | --- |
| List entity types | Retrieve entity types available in a site. | [`GET /entityTypes`](/docs/api-reference/get-entity-types) |
| Add entity type | Create a new entity type. | [`POST /entityTypes`](/docs/api-reference/add-entity-type) |
| Get entity type | Retrieve one entity type by ID. | [`GET /entityTypes/{entityTypeId}`](/docs/api-reference/get-entity-type) |
| Delete entity type | Delete an entity type. | [`DELETE /entityTypes/{entityTypeId}`](/docs/api-reference/delete-entity-type) |

### Entity Operations

| Operation | Purpose | API reference |
| --- | --- | --- |
| List entities | Retrieve entities for an entity type. | [`GET /entities/{entityTypeId}`](/docs/api-reference/get-entities) |
| Add entity | Create a new entity under an entity type. | [`POST /entities/{entityTypeId}`](/docs/api-reference/add-entity) |
| Get entity | Retrieve one entity by ID. | [`GET /entities/{entityTypeId}/{entityId}`](/docs/api-reference/get-entity) |
| Update entity | Update an entity's name or attributes. | [`PATCH /entities/{entityTypeId}/{entityId}`](/docs/api-reference/update-entity) |
| Delete entity | Delete an entity. | [`DELETE /entities/{entityTypeId}/{entityId}`](/docs/api-reference/delete-entity) |

## Where to Go Next

- [Entity Types, Entities, and Documents Tutorial](/docs/tutorials/Entities/entity-api)
- [Documents](/docs/features/documents)
- [Attributes](/docs/features/attributes)
- [Schemas](/docs/features/schemas)
- [Search](/docs/features/search)
- [Workflows](/docs/features/workflows)
- [Reporting, Analytics, and Audit](/docs/platform/reporting-and-analytics)
- [DynamoDB Schema](/docs/platform/database_schema)
