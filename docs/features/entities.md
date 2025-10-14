---
sidebar_position: 6
---
# Entity Type / Entity

## Overview

Entities and Entity Types provide a flexible way to model real-world objects or business records within the FormKiQ platform.  
An **Entity Type** defines a *category or schema* (for example, “Customer,” “Project,” or “Case File”), while an **Entity** represents an *instance* of that type (“Customer ABC Corp,” “Project Apollo,” etc.).

This feature allows applications built on FormKiQ to associate structured data and metadata with documents, users, or external systems — enabling organization, retrieval, and automation.

---

## Key Concepts

| Concept | Description |
|----------|--------------|
| **Entity Type** | A definition that describes a category of entities. Each entity type has a `name`, an optional `namespace` (`CUSTOM` or `PRESET`), and an `entityTypeId`. Entity Types group entities that share similar attributes. |
| **Entity** | A specific instance of an Entity Type. Entities have a `name`, unique `entityId`, and a set of key-value **attributes** (string, number, or boolean types). |
| **Attributes** | Metadata key-value pairs stored under an entity. Attributes can be defined with single or multiple values, and support several data types (`stringValue`, `numberValue`, `booleanValue`, etc.). |
| **Namespace** | Indicates whether the Entity Type is **PRESET** (system-defined) or **CUSTOM** (user-defined). |
| **Relationships to Documents** | Entities can be linked to documents through attributes to represent ownership, categorization, or business context. |


### Preset Entity Types

**Preset Entity Types** are built-in entity types that come standard with the FormKiQ platform.  
They are automatically available and used internally by specific FormKiQ features or modules. These types cannot be deleted, though their entities may be managed like other entities through the API.

| Preset Entity Type | Description | Attributes |
|---------------------|--------------|-------------|
| **LlmPrompt** | Represents prompts used in FormKiQ's LLM integrations or automation workflows. | `UserPrompt` |
| **Checkout** | Tracks documents currently checked out (locked) by a user. | `LockedBy`, `LockedDate` |
| **CheckoutForLegalHold** | Tracks documents that are locked due to an active legal hold. | `LockedBy`, `LockedDate` |

---

**Example Entity**
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

## Common Use Cases

- Customer / Project Tracking
Define entity types like Customer or Project and store relevant details.
  • Case Management

- Manage case files or tickets, each represented as an entity with attributes like status, priority, and assignedUser.
  • Metadata Hub

- Use entities to represent logical groupings for documents (e.g., “Invoice,” “Contract,” “Purchase Order”) and link them with document tags.
  • Integration Layer

- Integrate with external systems (CRM, ERP, etc.) where entities mirror external records, providing a consistent data model for automation.
  • Data Classification

- Data Retention and Compliance
Track entities that represent retention schedules or compliance records.
For example, define an Entity Type called RetentionPolicy with entities describing how long certain document categories (e.g., invoices, contracts, HR files) must be retained.
This enables centralized tracking of retention rules and simplifies automation of document deletion or archiving based on entity attributes like retentionPeriod, effectiveDate, or reviewDate.

## API Endpoints

The Entity API consists of two major resource groups:
/entityTypes for managing entity schemas, and /entities for managing instances.

### Entity Type Endpoints

| Method | Path | Summary | Description |
|--------|---------|-----|-----|
| GET | /entityTypes | Get EntityTypes | Returns a paginated list of existing entity types. Supports next and limit for pagination. |
| POST | /entityTypes | Add New EntityType | Creates a new Entity Type. Requires a JSON body defining the name and optional namespace. |
| GET | /entityTypes/:entityTypeId | Get EntityType | Returns metadata for a single Entity Type. |
| DELETE | /entityTypes/:entityTypeId | Delete EntityType | Deletes a specific Entity Type. |

### Entity Endpoints
| Method | Path | Summary | Description |
|--------|---------|-----|-----|
| GET | /entities/:entityTypeId | Get Entities | Returns a paginated list of entities belonging to a given Entity Type. |
|POST | /entities/:entityTypeId | Add New Entity | Creates a new entity under the specified Entity Type. |
| GET | /entities/:entityTypeId/:entityId | Get Entity | Retrieves a single entity by ID. |
| PATCH | /entities/:entityTypeId/:entityId | Update Entity | Updates an entity’s name or attributes. |
| DELETE | /entities/:entityTypeId/:entityId | Delete Entity | Deletes a specific entity. |

## Summary

The Entity and Entity Type APIs enable a customizable data model in FormKiQ that extends beyond documents — ideal for representing customers, assets, workflows, and other logical objects.

By using these endpoints, developers can dynamically define, query, and manage structured entities as part of broader document and metadata workflows.
