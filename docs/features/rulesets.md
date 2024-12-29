---
sidebar_position: 20
---

# Rulesets

## Overview

The Rulesets feature in FormKiQ serves as a decision-making engine for automated document processing. By defining sets of rules with specific conditions and priorities, organizations can automate workflows, enforce business logic, and ensure compliance standards.

Each ruleset contains individual rules that define specific conditions and corresponding actions. The priority system allows fine-tuning of workflows, ensuring that critical conditions take precedence when multiple rules are applicable.

## Components

### Ruleset Structure

```json
{
  "ruleset": {
    "description": "string",
    "priority": number,
    "version": number,
    "status": "ACTIVE" | "INACTIVE"
  }
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| description | string | No | Brief description of the ruleset's purpose |
| priority | number | Yes | Processing priority (lower = higher priority) |
| version | number | Yes | Ruleset version number |
| status | string | Yes | ACTIVE or INACTIVE |

### Rule Structure

```json
{
  "rule": {
    "priority": number,
    "description": "string",
    "workflowId": "string",
    "status": "ACTIVE" | "INACTIVE",
    "conditions": {
      "must": [
        {
          "criterion": "string",
          "fieldName": "string",
          "value": "string",
          "operation": "string"
        }
      ]
    }
  }
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| priority | number | Yes | Rule priority within ruleset |
| description | string | No | Brief description of the rule |
| workflowId | string | Yes | Associated workflow identifier |
| status | string | Yes | ACTIVE or INACTIVE |
| conditions | object | Yes | Rule conditions object |

## Supported Conditions

| Criterion | Supported Files | Operations | Description |
|-----------|----------------|------------|-------------|
| CONTENT_TYPE | * | EQ, CONTAINS | Match file types |
| TEXT | application/pdf, text/* | EQ, CONTAINS | Search document content |
| BARCODE | application/pdf | EQ, CONTAINS | Process barcode data |
| FIELD | application/pdf | EQ, CONTAINS, GT, GTE, LT, LTE | Extract form fields |

### Operations

| Operation | Description | Example |
|-----------|-------------|---------|
| EQ | Equal to | Match specific values |
| GT | Greater than | Numeric comparisons |
| GTE | Greater than or equal to | Minimum thresholds |
| LT | Less than | Maximum limits |
| LTE | Less than or equal to | Upper thresholds |
| CONTAINS | Partial match | Find keywords in text |

## Practical Examples

### 1. PDF Processing Ruleset
```json
{
  "ruleset": {
    "description": "PDF Document Processing",
    "priority": 1,
    "version": 1,
    "status": "ACTIVE"
  }
}
```

```json
{
  "rule": {
    "priority": 1,
    "description": "Process incoming PDFs",
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

### 2. Invoice Processing Ruleset
```json
{
  "ruleset": {
    "description": "Invoice Processing",
    "priority": 2,
    "version": 1,
    "status": "ACTIVE"
  }
}
```

```json
{
  "rule": {
    "priority": 1,
    "description": "High-value invoice workflow",
    "workflowId": "invoice-approval",
    "status": "ACTIVE",
    "conditions": {
      "must": [
        {
          "criterion": "TEXT",
          "value": "INVOICE",
          "operation": "CONTAINS"
        },
        {
          "criterion": "FIELD",
          "fieldName": "amount",
          "value": "10000",
          "operation": "GTE"
        }
      ]
    }
  }
}
```

### 3. Shipping Document Ruleset
```json
{
  "ruleset": {
    "description": "Shipping Document Processing",
    "priority": 3,
    "version": 1,
    "status": "ACTIVE"
  }
}
```

```json
{
  "rule": {
    "priority": 1,
    "description": "Route international shipments",
    "workflowId": "international-shipping",
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

### Document Classification
- Categorize documents based on content
- Apply metadata based on rules
- Route to appropriate workflows
- Implement content-based policies

### Data Extraction
- Extract key information from forms
- Process invoice data
- Capture barcode information
- Parse structured documents

### Validation and Verification
- Validate document completeness
- Check required fields
- Verify calculations
- Ensure data accuracy

### Compliance
- Flag sensitive information
- Enforce document policies
- Maintain audit trails
- Handle regulatory requirements

### Workflow Automation
- Route based on content
- Trigger approval processes
- Automate document processing
- Manage document lifecycle

## Best Practices

1. **Ruleset Organization**
   - Use clear, descriptive names
   - Maintain consistent priority schemes
   - Document ruleset purposes
   - Version control for changes

2. **Rule Design**
   - Start with specific rules
   - Use appropriate priorities
   - Keep conditions focused
   - Test rule combinations

3. **Performance**
   - Minimize condition complexity
   - Optimize priority ordering
   - Monitor execution times
   - Regular rule cleanup

4. **Maintenance**
   - Regular rule reviews
   - Update documentation
   - Archive unused rules
   - Test rule changes

## Next Steps

For more information about implementing Rulesets:
- [Ruleset Tutorial](/docs/tutorials/ruleset)
- [Ruleset API Reference](/docs/api-reference/get-rulesets)