---
sidebar_position: 11
---

# Webhooks End-to-End

Use this guide to create a FormKiQ webhook, tag it, submit a payload through the webhook endpoint, and inspect the webhook configuration.

Webhooks are useful when another system needs a stable endpoint for sending document-related payloads into FormKiQ.

## Before You Begin

Confirm you have:

- A deployed FormKiQ environment. See [Quick Start](/docs/getting-started/quick-start#install-formkiq).
- A JWT access token with permission to manage webhooks.
- cURL or an API client such as Postman.

## Variables Used

| Placeholder | Description |
| --- | --- |
| `HTTP_API_URL` | FormKiQ API endpoint from the CloudFormation stack output, including `https://`. |
| `AUTHORIZATION_TOKEN` | JWT access token used in the `Authorization` header. |
| `SITE_ID` | FormKiQ site ID. Use `default` unless your deployment uses multiple sites. |
| `WEBHOOK_ID` | Webhook ID returned when a webhook is created. |
| `WEBHOOK_PATH` | Webhook path segment used when posting a payload. |

The examples below use shell variables. Replace the values before running the commands:

```bash
export HTTP_API_URL="https://your-formkiq-api.example.com"
export AUTHORIZATION_TOKEN="your-jwt-access-token"
export SITE_ID="default"
export WEBHOOK_PATH="partner/invoices"
```

## Step 1: Create a Webhook

Use `POST /webhooks` to create an enabled webhook.

```bash
curl -X POST "${HTTP_API_URL}/webhooks" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Partner invoice intake",
    "enabled": "true",
    "ttl": "3600",
    "tags": [
      {
        "key": "source",
        "value": "partner"
      }
    ]
  }'
```

Set `WEBHOOK_ID` to the ID returned in the response.

```bash
export WEBHOOK_ID="returned-webhook-id"
```

## Step 2: Add a Webhook Tag

Use `POST /webhooks/{webhookId}/tags` to add routing or classification tags to the webhook.

```bash
curl -X POST "${HTTP_API_URL}/webhooks/${WEBHOOK_ID}/tags" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "documentType",
    "value": "invoice"
  }'
```

## Step 3: Inspect the Webhook

Use `GET /webhooks/{webhookId}` to confirm the webhook is enabled and tagged correctly.

```bash
curl -X GET "${HTTP_API_URL}/webhooks/${WEBHOOK_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

## Step 4: Submit a Payload Through the Private Webhook Endpoint

Use `POST /private/webhooks/{webhooks+}` to submit an authenticated webhook payload.

```bash
curl -X POST "${HTTP_API_URL}/private/webhooks/${WEBHOOK_PATH}?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "externalId": "invoice-1001",
    "fileName": "invoice-1001.pdf",
    "source": "partner"
  }'
```

If you expose public webhook intake, use `POST /public/webhooks/{webhooks+}` only for payloads that your architecture is prepared to accept without a JWT.

## Step 5: List Webhooks

Use `GET /webhooks` to review all configured webhooks.

```bash
curl -X GET "${HTTP_API_URL}/webhooks" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

## Verify the Result

Confirm that:

- The webhook appears in `GET /webhooks`.
- `GET /webhooks/{webhookId}` shows the expected name, enabled state, and tags.
- The private webhook endpoint accepts the sample payload.
- Downstream processing receives the expected tags or payload fields.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| Webhook is not accepted | The webhook is disabled or the wrong path is used. | Check `enabled`, `WEBHOOK_ID`, and `WEBHOOK_PATH`. |
| `401 Unauthorized` | The private webhook request is missing a JWT. | Add `Authorization: ${AUTHORIZATION_TOKEN}`. |
| Tags are missing | Tags were not added to the webhook or payload. | Check `GET /webhooks/{webhookId}/tags`. |
| Public webhook intake is too permissive | Public endpoints do not require JWT authentication. | Use private webhooks unless anonymous intake is intentional. |

## Next Steps

- [Add Document Actions](/docs/how-tos/api-document-actions)
- [Rulesets](/docs/features/rulesets)
- [Workflows](/docs/features/workflows)
