---
sidebar_position: 1
---

# Get a JWT Authentication Token

Use this guide to get a JWT access token for FormKiQ API requests. Most API examples in the documentation require this token in the `Authorization` header.

## Before You Begin

Confirm you have:

- A deployed FormKiQ environment.
- Access to the AWS account and Region where FormKiQ is deployed.
- Access to the FormKiQ administrator username and password.
- cURL or an API client such as Postman.
- Optional: [jq](https://jqlang.github.io/jq/) for formatting JSON responses.

## Variables Used

| Placeholder | Description |
| --- | --- |
| `COGNITO_API_ENDPOINT_URL` | Cognito API endpoint from the FormKiQ CloudFormation stack outputs, including `https://`. |
| `HTTP_API_URL` | FormKiQ API endpoint from the CloudFormation stack outputs, including `https://`. |
| `USERNAME` | FormKiQ administrator email address. |
| `PASSWORD` | FormKiQ administrator password. |
| `AUTHORIZATION_TOKEN` | Access token returned by the login request. |

The examples below use shell variables. Replace the values before running the commands:

```bash
export COGNITO_API_ENDPOINT_URL="https://your-cognito-api.example.com"
export HTTP_API_URL="https://your-formkiq-api.example.com"
export USERNAME="admin@example.com"
export PASSWORD="your-password"
```

## Step 1: Find the Cognito API Endpoint

Open the [AWS CloudFormation console](https://console.aws.amazon.com/cloudformation), select your FormKiQ stack, and open the **Outputs** tab.

![CloudFormation Outputs](./img/cf-outputs-apis.png)

Find the `CognitoApiEndpoint` output. Use that value as `COGNITO_API_ENDPOINT_URL`.

If you want to verify the token with the FormKiQ API, also record the `HttpApiUrl` output as `HTTP_API_URL`.

## Step 2: Request an Access Token

Send a login request to the Cognito API endpoint.

```bash
curl -X POST "${COGNITO_API_ENDPOINT_URL}/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "'"${USERNAME}"'", "password": "'"${PASSWORD}"'"}'
```

A successful response includes an `AccessToken`.

```json
{
  "AuthenticationResult": {
    "AccessToken": "eyJraWQiOiJkdkpnTHlm...",
    "ExpiresIn": 86400,
    "TokenType": "Bearer",
    "RefreshToken": "eyJjdHkiOiJKV1Qi...",
    "IdToken": "eyJraWQiOiI5YUpvb..."
  }
}
```

Use the `AccessToken` value as `AUTHORIZATION_TOKEN` in FormKiQ API requests. Do not use the `IdToken` for FormKiQ API authorization.

```bash
export AUTHORIZATION_TOKEN="eyJraWQiOiJkdkpnTHlm..."
```

:::note
The access token is valid for a limited time. If API requests start returning `401 Unauthorized`, request a new token.
:::

## Verify the Result

Use the token with `GET /sites` to confirm that the JWT is valid and that the user has FormKiQ site access.

```bash
curl -X GET "${HTTP_API_URL}/sites" \
  -H "Authorization: Bearer ${AUTHORIZATION_TOKEN}"
```

The request should return the sites available to the authenticated user.

```json
{
  "sites": [
    {
      "siteId": "default",
      "permission": "READ_WRITE"
    }
  ]
}
```

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| `401 Unauthorized` | The token is expired, missing, or not an access token. | Request a new token and use the `AccessToken` value. |
| `403 Forbidden` | The user is authenticated but does not have permission for the requested API action. | Check FormKiQ user groups and permissions. |
| `404 Not Found` on `/login` | The wrong endpoint was used. | Confirm you are using `CognitoApiEndpoint`, not `HttpApiUrl`. |
| `GET /sites` fails | The request is using the wrong API URL or token format. | Use `HttpApiUrl` and send `Authorization: Bearer <AccessToken>`. |
| API call uses the wrong token | The `IdToken` was used instead of the `AccessToken`. | Use `AuthenticationResult.AccessToken` for API authorization. |
| Login request fails | Username, password, or deployment endpoint is incorrect. | Confirm the administrator credentials and CloudFormation output values. |

## Next Steps

- [Add Documents](/docs/how-tos/api-add-documents)
- [Add Document Tags](/docs/how-tos/api-add-document-tags)
- [Document Search](/docs/how-tos/api-document-search)
