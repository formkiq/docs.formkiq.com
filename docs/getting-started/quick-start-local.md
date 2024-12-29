---
sidebar_position: 1
---

# Quick Start (Local)

Run FormKiQ locally using Docker for development and testing. This guide will help you:
- Set up a local FormKiQ environment
- Upload and retrieve documents
- Search documents
- Manage document tags

## Prerequisites

* Docker v20.10 or higher - [Installation Guide](https://docs.docker.com/get-docker/)
* Docker Compose v2.0 or higher - [Installation Guide](https://docs.docker.com/compose/install)
* cURL or API Client (e.g., [Postman](https://www.postman.com))
* Optional: [jq](https://stedolan.github.io/jq) - Command-line JSON processor

System Requirements:
- 4GB RAM minimum
- 10GB free disk space

## Launching FormKiQ

FormKiQ can be launched using [Docker Compose](https://docs.docker.com/compose/install). 

Using the following [docker-compose.yml](https://raw.githubusercontent.com/formkiq/formkiq-core/refs/heads/master/netty-server/docker-compose.yml) file you can launch FormKiQ local using

```
docker-compose -f docker-compose.yml up -d
```

**OR**

use the following bash script.

```bash
curl -O https://raw.githubusercontent.com/formkiq/formkiq-core/refs/heads/master/netty-server/docker-compose.yml && docker-compose up
```

Please note: You may need to run "docker login" to login with your Docker credentials beforehand, if you have not done so already.

## Authentication

The default API key is "changeme". Add it to your HTTP headers:
```bash
-H "Authorization: changeme"
```
:::note
You will likely want to change this, even on your local installation.
:::

## Document Operations

### Upload Documents

:::note
Maximum file size: 10MB. For larger files, use GET /documents/upload to generate a presigned URL.
:::

#### Upload Text Content
```bash
curl -X POST -H "Authorization: changeme" \
-d '{ "path": "user.json","contentType": "application/json", "content": "{\"name\":\"John Smith\"}","tags": [{"key": "lastName","value": "Smith"}]}' \
"http://localhost:8080/documents"
```

#### Upload Base64 Content
```bash
# Create base64 content
echo -n 'This is a test content' | openssl base64
# Returns: VGhpcyBpcyBhIHRlc3QgY29udGVudA==

# Upload document
curl -X POST -H "Authorization: changeme" \
-d '{ "isBase64":true, "path": "test.txt","contentType": "text/plain", "content": "VGhpcyBpcyBhIHRlc3QgY29udGVudA=="}' \
"http://localhost:8080/documents"
```

### Retrieve Documents

List today's documents:
```bash
curl -H "Authorization: changeme" "http://localhost:8080/documents" | jq
```

Get document by ID:
```bash
curl -H "Authorization: changeme" "http://localhost:8080/documents/<DOCUMENT_ID>" | jq
```

Get document download URL:
```bash
curl -H "Authorization: changeme" "http://localhost:8080/documents/<DOCUMENT_ID>/url" | jq
```

### Search Documents

Search by tag key:
```bash
curl -X POST -H "Authorization: changeme" \
-d '{"query": {"tag": {"key": "lastName"}}}' "http://localhost:8080/search" | jq
```

Search by key and value:
```bash
curl -X POST -H "Authorization: changeme" \
-d '{"query": {"tag": {"key": "lastName", "eq": "Smith"}}}' "http://localhost:8080/search" | jq
```

Search with begins-with (case sensitive):
```bash
curl -X POST -H "Authorization: changeme" \
-d '{"query": {"tag": {"key": "lastName","beginsWith":"S"}}}' "http://localhost:8080/search" | jq
```

### Document Tags

Add tag:
```bash
curl -X POST -H "Authorization: changeme" \
-d '{"key": "firstName","value": "John"}' "http://localhost:8080/documents/<DOCUMENT_ID>/tags"
```

List tags:
```bash
curl -H "Authorization: changeme" "http://localhost:8080/documents/<DOCUMENT_ID>/tags" | jq
```

## Web Console Access

Access the web console at http://localhost

Login credentials:
- Email: admin@me.com
- Password: password

## Cleanup

Stop and remove containers:
```bash
docker-compose down
```

Remove persistent data:
```bash
rm -rf ./formkiq ./typesense-data
```

## Troubleshooting

Common issues and solutions:

1. Port conflicts
   - Error: "port is already allocated"
   - Solution: Stop services using ports 80, 8080, 9000, or 8108

2. Container startup failure
   - Check logs: `docker-compose logs`
   - Ensure sufficient system resources

For additional help:
- Visit [FormKiQ GitHub](https://github.com/formkiq/formkiq-core)
- Join our [Slack Community](https://join.slack.com/t/formkiqcommunity/shared_invite/zt-2ki1i21w1-9ZYagvhY7ex1pH5Cyg2O3g)

For more API endpoints, see the [FormKiQ API Reference](/docs/category/api-reference).