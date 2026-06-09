---
sidebar_position: 13
slug: /tutorials/solution-patterns/build-document-review-approval-workflow
---

# Build a Document Review and Approval Workflow

## What You Will Build

In this tutorial, you will build a document review workflow that routes newly uploaded PDF documents into an approval queue. A reviewer can inspect the queue, approve or reject the document, and use document activity to confirm what happened.

This workflow combines:

- Document upload
- Queues
- Workflows
- Rulesets
- Workflow decisions
- Activity review

## Before You Begin

Confirm you have:

- A deployed FormKiQ Advanced or Enterprise environment.
- A JWT access token with permission to create queues, workflows, rulesets, and documents. See [Get a JWT Authentication Token](/docs/how-tos/jwt-authentication-token).
- cURL or an API client such as Postman.
- Optional: [jq](https://jqlang.github.io/jq/) for formatting JSON responses.

## Variables Used

| Placeholder | Description |
| --- | --- |
| `HTTP_API_URL` | FormKiQ API endpoint from the CloudFormation stack output, including `https://`. |
| `AUTHORIZATION_TOKEN` | JWT access token used in the `Authorization` header. |
| `SITE_ID` | FormKiQ site ID. Use `default` unless your deployment uses multiple sites. |
| `QUEUE_ID` | Queue ID returned when the review queue is created. |
| `WORKFLOW_ID` | Workflow ID returned when the approval workflow is created. |
| `RULESET_ID` | Ruleset ID returned when the routing ruleset is created. |
| `DOCUMENT_ID` | Document ID returned when the test document is uploaded. |

The examples below use shell variables. Replace the values before running the commands:

```bash
export HTTP_API_URL="https://your-formkiq-api.example.com"
export AUTHORIZATION_TOKEN="your-jwt-access-token"
export SITE_ID="default"
```

## Workflow Overview

1. Create a review queue.
2. Create an approval workflow that points to the queue.
3. Create a ruleset that routes PDF documents into the workflow.
4. Upload a PDF test document.
5. Confirm the document appears in the review queue.
6. Submit an approval decision.
7. Review document activity.

## Step 1: Create a Review Queue

Use `POST /queues` to create a queue for documents requiring review.

```bash
curl -X POST "${HTTP_API_URL}/queues?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invoice Review"
  }'
```

Set `QUEUE_ID` to the returned queue ID.

```bash
export QUEUE_ID="returned-queue-id"
```

## Step 2: Create the Approval Workflow

Use `POST /workflows` to create a workflow with one queue step. The approval group should match the group responsible for reviewing documents.

```bash
curl -X POST "${HTTP_API_URL}/workflows?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Invoice Approval\",
    \"description\": \"Route uploaded invoices to the review team\",
    \"status\": \"ACTIVE\",
    \"steps\": [
      {
        \"stepId\": \"invoice-review-step\",
        \"queue\": {
          \"queueId\": \"${QUEUE_ID}\",
          \"approvalGroups\": [\"document-reviewers\"]
        }
      }
    ]
  }"
```

Set `WORKFLOW_ID` to the returned workflow ID.

```bash
export WORKFLOW_ID="returned-workflow-id"
```

## Step 3: Create a Routing Ruleset

Use `POST /rulesets` to create an active ruleset.

```bash
curl -X POST "${HTTP_API_URL}/rulesets?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "ruleset": {
      "description": "Route PDFs to invoice review",
      "priority": 1,
      "version": 1,
      "status": "ACTIVE"
    }
  }'
```

Set `RULESET_ID` to the returned ruleset ID.

```bash
export RULESET_ID="returned-ruleset-id"
```

## Step 4: Add a Rule to the Ruleset

Use `POST /rulesets/{rulesetId}/rules` to route PDF documents to the approval workflow.

```bash
curl -X POST "${HTTP_API_URL}/rulesets/${RULESET_ID}/rules?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"rule\": {
      \"description\": \"PDF invoice review routing\",
      \"priority\": 1,
      \"workflowId\": \"${WORKFLOW_ID}\",
      \"status\": \"ACTIVE\",
      \"conditions\": {
        \"must\": [
          {
            \"criterion\": \"CONTENT_TYPE\",
            \"value\": \"application/pdf\",
            \"operation\": \"EQ\"
          }
        ]
      }
    }
  }"
```

## Step 5: Upload a Test Document

Use `POST /documents` to create a PDF document that matches the rule.

```bash
curl -X POST "${HTTP_API_URL}/documents?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "approval/invoice-1001.pdf",
    "contentType": "application/pdf",
    "content": "Invoice 1001 requires approval",
    "tags": [
      {
        "key": "reviewRequired",
        "value": "true"
      }
    ]
  }'
```

Set `DOCUMENT_ID` to the returned document ID.

```bash
export DOCUMENT_ID="returned-document-id"
```

## Step 6: Check the Review Queue

Ruleset processing is asynchronous. Wait several seconds, then use `GET /queues/{queueId}/documents` to inspect the queue.

```bash
curl -X GET "${HTTP_API_URL}/queues/${QUEUE_ID}/documents?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

The uploaded document should appear in the queue.

## Step 7: Submit an Approval Decision

Use `POST /documents/{documentId}/workflow/{workflowId}/decisions` to approve or reject the document.

```bash
curl -X POST "${HTTP_API_URL}/documents/${DOCUMENT_ID}/workflow/${WORKFLOW_ID}/decisions?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"queueId\": \"${QUEUE_ID}\",
    \"stepId\": \"invoice-review-step\",
    \"decision\": \"APPROVE\",
    \"comments\": \"Approved for processing\"
  }"
```

Use `REJECT` instead of `APPROVE` when the document should not proceed.

## Step 8: Review Document Activity

Use `GET /documents/{documentId}/userActivities` to review activity for the document.

```bash
curl -X GET "${HTTP_API_URL}/documents/${DOCUMENT_ID}/userActivities?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

## Verify the Result

Confirm that:

- The queue exists.
- The workflow is active and references the queue.
- The ruleset and rule are active.
- The PDF document appears in the review queue.
- The approval decision is recorded on the document activity.

## Clean Up

Delete the test document, ruleset, workflow, and queue if they are no longer needed.

```bash
curl -X DELETE "${HTTP_API_URL}/documents/${DOCUMENT_ID}?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

Use the API reference to delete the ruleset, workflow, and queue once you have confirmed they are only test resources.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| Document does not enter the queue | Ruleset processing is asynchronous or the rule did not match. | Wait several seconds and confirm `contentType` is exactly `application/pdf`. |
| Workflow decision fails | The wrong workflow, queue, or step ID was used. | Check `WORKFLOW_ID`, `QUEUE_ID`, and `stepId`. |
| Reviewer cannot approve | The reviewer is not in the approval group or lacks permissions. | Check the `document-reviewers` group and site permissions. |
| Queue endpoint returns empty results | The ruleset or rule is inactive. | Confirm both statuses are `ACTIVE`. |

## Next Steps

- [Ruleset Processing](/docs/tutorials/solution-patterns/ruleset)
- [Rulesets](/docs/features/rulesets)
- [Workflows](/docs/features/workflows)
- [Audit and User Activity Reporting](/docs/how-tos/audit-user-activity-reporting)
