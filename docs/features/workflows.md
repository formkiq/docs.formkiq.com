---
sidebar_position: 30
---

# Workflows

## Overview

The Workflow feature in the Document Management System (DMS) is designed to provide\ a structured and automated approach to document processing. It allows users to define sequences of steps that documents must pass through, each step involving specific actions such as antivirus scanning, tagging, or notifications. Workflows can be active or inactive, providing flexibility in managing document processing tasks. By defining steps with specific actions and decision points, organizations can ensure that documents are handled consistently, securely, and efficiently, aligning with their operational requirements and compliance standards.

## Workflow Definition

A workflow is defined by its name, description, status, and a series of steps. Each step in the workflow specifies an action and can lead to subsequent steps based on decisions made during the process.

The workflow structure is:

- **Name**: A string representing the name of the workflow.
- **Description**: A string providing a brief description of the workflow's purpose.
- **Status**: Indicates whether the workflow is active (`ACTIVE`) or inactive (`INACTIVE`).
- **Steps**: An array of steps that the document will go through. Each step includes an action and may have associated decisions leading to subsequent steps.

## Workflow Steps

Each step in a workflow has several key components:

### Step ID
- **stepId**: A unique identifier for the step.

### Action

The [document action](/docs/features/documents#document-actions) to be performed at this step.

:::note
Either the `Action` or `Queue` need to be specified but not both
:::


### Queue

Queue allow for an approval step in the workflow and allowing only a certain subset of roles access to approve.

- **Parameters:**
  - **queueId**: A unique identifier for the queue.
  - **approvalGroups**: An array of groups responsible for approving the step.

:::note
Either the `Action` or `Queue` need to be specified but not both
:::

### Decisions

Used in combination with the `Queue` to tell the workflow which is the next step in the process.

- **Parameters:**
  - **type**: The type of decision to be made at this step. (IE: `APPROVE`).
  - **nextStepId**: The ID of the next step to proceed to if the decision is made.
