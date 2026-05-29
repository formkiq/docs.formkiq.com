---
sidebar_position: 15
---

# Build an Event-Driven Document Processing Pipeline

## What You Will Build

In this tutorial, you will build an event-driven processing pipeline that sends document events to Amazon EventBridge and processes them with a Lambda function.

This workflow combines:

- Document upload
- Document actions
- EventBridge routing
- AWS Lambda processing
- Document tag updates
- Retry and monitoring checks

## Before You Begin

Confirm you have:

- A deployed FormKiQ environment.
- A JWT access token with permission to add documents and document actions. See [Get a JWT Authentication Token](/docs/how-tos/jwt-authentication-token).
- AWS CLI configured for the AWS account and Region where the pipeline will run.
- Permission to create an EventBridge event bus, Lambda function, Lambda permissions, and EventBridge rules.
- cURL or an API client such as Postman.

## Variables Used

| Placeholder | Description |
| --- | --- |
| `HTTP_API_URL` | FormKiQ API endpoint from the CloudFormation stack output, including `https://`. |
| `AUTHORIZATION_TOKEN` | JWT access token used in the `Authorization` header. |
| `SITE_ID` | FormKiQ site ID. Use `default` unless your deployment uses multiple sites. |
| `EVENT_BUS_NAME` | EventBridge bus used for document processing events. |
| `AWS_REGION` | AWS Region where EventBridge and Lambda are deployed. |
| `DOCUMENT_ID` | Document ID returned when the test document is uploaded. |

The examples below use shell variables. Replace the values before running the commands:

```bash
export HTTP_API_URL="https://your-formkiq-api.example.com"
export AUTHORIZATION_TOKEN="your-jwt-access-token"
export SITE_ID="default"
export AWS_REGION="us-east-1"
export EVENT_BUS_NAME="formkiq-document-pipeline"
```

## Workflow Overview

1. Create an EventBridge event bus.
2. Create a Lambda function that receives document events.
3. Route EventBridge events to the Lambda function.
4. Upload a test document.
5. Add an `EVENTBRIDGE` action to the document.
6. Verify the event reaches Lambda.
7. Retry or inspect failed actions if needed.

## Step 1: Create an EventBridge Bus

Create a dedicated EventBridge event bus for document processing events.

```bash
aws events create-event-bus \
  --name "${EVENT_BUS_NAME}" \
  --region "${AWS_REGION}"
```

## Step 2: Create a Lambda Function

Create a simple Lambda handler that logs incoming events. In a production workflow, this function can call the FormKiQ API, enrich metadata, invoke another service, or start a downstream process.

Create `index.js`:

```js
exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({ processed: true })
  };
};
```

Package the function:

```bash
zip function.zip index.js
```

Create the Lambda function. Replace `LAMBDA_ROLE_ARN` with an IAM role ARN that allows Lambda execution and CloudWatch Logs writes.

```bash
aws lambda create-function \
  --function-name formkiq-document-pipeline-handler \
  --runtime nodejs20.x \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --role LAMBDA_ROLE_ARN \
  --region "${AWS_REGION}"
```

## Step 3: Route Events to Lambda

Create an EventBridge rule that sends all events on the bus to the Lambda function.

```bash
aws events put-rule \
  --name formkiq-document-pipeline-rule \
  --event-bus-name "${EVENT_BUS_NAME}" \
  --event-pattern '{}' \
  --region "${AWS_REGION}"
```

Get the Lambda function ARN:

```bash
export LAMBDA_ARN=$(aws lambda get-function \
  --function-name formkiq-document-pipeline-handler \
  --region "${AWS_REGION}" \
  --query 'Configuration.FunctionArn' \
  --output text)
```

Add the Lambda function as the rule target:

```bash
aws events put-targets \
  --event-bus-name "${EVENT_BUS_NAME}" \
  --rule formkiq-document-pipeline-rule \
  --targets "Id"="1","Arn"="${LAMBDA_ARN}" \
  --region "${AWS_REGION}"
```

Allow EventBridge to invoke the Lambda function:

