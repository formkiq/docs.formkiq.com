---
sidebar_position: 16
slug: /tutorials/event-and-integration-patterns/integrate-with-amazon-eventbridge
---

# Integrate with Amazon EventBridge

## What You Will Build

In this tutorial, you will use Amazon EventBridge and AWS Lambda to run custom Python code when FormKiQ publishes a document event.

You will create a Python Lambda function that receives a FormKiQ EventBridge document event, reads the event payload, and uses the [FormKiQ Python Client SDK](https://github.com/formkiq/formkiq-client-sdk-python) to add custom tags back to the document.

This workflow combines:

- FormKiQ document upload
- FormKiQ `EVENTBRIDGE` document actions
- Amazon EventBridge routing
- AWS Lambda custom processing
- FormKiQ Python Client SDK callbacks
- Optional workflow-based EventBridge steps

## Before You Begin

Confirm you have:

- A deployed FormKiQ Core, Explore, Advanced, or Enterprise environment.
- The `HttpApiUrl` and `IamApiUrl` CloudFormation stack outputs for your FormKiQ deployment.
- A JWT access token with permission to add documents and add document actions for the manual setup steps. See [Get a JWT Authentication Token](/docs/how-tos/jwt-authentication-token).
- AWS CLI configured for the AWS account and Region where the Lambda function will run.
- Permission to create an EventBridge event bus, EventBridge rules, Lambda functions, Lambda permissions, IAM roles, CloudWatch Logs, and API Gateway invoke permissions.
- Python 3.9 or later on your local workstation or AWS CloudShell.
- `zip` installed locally or in AWS CloudShell.
- cURL or an API client such as Postman.

The Lambda function uses the FormKiQ `IamApiUrl` and the Lambda execution role to sign FormKiQ API requests with AWS Signature Version 4. The JWT token is only used by the manual cURL commands that create the test document and add the EventBridge action.

## Variables Used

| Placeholder | Description |
| --- | --- |
| `HTTP_API_URL` | FormKiQ `HttpApiUrl` CloudFormation stack output, including `https://`. Used by the manual setup cURL commands. |
| `IAM_API_URL` | FormKiQ `IamApiUrl` CloudFormation stack output, including `https://`. Used by Lambda for IAM-authenticated FormKiQ API calls. |
| `AUTHORIZATION_TOKEN` | JWT access token used by the manual setup cURL commands. |
| `SITE_ID` | FormKiQ site ID. Use `default` unless your deployment uses multiple sites. |
| `AWS_REGION` | AWS Region where EventBridge and Lambda are deployed. |
| `APP_ENVIRONMENT` | FormKiQ application environment used in the EventBridge event source, such as `dev`, `staging`, or `prod`. |
| `EVENT_BUS_NAME` | EventBridge bus used for FormKiQ custom code events. |
| `LAMBDA_FUNCTION_NAME` | Lambda function that processes FormKiQ events. |
| `LAMBDA_ROLE_NAME` | IAM role used by the Lambda function. |
| `DOCUMENT_ID` | Document ID returned when the test document is uploaded. |
| `WORKFLOW_ID` | Optional workflow ID used in commercial deployments with workflows enabled. |

The examples below use shell variables. Replace the values before running the commands:

```bash
export HTTP_API_URL="https://your-formkiq-http-api.example.com"
export IAM_API_URL="https://your-formkiq-iam-api.example.com"
export AUTHORIZATION_TOKEN="your-jwt-access-token"
export SITE_ID="default"
export AWS_REGION="us-east-1"
export APP_ENVIRONMENT="dev"
export EVENT_BUS_NAME="formkiq-custom-code"
export LAMBDA_FUNCTION_NAME="formkiq-custom-code-handler"
export LAMBDA_ROLE_NAME="formkiq-custom-code-lambda-role"
```

## Extension Pattern Overview

FormKiQ can publish document context to EventBridge. EventBridge can then route the event to AWS services that run your custom code.

| Pattern | Best for | FormKiQ availability |
| --- | --- | --- |
| Document action with `EVENTBRIDGE` | Core-compatible custom processing after a document is uploaded or updated. | Core and commercial deployments. |
| Workflow step with `EVENTBRIDGE` | Controlled processing inside a larger document workflow. | Commercial deployments with workflows enabled. |
| EventBridge to Lambda | Lightweight event processing, metadata updates, enrichment, and external API calls. | AWS-native. |
| EventBridge to ECS | Heavier processing, containers, specialized runtimes, larger dependencies, or longer-running jobs. | AWS-native. |

This tutorial uses Lambda for the hands-on implementation. You can use the same EventBridge event pattern to start other targets, including ECS tasks, Step Functions state machines, or additional event buses.

## Workflow Overview

1. Create an EventBridge event bus.
2. Create an IAM role for Lambda.
3. Build a Python Lambda package with the FormKiQ Python Client SDK.
4. Create a Lambda function that adds tags to a FormKiQ document.
5. Route EventBridge events to the Lambda function.
6. Upload a test document.
7. Add an `EVENTBRIDGE` action to the document.
8. Verify Lambda received the event.
9. Verify the custom tags were added to the document.
10. Optional: use the same EventBridge action inside a FormKiQ workflow.

## Step 1: Create an EventBridge Bus

Create a dedicated EventBridge event bus for this integration.

```bash
aws events create-event-bus \
  --name "${EVENT_BUS_NAME}" \
  --region "${AWS_REGION}"
```

You can use the default event bus for simple experiments, but a dedicated bus makes filtering, permissions, monitoring, and cleanup easier.

## Step 2: Create a Lambda Execution Role

Create a trust policy that allows Lambda to assume the execution role.

```bash
cat > trust-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
```

Create the IAM role.

```bash
aws iam create-role \
  --role-name "${LAMBDA_ROLE_NAME}" \
  --assume-role-policy-document file://trust-policy.json
```

Attach the AWS managed policy that allows Lambda to write logs to CloudWatch.

```bash
aws iam attach-role-policy \
  --role-name "${LAMBDA_ROLE_NAME}" \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

Attach API Gateway invoke permission so the Lambda role can call the FormKiQ IAM API.

```bash
aws iam attach-role-policy \
  --role-name "${LAMBDA_ROLE_NAME}" \
  --policy-arn arn:aws:iam::aws:policy/AmazonAPIGatewayInvokeFullAccess
```

:::note
For production, replace `AmazonAPIGatewayInvokeFullAccess` with a least-privilege policy scoped to the FormKiQ IAM API Gateway resource. See [Setting Up IAM Authorization](/docs/platform/security#setting-up-iam-authorization).
:::

Set `LAMBDA_ROLE_ARN` for later commands.

```bash
export LAMBDA_ROLE_ARN=$(aws iam get-role \
  --role-name "${LAMBDA_ROLE_NAME}" \
  --query 'Role.Arn' \
  --output text)
```

Wait a few seconds after creating the role so IAM propagation can complete.

## Step 3: Create the Python Lambda Handler

Create a working directory for the Lambda package.

```bash
mkdir formkiq-custom-code-lambda
cd formkiq-custom-code-lambda
```

Create `lambda_function.py`.

```python
from __future__ import annotations

import json
import os
from typing import Any, Dict, Optional

from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest
from botocore.session import Session
import formkiq_client
from formkiq_client.api_client import ApiClient
from formkiq_client.api.document_tags_api import DocumentTagsApi
from formkiq_client.rest import ApiException


FORMKIQ_IAM_API_URL = os.environ["FORMKIQ_IAM_API_URL"]
AWS_REGION = os.environ["AWS_REGION"]


class SigV4ApiClient(ApiClient):
    def __init__(self, configuration: formkiq_client.Configuration) -> None:
        super().__init__(configuration)
        self._credentials = Session().get_credentials()

    def call_api(
        self,
        method: str,
        url: str,
        header_params: Optional[Dict[str, str]] = None,
        body: Optional[Any] = None,
        post_params: Optional[Any] = None,
        _request_timeout: Optional[Any] = None,
    ):
        headers = dict(header_params or {})
        request_body = json.dumps(body) if body is not None else None

        credentials = self._credentials.get_frozen_credentials()
        aws_request = AWSRequest(
            method=method,
            url=url,
            data=request_body,
            headers=headers,
        )
        SigV4Auth(credentials, "execute-api", AWS_REGION).add_auth(aws_request)

        return super().call_api(
            method=method,
            url=url,
            header_params=dict(aws_request.headers.items()),
            body=body,
            post_params=post_params,
            _request_timeout=_request_timeout,
        )


def get_value(data: Dict[str, Any], *names: str) -> Optional[Any]:
    for name in names:
        value = data.get(name)
        if value is not None:
            return value
    return None


def build_document_tags_api() -> DocumentTagsApi:
    configuration = formkiq_client.Configuration(host=FORMKIQ_IAM_API_URL)
    api_client = SigV4ApiClient(configuration)
    return DocumentTagsApi(api_client)


def add_custom_tags(document_id: str, site_id: str, event_detail_type: str) -> None:
    tags_api = build_document_tags_api()
    request_body = {
        "tags": [
            {
                "key": "customProcessed",
                "value": "true",
            },
            {
                "key": "customProcessor",
                "value": "eventbridge-lambda-python",
            },
            {
                "key": "customEventType",
                "value": event_detail_type,
            },
        ]
    }

    tags_api.add_document_tags(
        document_id=document_id,
        add_document_tags_request=request_body,
        site_id=site_id,
    )


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    print(json.dumps(event, default=str))

    detail = event.get("detail") or {}
    document_id = get_value(detail, "documentId", "document_id")
    site_id = get_value(detail, "siteId", "site_id")
    event_detail_type = event.get("detail-type") or event.get("DetailType") or "unknown"

    if not document_id:
        print("No documentId found in EventBridge detail payload")
        return {
            "statusCode": 400,
            "body": json.dumps({"processed": False, "reason": "missing documentId"}),
        }
    if not site_id:
        print("No siteId found in EventBridge detail payload")
        return {
            "statusCode": 400,
            "body": json.dumps({"processed": False, "reason": "missing siteId"}),
        }

    try:
        add_custom_tags(document_id, site_id, event_detail_type)
    except ApiException as exc:
        print(f"FormKiQ API error: {exc}")
        raise

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "processed": True,
                "documentId": document_id,
                "siteId": site_id,
            }
        ),
    }
