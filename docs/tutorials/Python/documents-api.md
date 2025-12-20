---
id: using-python-client-sdk
title: Using the Python Client SDK
sidebar_label: Python Client SDK
slug: /tutorials/using-python-client-sdk
description: Learn how to use the FormKiQ Python Client SDK to create, upload, and retrieve documents using the FormKiQ API.
tags:
  - tutorial
  - formkiq
  - api
---

# Using Python Client SDK

![Upload Flow Diagram](./img/upload_flow.svg)

## Overview

This tutorial explains how to use the FormKiQ Python Client SDK to interact with the FormKiQ Documents API. It covers creating a document inline, retrieving document metadata, requesting a presigned S3 upload URL, uploading file bytes directly to S3, and verifying metadata after upload.

Using the Python SDK provides a structured way to call FormKiQ endpoints while handling authentication headers, request serialization, and response objects consistently.

The full example can be found [here](https://github.com/formkiq/formkiq-client-sdk-python/blob/main/example.py).

---

## Prerequisites

- Python **3.9+**
- A FormKiQ deployment endpoint (API base URL)
- A valid **JWT access token** for your FormKiQ API
- A **siteId** (use `"default"` if not using multi-site)
- Network access to your FormKiQ API and AWS S3

---

## Setup

### Create and activate a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Install dependencies

```bash
python3 -m pip install --upgrade pip
python3 -m pip install requests "git+https://github.com/formkiq/formkiq-client-sdk-python.git"
```

### Set environment variables

```bash
export FORMKIQ_API_URL="https://your-formkiq-api.example.com"
export JWT="REPLACE_WITH_ACCESS_TOKEN"
export SITE_ID="default"
```

```bash
python3 -m venv .venv && source .venv/bin/activate
python3 -m pip install --upgrade pip
python3 -m pip install requests "git+https://github.com/formkiq/formkiq-client-sdk-python.git"
```

## Set Environment Variables
```bash
export FORMKIQ_API_URL="https://your-formkiq-api.example.com"
export JWT="REPLACE_WITH_ACCESS_TOKEN"
export SITE_ID="default"
```

:::warning
The JWT must be an access token, not an ID token.
:::

## Step-by-step walkthrough

### Import dependencies and read configuration

Import the SDK, HTTP client, and read environment variables used by the script.

```python
from __future__ import annotations

import os
from pprint import pprint
from typing import Any, Dict, Optional

import requests

import formkiq_client
from formkiq_client.api.documents_api import DocumentsApi
from formkiq_client.rest import ApiException


FORMKIQ_API_URL = os.environ.get("FORMKIQ_API_URL", "https://your-formkiq-api.example.com")
JWT_ACCESS_TOKEN = os.environ.get("JWT", "REPLACE_WITH_ACCESS_TOKEN")
SITE_ID = os.environ.get("SITE_ID", "default")
```

### Build a configured Documents API client

Create an ApiClient and set the Authorization header so every request includes the JWT.

```python
def build_documents_api() -> DocumentsApi:
    cfg = formkiq_client.Configuration(host=FORMKIQ_API_URL)
    api_client = formkiq_client.ApiClient(cfg)
    api_client.set_default_header("Authorization", f"Bearer {JWT_ACCESS_TOKEN}")
    return DocumentsApi(api_client)
```

### Create a document inline

Call POST /documents using add_document. The SDK response may expose document_id or documentId, depending on the generated client.

```python
def add_document_inline(api: DocumentsApi, site_id: str, body: Dict[str, Any]) -> str:
    resp = api.add_document(add_document_request=body, site_id=site_id)
    document_id = getattr(resp, "document_id", None) or getattr(resp, "documentId", None)
    if not document_id:
        raise RuntimeError("Missing documentId in add_document response")
    return document_id
```

### Retrieve document metadata

Call GET /documents/:documentId to retrieve metadata.

```python

def to_dict_safe(obj: Any) -> Any:
    if hasattr(obj, "to_dict"):
        return obj.to_dict()
    return obj

def get_document_metadata(api: DocumentsApi, site_id: str, document_id: str) -> Any:
    return to_dict_safe(api.get_document(document_id=document_id, site_id=site_id))
```

### Request a presigned S3 upload URL

Call POST /documents/upload to request a presigned URL. The response contains both the new document ID and the upload URL.

```python
def request_presigned_upload(
    api: DocumentsApi,
    site_id: str,
    dest_path: str,
    content_type: str,
    content_length: int,
) -> Dict[str, Any]:
    upload_request = {
        "path": dest_path,
        "contentType": content_type,
        "contentLength": content_length,
    }
    resp = api.add_document_upload(add_document_upload_request=upload_request, site_id=site_id)

    document_id = getattr(resp, "document_id", None) or getattr(resp, "documentId", None)
    presigned_url = getattr(resp, "upload_url", None) or getattr(resp, "url", None)

    if not document_id:
        raise RuntimeError("Missing documentId in add_document_upload response")
    if not presigned_url:
        raise RuntimeError("Missing url in add_document_upload response")

    return {
        "document_id": document_id,
        "presigned_url": presigned_url,
        "required_headers": getattr(resp, "headers", None) or {},
    }
```

:::tip
Presigned uploads are recommended for files larger than a few megabytes because the file content is sent directly to S3 instead of through the FormKiQ API.
:::

### Upload file bytes to S3

Use HTTP PUT to upload the bytes to the presigned URL. If the presigned response provides required headers, include them.

```python
def s3_put_bytes(
    url: str,
    data: bytes,
    content_type: str,
    extra_headers: Optional[Dict[str, str]] = None,
) -> None:
    headers = {"Content-Type": content_type}
    if extra_headers:
        headers.update(extra_headers)

    r = requests.put(url, data=data, headers=headers)
    if r.status_code not in (200, 201):
        raise RuntimeError(f"S3 upload failed: {r.status_code} {r.text[:200]}")
```

### Orchestrate the end-to-end workflow

Put the steps together: create inline doc, retrieve metadata, request presigned URL, upload bytes, then verify metadata.

[Full Example Script](https://github.com/formkiq/formkiq-client-sdk-python/blob/main/example.py))

```python
def main() -> None:
    print("Using API:", FORMKIQ_API_URL)
    api = build_documents_api()


    INLINE_DOC: Dict[str, Any] = {
        "path": "inbox/hello.txt",
        "contentType": "text/plain",
        "content": "Hello World",
    }

    UPLOAD_LOCAL_PATH = "example.py"
    UPLOAD_DEST_PATH = "example.py"
    UPLOAD_CONTENT_TYPE = "text/plain"

    print("\nStep 1) Create a document inline (POST /documents)")
    doc_id = add_document_inline(api, SITE_ID, INLINE_DOC)
    print("DocumentId:", doc_id)

    print("\nStep 2) Retrieve document metadata (GET /documents/{documentId})")
    pprint(get_document_metadata(api, SITE_ID, doc_id))

    print("\nStep 3) Request a presigned S3 upload URL (POST /documents/upload)")
    with open(UPLOAD_LOCAL_PATH, "rb") as f:
        data = f.read()

    presign = request_presigned_upload(
        api=api,
        site_id=SITE_ID,
        dest_path=UPLOAD_DEST_PATH,
        content_type=UPLOAD_CONTENT_TYPE,
        content_length=len(data),
    )
    print("Presigned URL:", presign["presigned_url"])

    print("\nStep 4) Upload bytes directly to S3 (HTTP PUT)")
    s3_put_bytes(
        url=presign["presigned_url"],
        data=data,
        content_type=UPLOAD_CONTENT_TYPE,
        extra_headers=presign["required_headers"],
    )
    print("Upload complete")

    print("\nStep 5) Verify document metadata after upload")
    pprint(get_document_metadata(api, SITE_ID, presign["document_id"]))
```

## Common errors and troubleshooting

### 401 Unauthorized

- Symptom: API calls return 401.
- Fix: Confirm JWT is set and is a valid access token, and the Authorization header uses Bearer &lt;token&gt;

### 403 Forbidden
- Symptom: API calls return 403.
- Fix: Verify the token has permission to access the specified SITE_ID

### S3 upload failed (403 / 400)
- Symptom: The PUT request returns an error
- Fix: Ensure you upload using the exact presigned URL returned, and include any headers returned in the headers field (if provided)

## Next steps

- Add document attributes and metadata on create/upload
- Use document search, tags, and attribute queries
- Integrate rulesets and automation workflows around uploaded documents
- Explore the FormKiQ TypeScript Client SDK for client-side or Node.js integrations
