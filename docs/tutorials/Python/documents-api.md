# Using Python Client SDK

![Upload Flow Diagram](./img/upload_flow.svg)

## Overview
This tutorial demonstrates how to use the [**FormKiQ Python Client SDK**](https://github.com/formkiq/formkiq-client-sdk-python) to:

1. Create a document inline (`POST /documents`)
2. Retrieve document metadata (`GET /documents/{documentId}`)
3. Request a presigned S3 upload URL (`POST /documents/upload`)
4. Upload file bytes directly to S3 (HTTP `PUT`)
5. Verify document metadata after upload

You will run a single Python script that performs the entire workflow end-to-end. The full example can be found [here](https://github.com/formkiq/formkiq-client-sdk-python/blob/main/example.py).

---

## Prerequisites

- Python **3.9+**
- A valid **JWT access token** for your FormKiQ API
- A **siteId** (use `"default"` if not using multi-site)
- Network access to your FormKiQ API and AWS S3

---

## Install the SDK

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

## Example Script (save as [example.py](https://github.com/formkiq/formkiq-client-sdk-python/blob/main/example.py))

This example uses the FormKiQ Python library to show both **inline upload** and **S3 presigned upload**, which is the recommended workflow for files larger than a few MB.

```python
#!/usr/bin/env python3

from __future__ import annotations
import os
from typing import Any, Dict, Optional
from pprint import pprint
import requests

import formkiq_client
from formkiq_client.api.documents_api import DocumentsApi
from formkiq_client.rest import ApiException

FORMKIQ_API_URL = os.environ.get("FORMKIQ_API_URL", "https://your-formkiq-api.example.com")
JWT_ACCESS_TOKEN = os.environ.get("JWT", "REPLACE_WITH_ACCESS_TOKEN")
SITE_ID = os.environ.get("SITE_ID", "default")

INLINE_DOC = {
    "path": "inbox/hello.txt",
    "contentType": "text/plain",
    "content": "Hello World",
}

UPLOAD_LOCAL_PATH = "example.py"
UPLOAD_DEST_PATH = "example.py"
UPLOAD_CONTENT_TYPE = "text/plain"
DEBUG_HTTP = True


def to_dict_safe(obj: Any) -> Any:
    if hasattr(obj, "to_dict"):
        return obj.to_dict()
    return obj


def build_api_client() -> DocumentsApi:
    cfg = formkiq_client.Configuration(host=FORMKIQ_API_URL)
    cfg.debug = DEBUG_HTTP
    api_client = formkiq_client.ApiClient(cfg)
    api_client.set_default_header("Authorization", f"Bearer {JWT_ACCESS_TOKEN}")
    return DocumentsApi(api_client)


def add_document_inline(api: DocumentsApi, site_id: str, body: Dict[str, Any]) -> str:
    resp = api.add_document(add_document_request=body, site_id=site_id)
    return resp.document_id or resp.documentId


def get_document_metadata(api: DocumentsApi, site_id: str, document_id: str):
    return to_dict_safe(api.get_document(document_id=document_id, site_id=site_id))


def request_presigned_upload(api: DocumentsApi, site_id: str, dest_path: str, content_type: str, content_length: int):
    upload_request = {"path": dest_path, "contentType": content_type, "contentLength": content_length}
    resp = api.add_document_upload(add_document_upload_request=upload_request, site_id=site_id)
    return {
        "document_id": resp.document_id or resp.documentId,
        "presigned_url": resp.upload_url or resp.url,
        "required_headers": resp.headers or {},
    }


def s3_put_bytes(url: str, data: bytes, content_type: str, extra_headers: Optional[Dict[str, str]] = None):
    headers = {"Content-Type": content_type}
    headers.update(extra_headers or {})
    r = requests.put(url, data=data, headers=headers)
    if r.status_code not in (200, 201):
        raise RuntimeError(f"S3 upload failed: {r.status_code} {r.text[:200]}")


def main():
    print("Using API:", FORMKIQ_API_URL)
    api = build_api_client()

    print("\n1) Creating inline document…")
    doc_id = add_document_inline(api, SITE_ID, INLINE_DOC)
    print("Document:", doc_id)

    print("\n2) Retrieving metadata…")
    pprint(get_document_metadata(api, SITE_ID, doc_id))

    print("\n3) Requesting presigned upload URL…")
    with open(UPLOAD_LOCAL_PATH, "rb") as f:
        data = f.read()

    presign = request_presigned_upload(api, SITE_ID, UPLOAD_DEST_PATH, UPLOAD_CONTENT_TYPE, len(data))
    print("Presigned URL:", presign["presigned_url"])

    print("\n4) Uploading file to S3…")
    s3_put_bytes(presign["presigned_url"], data, UPLOAD_CONTENT_TYPE, presign["required_headers"])
    print("Upload complete")

    print("\n5) Fetching metadata after upload…")
    pprint(get_document_metadata(api, SITE_ID, presign["document_id"]))


if __name__ == "__main__":
    try:
        main()
    except ApiException as e:
        print(getattr(e, "body", str(e)))
        raise
```

## Run the Example
```bash
python sdk_example.py
```