```

The handler accepts an EventBridge event, extracts `documentId` and `siteId` from the event detail, signs requests to the FormKiQ IAM API with the Lambda execution role, and calls `DocumentTagsApi.add_document_tags` through the FormKiQ Python Client SDK.

## Step 4: Package the Lambda Function

Install Lambda-compatible dependencies and the FormKiQ Python Client SDK into the Lambda package directory.

The Lambda function created in this tutorial uses the default `x86_64` architecture. Because the FormKiQ Python Client SDK depends on `pydantic`, and `pydantic_core` includes native compiled code, install dependencies as Linux `x86_64` wheels for Python 3.14. This avoids packaging a macOS or Windows wheel that Lambda cannot import.

```bash
python3 -m pip install --upgrade pip
rm -rf package function.zip

python3 -m pip install \
  --target package \
  --platform manylinux2014_x86_64 \
  --implementation cp \
  --python-version 3.14 \
  --only-binary=:all: \
  "botocore>=1.34,<2" \
  "pydantic>=2" \
  "pydantic-core>=2" \
  "python-dateutil>=2.8.2" \
  "typing-extensions>=4.7.1" \
  "urllib3>=2.1,<3"

python3 -m pip install \
  --target package \
  --no-deps \
  "git+https://github.com/formkiq/formkiq-client-sdk-python.git"
