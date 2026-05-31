---
sidebar_position: 7
---

# Manage Users and Groups

Use this guide to create FormKiQ users, create groups, assign users to groups, and set site-level group permissions.

## Before You Begin

Confirm you have:

- A deployed FormKiQ environment. See [Quick Start](/docs/getting-started/quick-start#install-formkiq).
- A JWT access token for an administrator user. See [Get a JWT Authentication Token](/docs/how-tos/jwt-authentication-token).
- cURL or an API client such as Postman.
- Optional: [jq](https://jqlang.github.io/jq/) for formatting JSON responses.

## Variables Used

| Placeholder | Description |
| --- | --- |
| `HTTP_API_URL` | FormKiQ API endpoint from the CloudFormation stack output, including `https://`. |
| `AUTHORIZATION_TOKEN` | JWT access token used in the `Authorization` header. |
| `SITE_ID` | FormKiQ site ID. Use `default` unless your deployment uses multiple sites. |
| `USERNAME` | Email address or username for the FormKiQ user. |
| `GROUP_NAME` | Group name to create or manage. |

The examples below use shell variables. Replace the values before running the commands:

```bash
export HTTP_API_URL="https://your-formkiq-api.example.com"
export AUTHORIZATION_TOKEN="your-jwt-access-token"
export SITE_ID="default"
export USERNAME="reviewer@example.com"
export GROUP_NAME="document-reviewers"
```

## Step 1: Create a User

Use `POST /users` to create a user.

```bash
curl -X POST "${HTTP_API_URL}/users" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"user\": {
      \"username\": \"${USERNAME}\",
      \"attributes\": {
        \"givenName\": \"Document\",
        \"familyName\": \"Reviewer\",
        \"name\": \"Document Reviewer\"
      }
    }
  }"
```

## Step 2: Create a Group

Use `POST /groups` to create a reusable group.

```bash
curl -X POST "${HTTP_API_URL}/groups" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"group\": {
      \"name\": \"${GROUP_NAME}\",
      \"description\": \"Users who review submitted documents\"
    }
  }"
```

## Step 3: Add the User to the Group

Use `POST /groups/{groupName}/users` to assign the user to the group.

```bash
curl -X POST "${HTTP_API_URL}/groups/${GROUP_NAME}/users" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"user\": {
      \"username\": \"${USERNAME}\"
    }
  }"
```

## Step 4: Set Site Group Permissions

Use `PUT /sites/{siteId}/groups/{groupName}/permissions` to assign site permissions.

```bash
curl -X PUT "${HTTP_API_URL}/sites/${SITE_ID}/groups/${GROUP_NAME}/permissions" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": ["READ", "WRITE"]
  }'
```

Common site permissions are `READ`, `WRITE`, `DELETE`, `GOVERN`, and `ADMIN`. Use the narrowest permission set that supports the user's workflow.

## Step 5: List Users and Groups

List users:

```bash
curl -X GET "${HTTP_API_URL}/users" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

List groups:

```bash
curl -X GET "${HTTP_API_URL}/groups" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

List users in the group:

```bash
curl -X GET "${HTTP_API_URL}/groups/${GROUP_NAME}/users" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

## Verify the Result

Confirm that:

- The user appears in `GET /users`.
- The group appears in `GET /groups`.
- The user appears in `GET /groups/{groupName}/users`.
- The group has the expected site permissions in the FormKiQ Console or API response.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| `403 Forbidden` | The JWT user is not an administrator. | Use an administrator token. |
| User cannot access documents | The group has no site permissions or the user is not in the group. | Check group membership and site permissions. |
| Group already exists | The group name is already in use. | Use `GET /groups/{groupName}` to inspect the existing group. |
| User cannot sign in | The user exists in FormKiQ but identity provider setup is incomplete. | Check Cognito, SSO, or identity provider configuration. |

## Next Steps

- [API Key Management](/docs/how-tos/manage-api-keys)
- [Folder Permissions and Sharing](/docs/how-tos/folder-permissions-and-sharing)
- [Security](/docs/platform/security)
