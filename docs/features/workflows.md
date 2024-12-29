---
sidebar_position: 30
---

# Workflows

## Overview

The Workflow feature in FormKiQ enables automated document processing through configurable sequences of steps. Each workflow can include various actions such as antivirus scanning, tagging, notifications, and approval processes, ensuring consistent and efficient document handling.

## Structure

### Basic Workflow Components
```json
{
  "workflow": {
    "name": "string",
    "description": "string",
    "status": "ACTIVE" | "INACTIVE",
    "steps": []
  }
}
```

| Component | Required | Description |
|-----------|----------|-------------|
| name | Yes | Workflow identifier |
| description | No | Purpose and details |
| status | Yes | ACTIVE or INACTIVE |
| steps | Yes | Array of workflow steps |

## Workflow Steps

Each step must include either an Action or Queue (but not both):

### Action-based Step
```json
{
  "stepId": "123e4567-e89b-12d3-a456-426614174000",
  "action": {
    "type": "ANTIVIRUS",
    "parameters": {
      "parameter1": "value1"
    }
  }
}
```

### Queue-based Step
```json
{
  "stepId": "123e4567-e89b-12d3-a456-426614174001",
  "queue": {
    "queueId": "approval-queue",
    "approvalGroups": ["managers", "admins"]
  },
  "decisions": [
    {
      "type": "APPROVE",
      "nextStepId": "123e4567-e89b-12d3-a456-426614174002"
    }
  ]
}
```

## Step Components

### Step ID
- Unique identifier within the workflow
- Used for step sequencing and decision routing

### Action
- References a [document action](/docs/features/documents#document-actions)
- Performs automated processing
- Cannot be used with Queue

### Queue
- Enables approval workflows
- Restricts access to specific groups
- Cannot be used with Action

### Decisions
- Used with Queue steps
- Determines next step based on approval
- Includes decision type and next step ID

## Practical Examples

### 1. Document Approval Workflow
```json
{
  "workflow": {
    "name": "Document Approval Process",
    "description": "Standard document review and approval workflow",
    "status": "ACTIVE",
    "steps": [
      {
        "stepId": "123e4567-e89b-12d3-a456-426614174000",
        "action": {
          "type": "ANTIVIRUS"
        }
      },
      {
        "stepId": "123e4567-e89b-12d3-a456-426614174001",
        "queue": {
          "queueId": "manager-approval",
          "approvalGroups": ["managers"]
        },
        "decisions": [
          {
            "type": "APPROVE",
            "nextStepId": "123e4567-e89b-12d3-a456-426614174002"
          }
        ]
      },
      {
        "stepId": "123e4567-e89b-12d3-a456-426614174002",
        "queue": {
          "queueId": "final-approval",
          "approvalGroups": ["directors"]
        },
        "decisions": [
          {
            "type": "APPROVE",
            "nextStepId": "123e4567-e89b-12d3-a456-426614174003"
          }
        ]
      },
      {
        "stepId": "123e4567-e89b-12d3-a456-426614174003",
        "action": {
          "type": "NOTIFICATION",
          "parameters": {
            "notificationType": "email",
            "notificationSubject": "Document Approved",
            "notificationText": "Your document has been approved"
          }
        }
      }
    ]
  }
}
```

### 2. Document Processing Workflow
```json
{
  "workflow": {
    "name": "Automated Document Processing",
    "description": "Process and tag incoming documents",
    "status": "ACTIVE",
    "steps": [
      {
        "stepId": "123e4567-e89b-12d3-a456-426614174000",
        "action": {
          "type": "OCR",
          "parameters": {
            "ocrEngine": "textract",
            "ocrParseTypes": ["TEXT", "FORMS"]
          }
        }
      },
      {
        "stepId": "123e4567-e89b-12d3-a456-426614174001",
        "action": {
          "type": "DOCUMENTTAGGING",
          "parameters": {
            "engine": "chatgpt",
            "tags": "category,department,priority"
          }
        }
      }
    ]
  }
}
```

## Best Practices

1. **Step Design**
   - Use clear step IDs
   - Keep steps focused
   - Plan decision paths
   - Document step purposes

2. **Queue Configuration**
   - Define clear approval groups
   - Set appropriate permissions
   - Plan escalation paths
   - Consider timeouts

3. **Action Configuration**
   - Validate parameters
   - Handle failures gracefully
   - Monitor performance
   - Test thoroughly

4. **Workflow Management**
   - Start with INACTIVE status
   - Test before activation
   - Monitor workflow progress
   - Document dependencies

## Common Use Cases

1. **Document Approval**
   - Multi-level reviews
   - Department approvals
   - Conditional routing
   - Notification integration

2. **Document Processing**
   - Automated scanning
   - Content extraction
   - Metadata tagging
   - Format conversion

3. **Compliance Workflows**
   - Required reviews
   - Audit trails
   - Policy enforcement
   - Documentation

## API Integration

For complete API documentation, see [Workflow API Reference](/docs/api-reference/get-workflows).