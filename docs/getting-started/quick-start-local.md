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

1. Create a new directory and save this `docker-compose.yml` file:

```yaml
version: '3.8'
services:

  console:
    image: formkiq/document-console:3.2.4-SNAPSHOT-20231107
    ports:
      - "80:80"
    environment:
      HTTP_API_URL: http://localhost:8080
      COGNITO_API_URL: http://localhost:8080
      COGNITO_ENDPOINT_OVERRIDE: http://localhost:8080
  
  typesense:
    image: typesense/typesense:0.25.1
    ports:
      - "8108:8108"
    volumes:
      - ./typesense-data:/data
    command: '--data-dir /data --api-key=xyz --enable-cors'
    
  formkiq:
    image: formkiq/api-server:1.13.0-SNAPSHOT-20231125
    depends_on:
      - minio
      - dynamodb
    ports:
      - "8080:8080"
    environment:
      PORT: 8080
      DYNAMODB_URL: http://dynamodb:8000
      S3_URL: http://minio:9000
      S3_PRESIGNER_URL: http://localhost:9000
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
      ADMIN_USERNAME: admin@me.com
      ADMIN_PASSWORD: password
      API_KEY: changeme
      TYPESENSE_HOST: http://typesense:8108
      TYPESENSE_API_KEY: xyz

  minio:
    image: minio/minio:RELEASE.2023-08-23T10-07-06Z
    ports:
      - "9000:9000"
      - "9090:9090"
    environment:
      MINIO_DOMAIN: minio
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
      MINIO_NOTIFY_WEBHOOK_ENABLE_DOCUMENTS: on
      MINIO_NOTIFY_WEBHOOK_ENDPOINT_DOCUMENTS: http://formkiq:8080/minio/s3/documents
      MINIO_NOTIFY_WEBHOOK_ENABLE_STAGINGDOCUMENTS: on
      MINIO_NOTIFY_WEBHOOK_ENDPOINT_STAGINGDOCUMENTS: http://formkiq:8080/minio/s3/stagingdocuments
    networks:
      default:
        aliases:
          - documents.minio
          - stagingdocuments.minio
    volumes:
      - ./formkiq/minio:/data
    command: server /data --address :9000 --console-address :9090

  dynamodb:
    image: amazon/dynamodb-local:1.24.0
    command: "-jar DynamoDBLocal.jar -sharedDb -dbPath /data"
    ports:
      - "8000:8000"
    volumes:
      - ./formkiq/dynamodb:/data
```

2. Login to Docker (if needed):
```bash
docker login
```

3. Launch FormKiQ:
```bash
docker-compose -f docker-compose.yml up -d
```

Expected startup time: ~30 seconds

## Authentication

The default API key is "changeme". Add it to your HTTP headers:
```bash
-H "Authorization: changeme"
```

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