```

:::tip
For repeatable production builds, pin the SDK dependency to a tag or commit instead of installing from the default branch. AWS Lambda Python runtimes include the AWS SDK for Python, but this tutorial packages `botocore` so the SigV4 signing dependency is controlled by the deployment package.
:::

:::note
If you create the Lambda function with `--architectures arm64`, use `--platform manylinux2014_aarch64` when installing the dependencies.
:::

Copy the Lambda handler into the package and create a deployment zip.

```bash
cp lambda_function.py package/
cd package
zip -r ../function.zip .
cd ..
```

## Step 5: Create the Lambda Function

Create the Lambda function and pass the FormKiQ IAM API settings as environment variables.

```bash
aws lambda create-function \
  --function-name "${LAMBDA_FUNCTION_NAME}" \
  --runtime python3.14 \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://function.zip \
  --role "${LAMBDA_ROLE_ARN}" \
  --timeout 30 \
  --memory-size 256 \
  --environment "Variables={FORMKIQ_IAM_API_URL=${IAM_API_URL}}" \
  --region "${AWS_REGION}"
```

## Step 6: Route EventBridge Events to Lambda

Create an EventBridge rule on the custom bus. This tutorial starts with a broad FormKiQ event pattern so the first test is easier to verify.

```bash
aws events put-rule \
  --name formkiq-custom-code-rule \
  --event-bus-name "${EVENT_BUS_NAME}" \
  --event-pattern "{
    \"source\": [\"formkiq.${APP_ENVIRONMENT}\"],
    \"detail-type\": [\"Document Action Event\"]
  }" \
  --region "${AWS_REGION}"
