---
sidebar_position: 70
---

# Understanding Soft Delete in FormKiQ

## What You Will Build

You will soft delete a document, list soft-deleted documents, restore the document, and understand when permanent deletion should be used.

## Before You Begin

- A valid FormKiQ account or API environment.
- [Access credentials and FormKiQ API Endpoint URL](/docs/getting-started/api-walkthrough#acquire-access-token).
- A document ID you can safely delete and restore.

## Workflow Overview

1. Soft delete a document.
2. List soft-deleted documents.
3. Restore the document.
4. Review permanent deletion behavior.

## What is Soft Delete?
Soft Delete is a feature in FormKiQ that allows you to temporarily remove a document's metadata, attributes, and other information from being retrieved through API requests, without permanently deleting the data. This is particularly useful when you want to hide documents temporarily or implement a recycle bin-like functionality.

## Step 1: Soft Delete a Document

To soft delete a document, you can use the DELETE endpoint with the `softDelete` query parameter:

```http
DELETE /documents/{documentId}?softDelete=true
```

When you set `softDelete=true`:
- The document's metadata, attributes, and other information will be hidden from regular API requests
- The document isn't permanently deleted and can be restored later
- The document remains in the system but won't appear in regular document listings

## Step 2: View Soft-Deleted Documents
To view documents that have been soft-deleted, you can use the GET documents endpoint with the `deleted` parameter:

```http
GET /documents?deleted=true
```

This will return a list of all soft-deleted documents that you have access to.

## Step 3: Restore Soft-Deleted Documents
To restore a soft-deleted document, you can use the restore endpoint:

```http
PUT /documents/{documentId}/restore
```

This will make the document visible again in regular API requests and document listings.

## Step 4: Permanently Delete a Document
If you want to permanently delete a soft-deleted document, you can use the DELETE endpoint with `softDelete=false`:

```http
DELETE /documents/{documentId}?softDelete=false
```

This will permanently remove the document and its associated data from the system.

## Verify the Result

Confirm that the document is hidden from normal listings after soft delete, appears when `deleted=true` is used, and appears again after restore.

## Clean Up

Restore any documents that should remain active. Permanently delete only documents that are safe to remove.

## Best Practices

1. **Default Behavior**: When implementing document deletion in your application, consider using soft delete as the default option to prevent accidental permanent deletions.

2. **Restoration Process**: Implement a clear process for restoring soft-deleted documents, including appropriate permissions and validation.

3. **Cleanup Strategy**: Develop a strategy for handling soft-deleted documents, such as automatically purging them after a certain period or requiring manual review before permanent deletion.

4. **Audit Trail**: Keep track of when documents are soft-deleted and restored for audit purposes using the document's metadata and user activities.

## Example Workflow (Node.js)

1. User wants to delete a document:
```javascript
// Soft delete the document
await fetch(`/documents/${documentId}?softDelete=true`, {
  method: 'DELETE',
  headers: {
    'Authorization': 'YOUR_TOKEN'
  }
});
```

2. Later, view soft-deleted documents:
```javascript
// List soft-deleted documents
const response = await fetch('/documents?deleted=true', {
  headers: {
    'Authorization': 'YOUR_TOKEN'
  }
});
const deletedDocs = await response.json();
```

3. Restore a soft-deleted document:
```javascript
// Restore the document
await fetch(`/documents/${documentId}/restore`, {
  method: 'PUT',
  headers: {
    'Authorization': 'YOUR_TOKEN'
  }
});
```

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| Soft-deleted document still appears | You are querying with `deleted=true` or cached data. | Check request parameters and refresh the listing. |
| Restore fails | The document was hard deleted or purged. | Restore works only for soft-deleted documents. |
| Permanent delete was accidental | Hard deletes are not recoverable through normal restore. | Use soft delete as the default application behavior. |

## Next Steps

- [Documents](/docs/features/documents)
- [Documents API](/docs/tutorials/Documents/documents-api)
