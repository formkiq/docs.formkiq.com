---
sidebar_position: 20
title: Rulesets
---

# Rulesets

## Overview

Rulesets are FormKiQ's conditional routing layer for document automation. A ruleset contains one or more rules. Each rule checks document conditions and, when matched, routes the document to a workflow.

Use rulesets when you want FormKiQ to decide which workflow should process a document based on its content type, text, barcode data, form fields, or attributes.

Examples:

- Route PDFs to a PDF processing workflow.
- Route documents with `department = Finance` to a finance review workflow.
- Route invoices detected by text matching to an invoice approval workflow.
- Route documents with a specific barcode prefix to a shipping workflow.

## Where Rulesets Fit

Rulesets sit between document ingestion and workflow execution.

| Step | What happens |
| --- | --- |
| 1. Document enters FormKiQ | A document is uploaded, updated, imported, or processed. |
| 2. Rulesets evaluate conditions | Active rulesets and rules check document criteria. |
| 3. Matching rule selects a workflow | A rule points to a `workflowId`. |
| 4. Workflow runs | The workflow defines the processing, queue, approval, mapping, notification, or automation steps. |

Rulesets decide **whether a workflow should run**. Workflows define **what happens after routing**.

For workflow details, see [Workflows](/docs/features/workflows).

## Rulesets vs Workflows

| Concept | Purpose |
| --- | --- |
| Ruleset | Groups related routing rules and controls priority, version, and active status. |
| Rule | Defines conditions and the target workflow. |
| Workflow | Defines the processing or review steps that happen after a rule matches. |
| Queue | Holds documents that require human or system review as part of a workflow. |

Example:

- A ruleset evaluates incoming documents.
- A rule detects `CONTENT_TYPE = application/pdf`.
- The rule routes matching documents to a PDF processing workflow.
- The workflow runs OCR, mapping, review, or other configured steps.

## Ruleset and Rule Model

### Ruleset

A ruleset provides the container and top-level priority for related rules.

```json
{
  "ruleset": {
    "description": "PDF document routing",
    "priority": 1,
    "version": 1,
    "status": "ACTIVE"
  }
}
```

| Field | Purpose |
| --- | --- |
| `description` | Human-readable description of the ruleset. |
| `priority` | Ruleset priority. Lower numbers are evaluated first. |
| `version` | Version number for tracking changes. |
| `status` | `ACTIVE` or `INACTIVE`. |

### Rule

A rule contains the match conditions and target workflow.

```json
{
  "rule": {
    "priority": 1,
    "description": "Route PDFs",
    "workflowId": "pdf-workflow",
    "status": "ACTIVE",
    "conditions": {
      "must": [
        {
          "criterion": "CONTENT_TYPE",
          "value": "application/pdf",
          "operation": "EQ"
        }
      ]
    }
  }
}
```

| Field | Purpose |
| --- | --- |
| `priority` | Rule priority within the ruleset. Lower numbers are evaluated first. |
| `description` | Human-readable description of the rule. |
| `workflowId` | Workflow to run when the rule matches. |
| `status` | `ACTIVE` or `INACTIVE`. |
| `conditions` | Match logic for the rule. |

## Conditions and Operations

Rules use criteria and operations to decide whether a document matches.

### Criteria

| Criterion | Use for | Supporting fields |
| --- | --- | --- |
| `CONTENT_TYPE` | Match the document content type. | `value`, `operation` |
| `TEXT` | Match extracted or available text content. | `value`, `operation` |
| `BARCODE` | Match barcode content. | `value`, `operation` |
| `FIELD` | Match a named field extracted from a document. | `fieldName`, `value`, `operation` |
| `ATTRIBUTE` | Match a document attribute value. | `attributeKey`, `value`, `operation` |

### Operations

The current generated API schema lists these operations:

| Operation | Behavior |
| --- | --- |
| `EQ` | The value must equal the configured value. |
| `CONTAINS` | The value must contain the configured value. |

Avoid documenting or relying on comparison operations such as greater-than or less-than unless your installed FormKiQ version explicitly supports them.

## Priority and Matching Behavior

Ruleset and rule priorities help control evaluation order.

Recommended approach:

- Give more specific rules a higher priority by using lower priority numbers.
- Put broad fallback rules later.
- Keep overlapping rules intentional and documented.
- Use `INACTIVE` when testing or retiring rules instead of deleting immediately.
- Increment `version` when changing production rulesets.

Example ordering:

| Priority | Rule |
| --- | --- |
| 1 | Route invoices with `department = Finance`. |
| 2 | Route all other invoices. |
| 10 | Route all PDFs to general PDF processing. |

## Practical Examples

### Route PDFs by Content Type

```json
{
  "rule": {
    "priority": 1,
    "description": "Route PDFs to PDF processing",
    "workflowId": "pdf-processing-workflow",
    "status": "ACTIVE",
    "conditions": {
      "must": [
        {
          "criterion": "CONTENT_TYPE",
          "value": "application/pdf",
          "operation": "EQ"
        }
      ]
    }
  }
}
```

### Route Invoices by Text

```json
{
  "rule": {
    "priority": 2,
    "description": "Route documents containing invoice text",
    "workflowId": "invoice-review-workflow",
    "status": "ACTIVE",
    "conditions": {
      "must": [
        {
          "criterion": "TEXT",
          "value": "INVOICE",
          "operation": "CONTAINS"
        }
      ]
    }
  }
}
```