```

FormKiQ sets the EventBridge `source` to `formkiq.<APP_ENVIRONMENT>`, such as `formkiq.dev`, `formkiq.staging`, or `formkiq.prod`. For production, use the environment value that matches your FormKiQ deployment and narrow the rule further if your code should process only specific document events.

Get the Lambda function ARN.

```bash
export LAMBDA_ARN=$(aws lambda get-function \
  --function-name "${LAMBDA_FUNCTION_NAME}" \
  --region "${AWS_REGION}" \
  --query 'Configuration.FunctionArn' \
  --output text)
```

Add the Lambda function as the rule target.

```bash
aws events put-targets \
  --event-bus-name "${EVENT_BUS_NAME}" \
  --rule formkiq-custom-code-rule \
  --targets "Id"="formkiq-custom-code-lambda","Arn"="${LAMBDA_ARN}" \
  --region "${AWS_REGION}"
```

Allow EventBridge to invoke the Lambda function.

```bash
export EVENT_RULE_ARN=$(aws events describe-rule \
  --name formkiq-custom-code-rule \
  --event-bus-name "${EVENT_BUS_NAME}" \
  --region "${AWS_REGION}" \
  --query 'Arn' \
  --output text)

aws lambda add-permission \
  --function-name "${LAMBDA_FUNCTION_NAME}" \
  --statement-id formkiq-custom-code-eventbridge \
  --action lambda:InvokeFunction \
  --principal events.amazonaws.com \
  --source-arn "${EVENT_RULE_ARN}" \
  --region "${AWS_REGION}"
```

## Step 7: Upload a Test Document

Use `POST /documents` to upload a document that will be sent through the custom code path.

```bash
curl -X POST "${HTTP_API_URL}/documents?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "custom-code/invoice-1001.txt",
    "contentType": "text/plain",
    "content": "Invoice 1001 should be processed by custom Lambda code.",
    "tags": [
      {
        "key": "source",
        "value": "eventbridge-custom-code-tutorial"
      }
    ]
  }'
```

Set `DOCUMENT_ID` to the returned document ID.

```bash
export DOCUMENT_ID="returned-document-id"
```

## Step 8: Add an EventBridge Action

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

This sends document context to the EventBridge bus. EventBridge routes the event to the Lambda function, and the Lambda function calls FormKiQ to add tags to the same document.

## Step 9: Inspect Action Status

Use `GET /documents/{documentId}/actions` to confirm the action was accepted and processed.

```bash
curl -X GET "${HTTP_API_URL}/documents/${DOCUMENT_ID}/actions?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

If the action failed, inspect the returned action status and confirm the `eventBusName`, AWS Region, and EventBridge permissions.

## Step 10: Verify Lambda Received the Event

Check the Lambda logs in CloudWatch.

```bash
aws logs tail "/aws/lambda/${LAMBDA_FUNCTION_NAME}" \
  --since 15m \
  --region "${AWS_REGION}"
```

The logs should show the EventBridge event payload and a successful FormKiQ API call.

## Step 11: Verify the Document Tags

Use `GET /documents/{documentId}/tags` to confirm the Lambda function updated the document.

