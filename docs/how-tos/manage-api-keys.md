---
sidebar_position: 8
---

# Manage API Keys

Use this guide to create, list, and revoke FormKiQ API keys for server-side integrations.

API keys are best suited for trusted back-end services, automation, and integration jobs. Browser-based applications should normally use JWT authentication instead.

## Before You Begin

Confirm you have:

- A deployed FormKiQ environment. See [Quick Start](/docs/getting-started/quick-start#install-formkiq).
- A JWT access token for an administrator user. See [Get a JWT Authentication Token](/docs/how-tos/jwt-authentication-token).
- cURL or an API client such as Postman.
- A clear owner and rotation plan for each API key.

## Variables Used

| Placeholder | Description |
| --- | --- |
| `HTTP_API_URL` | FormKiQ API endpoint from the CloudFormation stack output, including `https://`. |
| `AUTHORIZATION_TOKEN` | JWT access token used to administer API keys. |
| `SITE_ID` | FormKiQ site ID. Use `default` unless your deployment uses multiple sites. |
| `API_KEY` | API key value returned when a key is created. |

The examples below use shell variables. Replace the values before running the commands:

```bash
export HTTP_API_URL="https://your-formkiq-api.example.com"
export AUTHORIZATION_TOKEN="your-jwt-access-token"
export SITE_ID="default"
```

## Step 1: Create an API Key

Use `POST /sites/{siteId}/apiKeys` to create an API key.

```bash
curl -X POST "${HTTP_API_URL}/sites/${SITE_ID}/apiKeys" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "nightly-import-job",
    "groups": ["document-importers"],
    "permissions": ["READ", "WRITE"]
  }'
```

The response includes the API key value. Store it securely; do not commit it to source control.

## Step 2: Use the API Key from a Server-Side Process

Use the API key in the `Authorization` header when calling the key-authenticated API endpoint for your FormKiQ deployment.

```bash
curl -X GET "${HTTP_API_URL}/sites" \
  -H "Authorization: ${API_KEY}"
```

If your deployment exposes separate JWT and key-auth API URLs, use the key-auth API URL for API key requests.

## Step 3: List Existing API Keys

Use `GET /sites/{siteId}/apiKeys` to review keys for the site.

```bash
curl -X GET "${HTTP_API_URL}/sites/${SITE_ID}/apiKeys" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

Review this list periodically and remove keys that no longer have an active owner or use case.

## Step 4: Revoke an API Key

Use `DELETE /sites/{siteId}/apiKeys/{apiKey}` to revoke a key.

```bash
curl -X DELETE "${HTTP_API_URL}/sites/${SITE_ID}/apiKeys/${API_KEY}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

Rotate API keys by creating a replacement key, updating the consuming service, verifying the service works, and then deleting the old key.

## Verify the Result

Confirm that:

- The key appears in `GET /sites/{siteId}/apiKeys` after creation.
- The consuming service can call the expected API endpoints.
- The key no longer works after deletion.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| `403 Forbidden` while creating a key | The JWT user does not have administrator access. | Use an administrator token. |
| API key can read but not write | The key was created with limited permissions. | Check the `permissions` array on the key. |
| API key request fails against `/sites` | The request may be using the JWT API URL instead of the key-auth URL. | Check CloudFormation outputs for the correct API endpoint. |
| Key appears exposed | The key was logged, committed, or shared. | Revoke it and create a replacement key. |

## Next Steps

- [Using a Server-Side Proxy](/docs/tutorials/using-a-server-side-proxy)
- [Manage Users and Groups](/docs/how-tos/manage-users-and-groups)
- [Security](/docs/platform/security)
