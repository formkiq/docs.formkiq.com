---
sidebar_position: 20
---

# Rulesets

The Rulesets feature in FormKiQ allows for the creation and management of rules that define specific conditions and workflows for document processing. This feature is essential for automating tasks, ensuring compliance, and enforcing business logic within the system.

Rulesets and rules work together to create a structured and prioritized system for managing document processing. By defining clear conditions and workflows, FormKiQ can automate complex processes and ensure that documents are handled according to predefined business rules.

## Ruleset

A ruleset is a collection of rules, each with its own conditions and actions. Rulesets help organize and prioritize rules to ensure that the most critical conditions are checked and processed first.

  - **Parameters:**
    - **description**: A string providing a brief description of the ruleset.
    - **priority**: An integer representing the priority of the ruleset. Lower numbers indicate higher priority.
    - **version**: An integer representing the version of the ruleset.
    - **status**: The status of the ruleset. Possible values are `ACTIVE` and `INACTIVE`.


## Rule

Rules within a ruleset define specific conditions that must be met and the corresponding workflow to be executed if those conditions are satisfied.

  - **Parameters:**
    - **priority**: An integer representing the priority of the rule within the ruleset. Lower numbers indicate higher priority.
    - **description**: A string providing a brief description of the rule.
    - **workflowId**: A string representing the ID of the workflow to be executed when the rule conditions are met.
    - **status**: The status of the rule. Possible values are `ACTIVE` and `INACTIVE`.
    - **conditions**: An object defining the conditions that must be met for the rule to be executed.

## Rule Conditions

Conditions are defined by the criteria that must be met. Each condition includes the following properties:

  - **Parameters:**
    - **must**: An array of condition objects that must all be satisfied for the rule to trigger.
      - **criterion**: The type of criterion to be checked. Possible values are `TEXT`, `CONTENT_TYPE`, `BARCODE`, `FIELD`.
      - **fieldName**: A string representing the name of the field to be checked.
      - **value**: A string representing the value to be checked against the field.
      - **operation**: The operation to be used for comparison. Possible values are `EQ` (equal) and `CONTAINS`.

## Examples

Below are examples of Rulesets and Rules.

### Example Ruleset JSON

```json
{
  "ruleset": {
    "description": "Document Processing Ruleset",
    "priority": 1,
    "version": 1,
    "status": "ACTIVE"
  }
}
```

### Example Rule JSON

```json
{
  "rule": {
    "priority": 1,
    "description": "Check for specific content type",
    "workflowId": "workflow123",
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