```bash
curl -X GET "${HTTP_API_URL}/documents/${DOCUMENT_ID}/tags?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

The response should include tags similar to:

```json
{
  "key": "customProcessed",
  "value": "true"
}
```

and:

```json
{
  "key": "customProcessor",
  "value": "eventbridge-lambda-python"
}
```

## Optional: Use EventBridge in a Workflow

Commercial FormKiQ deployments that include workflows can publish an EventBridge event as a workflow step. This is useful when custom code should run as part of a controlled document process.

Example workflow step:

```json
{
  "stepId": "run-custom-code",
  "action": {
    "type": "EVENTBRIDGE",
    "parameters": {
      "eventBusName": "formkiq-custom-code"
    }
  }
}
```

A workflow might:

1. Run OCR on an uploaded document.
2. Publish an EventBridge event to invoke custom Lambda code.
3. Add custom tags or attributes through the FormKiQ API.
4. Send the document to a review queue.
5. Continue processing after approval.

For workflow details, see [Workflows](/docs/features/workflows) and [Build a Document Review and Approval Workflow](/docs/tutorials/solution-patterns/build-document-review-approval-workflow).

## Optional: Use ECS for Heavier Custom Processing

Lambda is a good fit for lightweight event processing and metadata updates. Use ECS when your custom processing needs:

- A containerized runtime.
- Larger dependencies.
- Longer execution time.
- More CPU or memory control.
- Existing application code packaged as a container.

In that pattern, keep FormKiQ and EventBridge the same, but configure the EventBridge rule target to start an ECS task instead of invoking Lambda.

## Troubleshooting

### Lambda Was Not Invoked

Confirm:

- The EventBridge rule is on the same bus as the FormKiQ `EVENTBRIDGE` action.
- The rule target points to the Lambda function ARN.
- The Lambda permission allows `events.amazonaws.com` to invoke the function.
- The AWS Region matches your Lambda function and EventBridge bus.

### FormKiQ Tags Were Not Added

Confirm:

- `FORMKIQ_IAM_API_URL` is the `IamApiUrl`, not the console URL or `HttpApiUrl`.
- The Lambda execution role has `execute-api:Invoke` permission for the FormKiQ IAM API.
- The FormKiQ IAM API is in the same AWS Region used for SigV4 signing.
- The EventBridge payload includes `documentId`.
- The Lambda logs do not show a `FormKiQ API error`.

### Lambda Cannot Import `pydantic_core`

If Lambda logs show `Runtime.ImportModuleError` with `No module named 'pydantic_core._pydantic_core'`, rebuild the deployment package with Lambda-compatible Linux wheels.

This usually happens when dependencies were installed on macOS or Windows without specifying the Lambda platform. Re-run the packaging commands in [Step 4](#step-4-package-the-lambda-function), which use `--platform manylinux2014_x86_64`, `--python-version 3.14`, and `--only-binary=:all:`.

If your Lambda function uses ARM64, use `--platform manylinux2014_aarch64` instead.

### The Document Action Failed

Confirm:

- The `eventBusName` parameter matches the EventBridge bus name.
- FormKiQ can publish events to that bus.
- The document action status and error details do not show a permission or configuration issue.

### The Event Pattern Did Not Match

This tutorial uses an empty event pattern for initial testing. If you replace it with a narrow pattern, confirm it matches the actual EventBridge event fields and values written in the Lambda logs.

## Cleanup

To remove the AWS resources created in this tutorial:

```bash
aws events remove-targets \
  --event-bus-name "${EVENT_BUS_NAME}" \
  --rule formkiq-custom-code-rule \
  --ids formkiq-custom-code-lambda \
  --region "${AWS_REGION}"

aws events delete-rule \
  --event-bus-name "${EVENT_BUS_NAME}" \
  --name formkiq-custom-code-rule \
  --region "${AWS_REGION}"

aws lambda delete-function \
  --function-name "${LAMBDA_FUNCTION_NAME}" \
  --region "${AWS_REGION}"

aws events delete-event-bus \
  --name "${EVENT_BUS_NAME}" \
  --region "${AWS_REGION}"

aws iam detach-role-policy \
  --role-name "${LAMBDA_ROLE_NAME}" \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam detach-role-policy \
  --role-name "${LAMBDA_ROLE_NAME}" \
  --policy-arn arn:aws:iam::aws:policy/AmazonAPIGatewayInvokeFullAccess

aws iam delete-role \
  --role-name "${LAMBDA_ROLE_NAME}"
```

You can also delete the local Lambda build files:

```bash
cd ..
rm -rf formkiq-custom-code-lambda
```

## Next Steps

- Replace `AmazonAPIGatewayInvokeFullAccess` with a least-privilege `execute-api:Invoke` policy scoped to the FormKiQ IAM API.
- Narrow the EventBridge rule pattern to the document events your code should process.
- Add idempotency checks so repeated events do not duplicate processing.
- Use document attributes instead of tags when your custom metadata needs validation or typed values.
- Add CloudWatch alarms for Lambda errors and failed document actions.
