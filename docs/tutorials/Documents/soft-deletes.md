---
sidebar_position: 70
---

# Understanding Soft Delete in FormKiQ

## What is Soft Delete?
Soft Delete is a feature in FormKiQ that allows you to temporarily remove a document's metadata, attributes, and other information from being retrieved through API requests, without permanently deleting the data. This is particularly useful when you want to hide documents temporarily or implement a recycle bin-like functionality.

## Key Operations

### 1. Performing a Soft Delete
To soft delete a document, you can use the DELETE endpoint with the `softDelete` query parameter:

```http
DELETE /documents/{documentId}?softDelete=true
```

When you set `softDelete=true`:
- The document's metadata, attributes, and other information will be hidden from regular API requests
- The document isn't permanently deleted and can be restored later
- The document remains in the system but won't appear in regular document listings

### 2. Viewing Soft-Deleted Documents
To view documents that have been soft-deleted, you can use the GET documents endpoint with the `deleted` parameter:

```http
GET /documents?deleted=true
```

This will return a list of all soft-deleted documents that you have access to.

### 3. Restoring Soft-Deleted Documents
To restore a soft-deleted document, you can use the restore endpoint:

```http
PUT /documents/{documentId}/restore
```

This will make the document visible again in regular API requests and document listings.

### 4. Permanent Deletion
If you want to permanently delete a soft-deleted document, you can use the DELETE endpoint with `softDelete=false`:

```http
DELETE /documents/{documentId}?softDelete=false
```

This will permanently remove the document and its associated data from the system.

## Best Practices

1. **Default Behavior**: When implementing document deletion in your application, consider using soft delete as the default option to prevent accidental permanent deletions.

2. **Restoration Process**: Implement a clear process for restoring soft-deleted documents, including appropriate permissions and validation.

3. **Cleanup Strategy**: Develop a strategy for handling soft-deleted documents, such as automatically purging them after a certain period or requiring manual review before permanent deletion.

4. **Audit Trail**: Keep track of when documents are soft-deleted and restored for audit purposes using the document's metadata and user activities.

## Example Workflow (node.js)

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

This feature provides a safety net for document management while maintaining flexibility in how you handle document deletion in your application.