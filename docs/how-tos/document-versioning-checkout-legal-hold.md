---
sidebar_position: 10
---

# Document Versioning, Checkout, and Legal Hold

Use this guide to inspect document versions, restore a previous version, check out a document, and apply or remove legal hold.

These lifecycle controls are useful when documents are governed, reviewed, or edited by multiple people.

## Before You Begin

Confirm you have:

- A deployed FormKiQ environment. See [Quick Start](/docs/getting-started/quick-start#install-formkiq).
- A JWT access token with access to the document.
- cURL or an API client such as Postman.
- A document that has been uploaded to FormKiQ. See [Add Documents](/docs/how-tos/api-add-documents).
- Document versioning enabled if you want to test version restore behavior.

## Variables Used

| Placeholder | Description |
| --- | --- |
| `HTTP_API_URL` | FormKiQ API endpoint from the CloudFormation stack output, including `https://`. |
| `AUTHORIZATION_TOKEN` | JWT access token used in the `Authorization` header. |
| `SITE_ID` | FormKiQ site ID. Use `default` unless your deployment uses multiple sites. |
| `DOCUMENT_ID` | Document ID to manage. |
| `VERSION_KEY` | Version key returned by `GET /documents/{documentId}/versions`. |

The examples below use shell variables. Replace the values before running the commands:

```bash
export HTTP_API_URL="https://your-formkiq-api.example.com"
export AUTHORIZATION_TOKEN="your-jwt-access-token"
export SITE_ID="default"
export DOCUMENT_ID="your-document-id"
```

## Step 1: List Document Versions

Use `GET /documents/{documentId}/versions` to inspect available versions.

```bash
curl -X GET "${HTTP_API_URL}/documents/${DOCUMENT_ID}/versions?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

Set `VERSION_KEY` to the version you want to restore or activate.

```bash
export VERSION_KEY="returned-version-key"
```

## Step 2: Restore a Version

Use `PUT /documents/{documentId}/versions` to set the active version.

```bash
curl -X PUT "${HTTP_API_URL}/documents/${DOCUMENT_ID}/versions?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"versionKey\": \"${VERSION_KEY}\"
  }"
```

## Step 3: Check Out a Document

Use `PUT /documents/{documentId}/checkout` to check out a document before controlled editing.

```bash
curl -X PUT "${HTTP_API_URL}/documents/${DOCUMENT_ID}/checkout?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

Use checkout when your application needs to signal that one user or process is actively working on the document.

## Step 4: Apply Legal Hold

Use `PUT /documents/{documentId}/legalHold` to place a document under legal hold.

```bash
curl -X PUT "${HTTP_API_URL}/documents/${DOCUMENT_ID}/legalHold?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

Legal hold should be reserved for records that must be preserved for compliance, investigation, or governance reasons.

## Step 5: Remove Legal Hold

Use `DELETE /documents/{documentId}/legalHold` when the hold no longer applies.

```bash
curl -X DELETE "${HTTP_API_URL}/documents/${DOCUMENT_ID}/legalHold?siteId=${SITE_ID}" \
  -H "Authorization: ${AUTHORIZATION_TOKEN}"
```

## Verify the Result

Confirm that:

- `GET /documents/{documentId}/versions` shows the expected versions.
- The selected version is active after `PUT /documents/{documentId}/versions`.
- Document metadata reflects checkout or legal hold state after those operations.
- Users without governance permissions cannot remove legal hold.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| No versions are returned | Versioning is not enabled or the document has only one stored object. | Check module configuration and upload history. |
| Version restore fails | The version key is invalid for the document. | Copy the version key from `GET /versions`. |
| Legal hold fails | The user lacks governance permissions. | Use a token with the required permissions. |
| Updates are blocked | The document is checked out or under legal hold. | Inspect document metadata and clear the hold only when policy allows it. |

## Next Steps

- [Add Documents](/docs/how-tos/api-add-documents)
- [Backup and Recovery](/docs/platform/backup_and_recovery)
- [Document Versioning Module](/docs/formkiq-modules/modules/document-versioning)
