---
sidebar_position: 30
---

# Workflows

## Overview

Workflows define repeatable document processing and review steps in FormKiQ. A workflow can run automated document actions, send a document to a review queue, wait for an approval decision, and then continue to the next step.

Workflows are available as an add-on module. If the workflow API endpoints are not available in your deployment, confirm that the workflow module is included in your FormKiQ edition and installation.

Use workflows when a document needs a controlled process after ingestion, such as:

- Running antivirus, OCR, full-text indexing, IDP, or data classification
- Sending a document to a human review queue
- Capturing approve or reject decisions
- Running notifications, webhooks, EventBridge events, publishing, or PDF export
- Coordinating document processing steps that should happen in a specific order

## Workflows vs Rulesets, Actions, and Queues

| Concept | What it does | Example |
| --- | --- | --- |
| Workflow | Defines the ordered steps a document should move through. | Scan, OCR, review, notify. |
| Workflow step | Defines one action or review point in the workflow. | Run `OCR` or wait in an approval queue. |
| Document action | Runs automated processing against a document. | `ANTIVIRUS`, `OCR`, `FULLTEXT`, `WEBHOOK`, `IDP`. |
| Queue | Holds documents that require review or approval. | Finance approval queue. |
| Decision | Moves a queued document to the next step. | `APPROVE` sends to publish; `REJECT` sends to correction. |
| Ruleset | Decides which workflow should receive a document. | Route invoices to an invoice approval workflow. |

Rulesets decide **whether a workflow should run**. Workflows define **what happens after the document enters the process**.