### Route by Document Attribute

Use `ATTRIBUTE` when mappings, users, or integrations already added structured metadata to the document.

```json
{
  "rule": {
    "priority": 1,
    "description": "Route finance documents",
    "workflowId": "finance-review-workflow",
    "status": "ACTIVE",
    "conditions": {
      "must": [
        {
          "criterion": "ATTRIBUTE",
          "attributeKey": "department",
          "value": "Finance",
          "operation": "EQ"
        }
      ]
    }
  }
}
```

### Route Shipping Documents by Barcode

```json
{
  "rule": {
    "priority": 3,
    "description": "Route international shipping documents",
    "workflowId": "international-shipping-workflow",
    "status": "ACTIVE",
    "conditions": {
      "must": [
        {
          "criterion": "BARCODE",
          "value": "INT-",
          "operation": "CONTAINS"
        }
      ]
    }
  }
}
```

## Common Use Cases

### Document Routing

Route documents to different workflows based on content type, text, barcode, field, or attribute values.

### Approval Processes

Route documents to approval workflows after classification or metadata extraction.

### Post-OCR Automation

Use OCR and mappings to create document attributes, then use rulesets to route documents based on those attributes.

### Department Queues

Route documents to department-specific queues such as Finance, Legal, HR, or Operations.

### Compliance Review

Route documents with sensitive classifications, retention categories, or governance attributes to review workflows.

## Best Practices

### Keep Rules Focused

Each rule should express one routing decision. If a rule becomes difficult to explain, split it into smaller rules.

### Prefer Attributes for Business Logic

Use `ATTRIBUTE` criteria when the routing decision depends on business metadata. This is more stable than relying on raw text matching.

Examples:

- `documentType = invoice`
- `department = Finance`
- `confidentiality = Restricted`
- `sourceSystem = email-ingest`

### Use Text Matching Carefully

Text matching can be useful, but OCR and extracted text can vary. For production routing, consider using OCR plus mappings to set attributes first, then route by attributes.

### Control Priority Explicitly

Document your priority scheme. Use lower numbers for more specific rules and higher numbers for broad fallback rules.

### Test with Real Documents

Test rulesets with representative files:

- PDFs and non-PDFs
- OCR-generated text
- Missing attributes
- Multiple matching rules
- Documents that should not match any rule

### Review and Version Changes

Treat rulesets as production automation logic. Review them before changes, keep descriptions current, and use the `version` field to track meaningful updates.

## API Operations

Use the generated API reference for exact request and response schemas.

### Ruleset Operations

| Operation | Purpose | API reference |
| --- | --- | --- |
| List rulesets | Retrieve rulesets for a site. | [`GET /rulesets`](/docs/api-reference/get-rulesets) |
| Add ruleset | Create a new ruleset. | [`POST /rulesets`](/docs/api-reference/add-ruleset) |
| Get ruleset | Retrieve a ruleset by ID. | [`GET /rulesets/{rulesetId}`](/docs/api-reference/get-ruleset) |
| Update ruleset | Update a ruleset. | [`PATCH /rulesets/{rulesetId}`](/docs/api-reference/update-ruleset) |
| Delete ruleset | Delete a ruleset. | [`DELETE /rulesets/{rulesetId}`](/docs/api-reference/delete-ruleset) |

### Rule Operations

| Operation | Purpose | API reference |
| --- | --- | --- |
| List rules | Retrieve rules in a ruleset. | [`GET /rulesets/{rulesetId}/rules`](/docs/api-reference/get-rules) |
| Add rule | Add a rule to a ruleset. | [`POST /rulesets/{rulesetId}/rules`](/docs/api-reference/add-rule) |
| Get rule | Retrieve a rule by ID. | [`GET /rulesets/{rulesetId}/rules/{ruleId}`](/docs/api-reference/get-rule) |
| Update rule | Update a rule. | [`PATCH /rulesets/{rulesetId}/rules/{ruleId}`](/docs/api-reference/update-rule) |
| Delete rule | Delete a rule. | [`DELETE /rulesets/{rulesetId}/rules/{ruleId}`](/docs/api-reference/delete-rule) |

### Related Workflow Operations

| Operation | Purpose | API reference |
| --- | --- | --- |
| List workflows | Find workflows that rules can route to. | [`GET /workflows`](/docs/api-reference/get-workflows) |
| Add workflow | Create a workflow target for rules. | [`POST /workflows`](/docs/api-reference/add-workflow) |
| Get workflow documents | Review documents routed to a workflow. | [`GET /workflows/{workflowId}/documents`](/docs/api-reference/get-workflow-documents) |
| Get queue documents | Review documents in a workflow queue. | [`GET /queues/{queueId}/documents`](/docs/api-reference/get-workflow-queue-documents) |

## Where to Go Next

- [Ruleset Tutorial](/docs/tutorials/ruleset)
- [Workflows](/docs/features/workflows)
- [Documents](/docs/features/documents)
- [Attributes](/docs/features/attributes)
- [Mappings](/docs/features/mappings)
- [OCR](/docs/features/ocr)
- [DynamoDB Schema](/docs/platform/database_schema#rulesets)
