---
sidebar_position: 1
---

# Quick Start (Local)

Quick start guide for running FormKiQ on your local machine.

The FormKiQ Document Management Platform is designing to run in your AWS account. This quick start walks through how to run the FormKiQ platform on your local machine to enable developers to develop and test applications running in your own development environment.

## Prerequisite

* Installed Docker - https://docs.docker.com/get-docker/
* Install Docker Compose - https://docs.docker.com/compose/install
* Install either: cURL or your favorite API Client, like https://www.postman.com
* Optionally install: https://stedolan.github.io/jq, a command-line JSON processor which formats JSON so it is more readable.

## Launching FormKiQ

FormKiQ can be launched using [Docker Compose](https://docs.docker.com/compose/install). Save the `docker-compose.yml` file below into a new folder.

**docker-compose.yml**

```
version: '3.8'
services:

  formkiq:
    image: formkiq/api-server:1.13.0-SNAPSHOT
    depends_on:
      - minio
      - dynamodb
    ports:
      - "8080:8080"
    environment:
      PORT: 8080
      DYNAMODB_URL: http://dynamodb:8000
      S3_URL: http://minio:9000
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
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
    command: server /data --console-address :9090

  dynamodb:
    image: amazon/dynamodb-local:1.22.0
    command: "-jar DynamoDBLocal.jar -sharedDb -dbPath /data"
    ports:
      - "8000:8000"
    volumes:
      - ./formkiq/dynamodb:/data
```

Launch using:
```
docker-compose -f docker-compose.yml up -d
```

## Upload a Document

FormKiQ can receive documents or data in a variety of formats. 

:::note
Upload POST requests have a filesize limit of 10 MB. For larger files, you can use the GET /documents/upload endpoint, which generates an Amazon S3 Presigned URL you can send a PUT request to.
:::

### Text Content

Using cURL, upload the document and add a document tag:

```
curl -X POST -H "Content-Type: application/json" \
-d '{ "path": "user.json","content": "{\"name\":\"John Smith\"}","tags": [{"key": "content","value": "text"}]}' \
"http://localhost:8080/documents"
```

The JSON response should provide a Document ID that can be used to make further API requests:
```
{
  "documentId":"07c040e4-7b3d-469d-8182-0ee27b422077"
}
```

### Base64 Content

Document content can be Base64-encoded before uploading. You can use a utility like https://www.base64encode.org or, if you have OpenSSL installed, you can create a quick test document: 
```
echo -n 'This is a test content' | openssl base64
```
The above command should create the following Base64-encoded string: 
```
VGhpcyBpcyBhIHRlc3QgY29udGVudA==
```

Using cURL, upload the document and add a document tag:
```
curl -X POST -H "Content-Type: text/plain" -d '{ "isBase64":true, "path": "user.json","content": "VGhpcyBpcyBhIHRlc3QgY29udGVudA==","tags": [{"key": "content","value": "text"}]}' \
"http://localhost:8080/documents"
```

The JSON response should provide a Document ID that can be used to make further API requests:
```
{
  "documentId":"07c040e4-7b3d-469d-8182-0ee27b422077"
}
```

## Retrieve Document(s)

Run the following cURL command to retrieve documents that have been added today.
```
curl "http://localhost:8080/documents"
```

You can specify a particular date using:
```
curl "http://localhost:8080/documents?date=2020-05-20"
```

For a nicer formatting in responses, you can pipe the response to jq.
```
curl "http://localhost:8080/documents" | jq
```

JSON response
```
{
  documents: [
    {
    "documentId": "11546f7d-0489-4e92-8763-79c83c0982c1",
    "insertedDate": "...",
    "path": "...",
    "userId": "...",
    "contentType": "...",
    "checksum": "...",
    "contentLength": ...
    },
    ...
  ]
}
```

Run the following cURL command to retrieve information about a specific document:
```
curl "http://localhost:8080/documents/<DOCUMENT_ID>"
```
JSON response
```
{
  "documentId": "11546f7d-0489-4e92-8763-79c83c0982c1",
  "insertedDate": "...",
  "path": "...",
  "userId": "...",
  "contentType": "...",
  "checksum": "...",
  "contentLength": ...
}
```

Run the following cURL command to retrieve a url for accessing a document's content:
```
curl "http://localhost:8080/documents/<DOCUMENT_ID>/url"
```
JSON response
```
{
  "url": "...",
  "documentId": "11546f7d-0489-4e92-8763-79c83c0982c1"
}
```

You can retrieve this document content using a simple cURL command, using only the URL provided in the previous request. There is no Cognito authentication header required, as the time-sensitive authentication is provided by CloudFront within the URL parameters.

## Document Search

Run the following cURL command to search by a specific key:
```
curl -X POST -d '{"query": {"tag": {"key": "content"}}}' "http://localhost:8080/search"
```
JSON response
```
{
  "documents": [
    {
      "path": "user.json",
      "insertedDate": "2023-09-02T19:46:10+0000",
      "lastModifiedDate": "2023-09-02T19:46:10+0000",
      "checksum": "\"c6961ae422fa7570aec5187ef6480148\"",
      "contentLength": 21,
      "documentId": "dfcfbc9f-2af2-426a-83db-a7d5d99d8305",
      "matchedTag": {
        "type": "USERDEFINED",
        "value": "text",
        "key": "content"
      },
      "contentType": "application/octet-stream",
      "userId": "admin"
    }
  ]
}
```

Run the following cURL command to search by a specific key and value:
```
curl -X POST -d '{"query": {"tag": {"key": "content", "eq": "text"}}}' \
"http://localhost:8080/search"
```
JSON response
```
{
  "documents": [
    {
      "path": "user.json",
      "insertedDate": "2023-09-02T19:46:10+0000",
      "lastModifiedDate": "2023-09-02T19:46:10+0000",
      "checksum": "\"c6961ae422fa7570aec5187ef6480148\"",
      "contentLength": 21,
      "documentId": "dfcfbc9f-2af2-426a-83db-a7d5d99d8305",
      "matchedTag": {
        "type": "USERDEFINED",
        "value": "text",
        "key": "content"
      },
      "contentType": "application/octet-stream",
      "userId": "admin"
    }
  ]
}
```

Run the following cURL command to search using "Begins With" (which is case sensitive):
```
curl -X POST -d '{"query": {"tag": {"key": "content","beginsWith":"t"}}}' \
"http://localhost:8080/search"
```
JSON response
```
{
  "documents": [
    {
      "path": "user.json",
      "insertedDate": "2023-09-02T19:46:10+0000",
      "lastModifiedDate": "2023-09-02T19:46:10+0000",
      "checksum": "\"c6961ae422fa7570aec5187ef6480148\"",
      "contentLength": 21,
      "documentId": "dfcfbc9f-2af2-426a-83db-a7d5d99d8305",
      "matchedTag": {
        "type": "USERDEFINED",
        "value": "text",
        "key": "content"
      },
      "contentType": "application/octet-stream",
      "userId": "admin"
    }
  ]
}
```

## Tagging Documents
Document metadata is assigned using tags. A tag is made up of a key and an optional value.

 Run the following cURL command to add a tag to a document:
```
curl -X POST -d '{"key": "category","value": "test"}' \
"http://localhost:8080/documents/<DOCUMENT_ID>/tags"
```
JSON response
```
{
  "message": "Created Tag 'category'."
}
```

Run the following cURL command to retrieve a document's tags:
```
curl "http://localhost:8080/documents/<DOCUMENT_ID>/tags"
```
JSON response
```
{
  "tags": [
    {
      "key": "category",
      "value": "test",
      "userId": "admin",
      "insertedDate": "2023-09-02T19:50:18+0000",
      "type": "userdefined"
    },
    {
      "key": "content",
      "value": "text",
      "userId": "admin",
      "insertedDate": "2023-09-02T19:46:10+0000",
      "type": "userdefined"
    }
  ]
}
```

## API Reference

See the [FormKiQ API Reference](/docs/api-reference/formkiq-http-api/) for more endpoints you can try out.