```bash
aws lambda add-permission \
  --function-name formkiq-document-pipeline-handler \
  --statement-id formkiq-document-pipeline-eventbridge \
  --action lambda:InvokeFunction \
  --principal events.amazonaws.com \
  --source-arn "$(aws events describe-rule \
    --name formkiq-document-pipeline-rule \
    --event-bus-name "${EVENT_BUS_NAME}" \
    --region "${AWS_REGION}" \
    --query 'Arn' \
    --output text)" \
  --region "${AWS_REGION}"
```

## Step 4: Upload a Test Document

Use `POST /documents` to upload a document that will be sent through the event pipeline.

```bash
curl -X POST "${HTTP_API_URL}/documents?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "events/pipeline-test.txt",
    "contentType": "text/plain",
    "content": "This document should trigger an EventBridge action.",
    "tags": [
      {
        "key": "pipeline",
        "value": "eventbridge"
      }
    ]
  }'
```

Set `DOCUMENT_ID` to the returned document ID.

```bash
export DOCUMENT_ID="returned-document-id"
```

## Step 5: Add an EventBridge Action

Use `POST /documents/{documentId}/actions` with action type `EVENTBRIDGE`.

```bash
curl -X POST "${HTTP_API_URL}/documents/${DOCUMENT_ID}/actions?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"actions\": [
      {
        \"type\": \"EVENTBRIDGE\",
        \"parameters\": {
          \"eventBusName\": \"${EVENT_BUS_NAME}\"
        }
      }
    ]
  }"
```

## Step 6: Inspect Action Status

Use `GET /documents/{documentId}/actions` to confirm the action was accepted and processed.

```bash
curl -X GET "${HTTP_API_URL}/documents/${DOCUMENT_ID}/actions?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

## Step 7: Verify Lambda Received the Event

Check the Lambda logs in CloudWatch.

```bash
aws logs tail "/aws/lambda/formkiq-document-pipeline-handler" \
  --since 15m \
  --region "${AWS_REGION}"
```

The logs should include the document event payload.

## Step 8: Retry Failed Actions

If the action fails, use `POST /documents/{documentId}/actions/retry` after correcting the EventBridge bus, permissions, or downstream target.

```bash
curl -X POST "${HTTP_API_URL}/documents/${DOCUMENT_ID}/actions/retry?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "actions": [
      {
        "type": "EVENTBRIDGE"
      }
    ]
  }'
```

## Verify the Result

Confirm that:

- The EventBridge bus exists.
- The Lambda function is attached to the EventBridge rule.
- The document action status is complete.
- The Lambda CloudWatch logs show the document event.

## Clean Up

Delete the test document if it is no longer needed.

```bash
curl -X DELETE "${HTTP_API_URL}/documents/${DOCUMENT_ID}?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

Remove the AWS test resources if they are no longer needed.

```bash
aws events remove-targets \
  --event-bus-name "${EVENT_BUS_NAME}" \
  --rule formkiq-document-pipeline-rule \
  --ids "1" \
  --region "${AWS_REGION}"

aws events delete-rule \
  --event-bus-name "${EVENT_BUS_NAME}" \
  --name formkiq-document-pipeline-rule \
  --region "${AWS_REGION}"

aws lambda delete-function \
  --function-name formkiq-document-pipeline-handler \
  --region "${AWS_REGION}"

aws events delete-event-bus \
  --name "${EVENT_BUS_NAME}" \
  --region "${AWS_REGION}"
```

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| Document action fails | FormKiQ cannot put events on the target bus. | Confirm the event bus name, Region, and AWS permissions. |
| Lambda logs are empty | EventBridge rule or target is not configured correctly. | Check rule targets and Lambda invoke permission. |
| Retry fails again | The underlying permission or target issue still exists. | Inspect action status and CloudWatch logs before retrying. |
| AWS CLI commands fail | The caller lacks AWS permissions or is using the wrong Region. | Confirm AWS identity and `AWS_REGION`. |

## Next Steps

- [Document Event Processing](/docs/tutorials/document-event-processing)
- [Add Document Actions](/docs/how-tos/api-document-actions)
- [Status Monitoring and Alerting](/docs/how-tos/set-up-status-monitoring-and-alerting)
- [Dead-Letter Queue](/docs/platform/error_handling/dlq)