For routing details, see [Rulesets](/docs/features/rulesets). For action details, see [Documents: Document Actions](/docs/features/documents#document-actions).

## Structure

### Basic Workflow Components

Create workflows with a direct workflow object. The request body is not wrapped in a top-level `workflow` property.

```json
{
  "name": "Invoice Review",
  "description": "Scan, extract, and approve incoming invoices",
  "status": "ACTIVE",
  "steps": []
}
```

| Component | Required | Description |
| --- | --- | --- |
| `name` | Yes | Human-readable workflow name. |
| `description` | No | Purpose, owner, or notes for the workflow. |
| `status` | Yes | `ACTIVE` or `INACTIVE`. |
| `steps` | Yes | Ordered list of workflow steps. |

### Workflow Lifecycle

| Stage | What happens | API operation |
| --- | --- | --- |
| Create queues | Create queues for review steps that need human decisions. | [`POST /queues`](/docs/api-reference/add-queue) |
| Create workflow | Define automated and queue-based steps. | [`POST /workflows`](/docs/api-reference/add-workflow) |
| Attach workflow to document | Start the workflow for a specific document. | [`POST /documents/{documentId}/workflows`](/docs/api-reference/add-document-workflow) |
| Review queued documents | Find documents waiting in a workflow queue. | [`GET /queues/{queueId}/documents`](/docs/api-reference/get-workflow-queue-documents) |
| Submit decision | Approve or reject a queued workflow step. | [`POST /documents/{documentId}/workflow/{workflowId}/decisions`](/docs/api-reference/add-document-workflow-decisions) |
| Monitor workflow | Check workflow or document workflow status. | [`GET /documents/{documentId}/workflows`](/docs/api-reference/get-document-workflows) |

## Workflow Steps

Each step should represent one clear unit of work. Most workflow steps are either action-based or queue-based.

### Action-based Step

Action-based steps run a document action.

```json
{
  "stepId": "scan-document",
  "action": {
    "type": "ANTIVIRUS"
  }
}
```

Common workflow action types include:

| Action type | Use for |
| --- | --- |
| `ANTIVIRUS` | Scan uploaded content before review or publishing. |
| `OCR` | Extract text and structured data from scanned files. |
| `FULLTEXT` | Add document content to a search backend. |
| `DOCUMENTTAGGING` | Generate tags with a configured tagging engine. |
| `IDP` | Run intelligent document processing. |
| `DATA_CLASSIFICATION` | Classify document data using configured prompts or classification logic. |
| `MALWARE_SCAN` | Run malware scanning where configured. |
| `WEBHOOK` | Notify an external system. |
| `EVENTBRIDGE` | Publish an event to an EventBridge bus. |
| `NOTIFICATION` | Send a notification such as email. |
| `PUBLISH` | Publish a document to a configured destination. |
| `PDFEXPORT` | Export or generate PDF output. |
| `RESIZE` | Resize image-based content. |

### Queue-based Step

Queue-based steps place the document into a queue for human or system review. The queue defines where the document waits, and `approvalGroups` identifies the groups expected to make decisions.

```json
{
  "stepId": "manager-review",
  "queue": {
    "queueId": "manager-approval-queue",
    "approvalGroups": ["managers"]
  },
  "decisions": [
    {
      "type": "APPROVE",
      "nextStepId": "publish-document"
    },
    {
      "type": "REJECT",
      "nextStepId": "rework-document"
    }
  ]
}
```

Access to queue documents depends on the deployment's authentication and authorization configuration. Treat `approvalGroups` as workflow routing and review metadata, and confirm permissions in the deployed environment.

## Step Components

### Step ID

`stepId` identifies a step inside the workflow.

Use stable, readable IDs such as:

- `scan-document`
- `extract-text`
- `manager-review`
- `publish-document`

Readable step IDs make decisions, audit trails, and troubleshooting easier than generated IDs.

### Action

An action step references a document action and optional parameters.

```json
{
  "stepId": "extract-text",
  "action": {
    "type": "OCR",
    "parameters": {
      "ocrEngine": "TEXTRACT",
      "ocrParseTypes": "TEXT,FORMS"
    }
  }
}
```

Use action steps for automated processing that does not require a human decision.

### Queue

A queue step pauses the workflow until a decision is submitted.

```json
{
  "stepId": "finance-review",
  "queue": {
    "queueId": "finance-approval-queue",
    "approvalGroups": ["finance-approvers"]
  }
}
```

Use queue steps for approvals, exception handling, manual data review, compliance checks, or operational triage.

### Decisions

Decisions are used with queue steps. FormKiQ supports:

- `APPROVE`
- `REJECT`

Each decision can point to a `nextStepId`.

```json
{
  "decision": "APPROVE",
  "stepId": "finance-review",
  "comments": "Approved for payment"
}
```

If a queue step has multiple decision paths, make sure each `nextStepId` exists in the workflow. A missing or incorrect `nextStepId` can prevent the document from moving through the expected process.

## Practical Examples

### 1. Document Approval Workflow

This workflow scans a document, sends it to manager review, and then either publishes the document or sends a rejection notification.

```json
{
  "name": "Document Approval Process",
  "description": "Scan and route documents for approval",
  "status": "ACTIVE",
  "steps": [
    {
      "stepId": "scan-document",
      "action": {
        "type": "ANTIVIRUS"
      }
    },
    {
      "stepId": "manager-review",
      "queue": {
        "queueId": "manager-approval-queue",
        "approvalGroups": ["managers"]
      },
      "decisions": [
        {
          "type": "APPROVE",
          "nextStepId": "publish-document"
        },
        {
          "type": "REJECT",
          "nextStepId": "send-rejection-notice"
        }
      ]
    },
    {
      "stepId": "publish-document",
      "action": {
        "type": "PUBLISH"
      }
    },
    {
      "stepId": "send-rejection-notice",
      "action": {
        "type": "NOTIFICATION",
        "parameters": {
          "notificationType": "email",
          "notificationSubject": "Document Rejected",
          "notificationText": "The document was rejected during review."
        }
      }
    }
  ]
}
```

### 2. Document Processing Workflow

This workflow extracts text, indexes it for search, and notifies another system through EventBridge.

```json
{
  "name": "Automated Document Processing",
  "description": "Extract searchable content and publish a processing event",
  "status": "ACTIVE",
  "steps": [
    {
      "stepId": "extract-text",
      "action": {
        "type": "OCR",
        "parameters": {
          "ocrEngine": "TEXTRACT",
          "ocrParseTypes": "TEXT,FORMS"
        }
      }
    },
    {
      "stepId": "index-fulltext",
      "action": {
        "type": "FULLTEXT",
        "parameters": {
          "characterMax": "-1"
        }
      }
    },
    {
      "stepId": "publish-processing-event",
      "action": {
        "type": "EVENTBRIDGE",
        "parameters": {
          "eventBusName": "default"
        }
      }
    }
  ]
}
```

## Starting a Workflow for a Document

After a workflow is created, attach it to a document.

```json
{
  "workflowId": "invoice-review-workflow"
}
```

Workflows can be started explicitly through the document workflow API or indirectly when a ruleset routes a matching document to a workflow.

## Monitoring Workflow Progress

Use workflow and queue APIs to monitor progress:

- List configured workflows.
- List documents currently associated with a workflow.
- List documents waiting in a queue.
- Check the current workflow step for a document.
- Review failed or stalled document actions associated with workflow steps.

Document workflow status values include:

| Status | Meaning |
| --- | --- |
| `IN_PROGRESS` | The document is currently moving through the workflow or waiting at a step. |
| `COMPLETE` | The document completed the workflow. |
| `FAILED` | A workflow step failed or the document could not continue. |

## Best Practices

### Step Design

- Keep each step focused on one action or review point.
- Use readable `stepId` values.
- Make every decision path explicit.
- Confirm every `nextStepId` points to an existing step.
- Avoid unnecessary branching in the first version of a workflow.

### Queue Configuration

- Create separate queues for different review responsibilities.
- Use clear queue names such as `Finance Approval` or `Legal Review`.
- Align `approvalGroups` with the groups used by your authentication and authorization model.
- Decide how rejected documents should be handled before going live.

### Action Configuration

- Use valid action type and parameter values from the API reference.
- Test OCR, IDP, full-text, and notification settings with representative documents.
- Keep cost-sensitive actions, such as OCR and full-text indexing, scoped to documents that need them.
- Monitor action failures and retry behavior.

### Workflow Management

- Create new workflows as `INACTIVE` while testing.
- Activate workflows only after queues, permissions, rulesets, and downstream integrations are ready.
- Treat workflow changes as production process changes.
- Re-test rulesets after changing workflow IDs or step IDs.
- Keep old workflows available until active documents have completed them.

## Common Use Cases

### Document Approval

- Multi-level document reviews
- Department approvals
- Exception review queues
- Approval or rejection notifications

### Document Processing

- Antivirus or malware scanning
- OCR and text extraction
- Full-text indexing
- IDP and data classification
- Webhooks or EventBridge events for downstream systems

### Compliance Workflows

- Required review before publication
- Controlled approval trails
- Sensitive document handling
- Manual review for failed automation

## Troubleshooting

### Workflow Does Not Start

Confirm the workflow exists, is `ACTIVE`, and is available in the same `siteId`. If a ruleset should start the workflow, confirm the ruleset is active and its conditions match the document.

### Document Is Stuck in a Queue

Confirm the queue exists, the document is waiting in the expected queue, and the reviewer is allowed to submit a decision. Also confirm that the submitted decision includes the correct workflow and document identifiers.

### Document Does Not Move to the Next Step

Check that the queue step includes a matching decision type and that the `nextStepId` exists. Review document actions for failures if the next step is automated.

### Automated Step Failed

Review the document actions associated with the document and workflow step. Validate action parameters, module availability, service permissions, and any downstream integration endpoint.

## API Integration

| Operation | Use for |
| --- | --- |
| [`GET /workflows`](/docs/api-reference/get-workflows) | List workflows. |
| [`POST /workflows`](/docs/api-reference/add-workflow) | Create a workflow. |
| [`GET /workflows/{workflowId}`](/docs/api-reference/get-workflow) | Get workflow configuration. |
| [`PUT /workflows/{workflowId}`](/docs/api-reference/set-workflow) | Replace workflow configuration. |
| [`PATCH /workflows/{workflowId}`](/docs/api-reference/update-workflow) | Update workflow configuration. |
| [`DELETE /workflows/{workflowId}`](/docs/api-reference/delete-workflow) | Delete a workflow. |
| [`POST /queues`](/docs/api-reference/add-queue) | Create a workflow queue. |
| [`GET /queues`](/docs/api-reference/get-queues) | List workflow queues. |
| [`GET /queues/{queueId}/documents`](/docs/api-reference/get-workflow-queue-documents) | List documents waiting in a queue. |
| [`GET /workflows/{workflowId}/documents`](/docs/api-reference/get-workflow-documents) | List documents in a workflow. |
| [`GET /documents/{documentId}/workflows`](/docs/api-reference/get-document-workflows) | List workflows attached to a document. |
| [`POST /documents/{documentId}/workflows`](/docs/api-reference/add-document-workflow) | Start a workflow for a document. |
| [`GET /documents/{documentId}/workflows/{workflowId}`](/docs/api-reference/get-document-workflow) | Get one document workflow. |
| [`POST /documents/{documentId}/workflow/{workflowId}/decisions`](/docs/api-reference/add-document-workflow-decisions) | Submit an approval or rejection decision. |

## Related Pages

- [Rulesets](/docs/features/rulesets)
- [Documents](/docs/features/documents)
- [Document Actions](/docs/features/documents#document-actions)
- [Optical Character Recognition](/docs/features/ocr)
- [Mappings](/docs/features/mappings)
- [Search](/docs/features/search)
