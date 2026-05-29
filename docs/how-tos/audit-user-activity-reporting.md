---
sidebar_position: 13
---

# Audit and User Activity Reporting

Use this guide to retrieve activity records for users, documents, and resources.

Activity reporting helps administrators investigate document access, review operational history, and support compliance workflows.

## Before You Begin

Confirm you have:

- A deployed FormKiQ environment. See [Quick Start](/docs/getting-started/quick-start#install-formkiq).
- A JWT access token with permission to read activity records.
- cURL or an API client such as Postman.
- Optional: [jq](https://jqlang.github.io/jq/) for formatting JSON responses.

## Variables Used

| Placeholder | Description |
| --- | --- |
| `HTTP_API_URL` | FormKiQ API endpoint from the CloudFormation stack output, including `https://`. |
| `AUTHORIZATION_TOKEN` | JWT access token used in the `Authorization` header. |
| `SITE_ID` | FormKiQ site ID. Use `default` unless your deployment uses multiple sites. |
| `DOCUMENT_ID` | Document ID to inspect. |
| `USER_ID` | User ID or username to filter activity. |

The examples below use shell variables. Replace the values before running the commands:

```bash
export HTTP_API_URL="https://your-formkiq-api.example.com"
export AUTHORIZATION_TOKEN="your-jwt-access-token"
export SITE_ID="default"
export DOCUMENT_ID="your-document-id"
export USER_ID="user@example.com"
```

## Step 1: Get Current User Activity

Use `GET /userActivities` to retrieve activity associated with the current user or a specified user.

```bash
curl -X GET "${HTTP_API_URL}/userActivities?siteId=${SITE_ID}&userId=${USER_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

Omit `userId` when you only need activity for the authenticated user.

## Step 2: Get Activity for a Document

Use `GET /documents/{documentId}/userActivities` to retrieve user activity for one document.

```bash
curl -X GET "${HTTP_API_URL}/documents/${DOCUMENT_ID}/userActivities?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

This is useful when investigating who interacted with a specific document.

## Step 3: Get Resource Activity

Use `GET /activities` to query broader resource activity.

```bash
curl -X GET "${HTTP_API_URL}/activities?siteId=${SITE_ID}&userId=${USER_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

Use resource activity when building administrative reports or reviewing activity beyond a single document.

## Step 4: Export Activity for Review

Pipe the response to a local JSON file when you need to preserve the results for review.

```bash
curl -X GET "${HTTP_API_URL}/activities?siteId=${SITE_ID}&userId=${USER_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  --output formkiq-activity-export.json
```

Do not store exported activity data in public repositories or unmanaged locations.

## Verify the Result

Confirm that:

- User activity requests return recent activity for the expected user.
- Document activity requests return activity for the expected document.
- Exported activity files are stored in an approved location.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| Activity is empty | No matching events exist or the filters are too narrow. | Remove `userId` or test with a recently changed document. |
| `403 Forbidden` | The caller cannot read activity records. | Use a token with the required administrative or governance permissions. |
| Activity is missing for a document | The wrong document ID or site was used. | Confirm `DOCUMENT_ID` and `SITE_ID`. |
| Export contains sensitive data | Activity logs may include user and resource details. | Store exports in an approved secure location. |

## Next Steps

- [Reporting and Analytics](/docs/platform/reporting-and-analytics)
- [Security](/docs/platform/security)
- [Compliance, Data Residency, and Data Sovereignty](/docs/platform/compliance-data-residency-and-data-sovereignty)
