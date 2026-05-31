---
sidebar_position: 9
---

# Folder Permissions and Sharing

Use this guide to create folders, assign folder permissions, and share folders with groups.

Folder-level controls are useful when users need access to a subset of documents instead of the entire site.

## Before You Begin

Confirm you have:

- A deployed FormKiQ environment. See [Quick Start](/docs/getting-started/quick-start#install-formkiq).
- A JWT access token with permission to manage folders and sharing.
- cURL or an API client such as Postman.
- A group that should receive folder access. See [Manage Users and Groups](/docs/how-tos/manage-users-and-groups).

## Variables Used

| Placeholder | Description |
| --- | --- |
| `HTTP_API_URL` | FormKiQ API endpoint from the CloudFormation stack output, including `https://`. |
| `AUTHORIZATION_TOKEN` | JWT access token used in the `Authorization` header. |
| `SITE_ID` | FormKiQ site ID. Use `default` unless your deployment uses multiple sites. |
| `FOLDER_PATH` | Folder path to create and secure. |
| `FOLDER_INDEX_KEY` | Folder index key returned by folder APIs. |
| `GROUP_NAME` | Group receiving folder access. |
| `SHARE_KEY` | Share key returned by the share API. |

The examples below use shell variables. Replace the values before running the commands:

```bash
export HTTP_API_URL="https://your-formkiq-api.example.com"
export AUTHORIZATION_TOKEN="your-jwt-access-token"
export SITE_ID="default"
export FOLDER_PATH="/review/invoices"
export GROUP_NAME="document-reviewers"
```

## Step 1: Create a Folder

Use `POST /folders` to create a folder path.

```bash
curl -X POST "${HTTP_API_URL}/folders?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"path\": \"${FOLDER_PATH}\"
  }"
```

## Step 2: List Folders

Use `GET /folders` to confirm the folder exists and to capture its index key.

```bash
curl -X GET "${HTTP_API_URL}/folders?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

Set `FOLDER_INDEX_KEY` to the folder index key returned for the folder.

```bash
export FOLDER_INDEX_KEY="returned-folder-index-key"
```

## Step 3: Set Folder Permissions

Use `PUT /folders/permissions` to define which roles can access the folder.

```bash
curl -X PUT "${HTTP_API_URL}/folders/permissions?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"path\": \"${FOLDER_PATH}\",
    \"roles\": [
      {
        \"roleName\": \"${GROUP_NAME}\",
        \"permissions\": [\"READ\", \"WRITE\"]
      }
    ]
  }"
```

Folder permissions support `READ`, `WRITE`, and `DELETE`.

## Step 4: Verify Folder Permissions

Use `GET /folders/{indexKey}/permissions` to inspect the folder permissions.

```bash
curl -X GET "${HTTP_API_URL}/folders/${FOLDER_INDEX_KEY}/permissions?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

## Step 5: Share the Folder

Use `POST /shares/folders/{indexKey}` to share the folder with a group.

```bash
curl -X POST "${HTTP_API_URL}/shares/folders/${FOLDER_INDEX_KEY}?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"share\": {
      \"group\": \"${GROUP_NAME}\",
      \"permissions\": [\"READ\", \"WRITE\"]
    }
  }"
```

## Step 6: List User Shares

Use `GET /shares` to confirm the folder share is visible to the current user.

```bash
curl -X GET "${HTTP_API_URL}/shares?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

## Verify the Result

Confirm that:

- The folder appears in `GET /folders`.
- The folder permissions include the expected group.
- The share appears in `GET /shares` for users who should have access.
- Users outside the group cannot access the shared folder.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| Folder permissions do not apply | The wrong folder path or index key was used. | Recheck `FOLDER_PATH` and `FOLDER_INDEX_KEY`. |
| Share is missing for a user | The user is not in the shared group. | Check group membership. |
| User can read but not write | The share or folder permissions do not include `WRITE`. | Check both folder permissions and share permissions. |
| `403 Forbidden` | The caller cannot manage folder permissions. | Use a token with the required site permissions. |

## Next Steps

- [Manage Users and Groups](/docs/how-tos/manage-users-and-groups)
- [Add Documents](/docs/how-tos/api-add-documents)
- [Security](/docs/platform/security)
