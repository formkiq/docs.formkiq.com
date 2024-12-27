---
sidebar_position: 1
---

# Quick Start (Local)

**A quick start guide for running FormKiQ on your local machine.**

The FormKiQ Document Management Platform is designed primarily to run in your AWS account. This quick start walks through how to run the FormKiQ platform on your local machine to enable developers to develop and test applications running in your own development environment.

## Prerequisite

* Installed Docker - https://docs.docker.com/get-docker/
* Install Docker Compose - https://docs.docker.com/compose/install
* Install either: cURL or your favorite API Client, like https://www.postman.com
* Optionally install: https://stedolan.github.io/jq, a command-line JSON processor which formats JSON so it is more readable.

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

## API Key

We will be using FormKiQ's Key-based Authentication, using an API Key. Since this is a local instance, the API Key is set by default to "changeme". You will probably want to change this, even on your local installation. But for this demo, we will add this API Key and value to our HTTP Headers for cURL:

```
-H "Authorization: changeme"
```

## Upload a Document

FormKiQ can receive documents or data in a variety of formats. 

:::note
Upload POST requests have a filesize limit of 10 MB. For larger files, you can use the GET /documents/upload endpoint, which generates an Amazon S3 Presigned URL you can send a PUT request to.
:::

### Text Content

Using cURL, upload the document and add a document tag:

```
curl -X POST -H "Authorization: changeme" \
-d '{ "path": "user.json","contentType": "application/json", "content": "{\"name\":\"John Smith\"}","tags": [{"key": "lastName","value": "Smith"}]}' \
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

Using cURL, upload the document:
```
curl -X POST -H "Authorization: changeme" -d '{ "isBase64":true, "path": "test.txt","contentType": "text/plain", "content": "VGhpcyBpcyBhIHRlc3QgY29udGVudA=="}' \
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
curl -H "Authorization: changeme" "http://localhost:8080/documents"
```

Here's a sample response:
```
{"documents":[{"path":"test.txt","insertedDate":"2023-11-20T23:10:42+0000","lastModifiedDate":"2023-11-20T23:10:42+0000","checksum":"75e6f8645a9f5059e0970f95a3a0c0be","siteId":"default","contentLength":22,"documentId":"3b94868c-1986-47df-a78f-36afc6c8d1cd","contentType":"text/plain","userId":"admin"},{"path":"user.json","insertedDate":"2023-11-20T23:10:58+0000","lastModifiedDate":"2023-11-20T23:10:58+0000","checksum":"c6961ae422fa7570aec5187ef6480148","siteId":"default","contentLength":21,"documentId":"9c6fd25d-4f8e-44c6-8d99-c64bcac23345","contentType":"application/json","userId":"admin"}]}
```

The response is hard to read, so if you've installed **jq**, you should add it to the request:
```
curl -H "Authorization: changeme" "http://localhost:8080/documents" | jq
```
This gives a response that is much easier to read and work with:
```
{
  "documents": [
    {
      "path": "test.txt",
      "insertedDate": "2023-11-20T23:10:42+0000",
      "lastModifiedDate": "2023-11-20T23:10:42+0000",
      "checksum": "75e6f8645a9f5059e0970f95a3a0c0be",
      "siteId": "default",
      "contentLength": 22,
      "documentId": "3b94868c-1986-47df-a78f-36afc6c8d1cd",
      "contentType": "text/plain",
      "userId": "admin"
    },
    {
      "path": "user.json",
      "insertedDate": "2023-11-20T23:10:58+0000",
      "lastModifiedDate": "2023-11-20T23:10:58+0000",
      "checksum": "c6961ae422fa7570aec5187ef6480148",
      "siteId": "default",
      "contentLength": 21,
      "documentId": "9c6fd25d-4f8e-44c6-8d99-c64bcac23345",
      "contentType": "application/json",
      "userId": "admin"
    }
  ]
}
```

You can retrieve documents for a specific date using:
```
curl -H "Authorization: changeme" "http://localhost:8080/documents?date=2020-05-20"
```

*NOTE: there is also a `tz` parameter that allows you to specify when your date actually begins and ends, e.g., `&tz=-0500`*

Run the following cURL command to retrieve information about a specific document:
```
curl -H "Authorization: changeme" "http://localhost:8080/documents/<DOCUMENT_ID>"
```
Here's the JSON response (with jq):
```
{
  "lastModifiedDate": "2023-11-20T23:10:58+0000",
  "userId": "admin",
  "path": "user.json",
  "insertedDate": "2023-11-20T23:10:58+0000",
  "checksum": "c6961ae422fa7570aec5187ef6480148",
  "siteId": "default",
  "contentLength": 21,
  "documentId": "9c6fd25d-4f8e-44c6-8d99-c64bcac23345",
  "contentType": "application/json"
}
```

Run the following cURL command to retrieve a URL for accessing a document's actual content, for download or inline viewing:
```
curl -H "Authorization: changeme" "http://localhost:8080/documents/<DOCUMENT_ID>/url"
```
JSON response
```
{
  "url": "http://localhost:9000/documents/9c6fd25d-4f8e-44c6-8d99-c64bcac23345?response-content-disposition=attachment%3B%20filename%3D%22user.json%22&response-content-type=application%2Fjson&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231124T162507Z&X-Amz-SignedHeaders=host&X-Amz-Expires=172800&X-Amz-Credential=minioadmin%2F20231124%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Signature=76d944b3b0ac71f0850106ba812033b341d8968d035b5bc74abe7eb7efab114c",
  "documentId": "9c6fd25d-4f8e-44c6-8d99-c64bcac23345"
}
```

You can retrieve this document content using a simple cURL command, using only the URL provided in the previous request. There is no Cognito authentication header required, as the time-sensitive authentication is provided by CloudFront within the URL parameters.

The previous `/url` request creates a **download** of the document. For inline viewing in the browser, you can add a parameter, `?inline=true"`; of course, if the browser has not enabled inline vieweing of the content type, you will still receive a download of that file.

NOTE: In the browser, you can open http://localhost to run the console access these documents for viewing inline or downloading.  The login is listed in your docker-compose file:

Email: admin@me.com  
Password: password

## Document Search

Run the following cURL command to search by a specific key:
```
curl -X POST -H "Authorization: changeme" \
-d '{"query": {"tag": {"key": "lastName"}}}' "http://localhost:8080/search"
```
NOTE: if you're newer to cURL, using ` \ ` at the end of a line allows you to extend your command over multiple lines, to make it more readable.

Here is a sample JSON response (with jq):
```
{
  "documents": [
    {
      "path": "user.json",
      "insertedDate": "2023-11-20T23:10:58+0000",
      "lastModifiedDate": "2023-11-20T23:10:58+0000",
      "checksum": "c6961ae422fa7570aec5187ef6480148",
      "contentLength": 21,
      "documentId": "9c6fd25d-4f8e-44c6-8d99-c64bcac23345",
      "matchedTag": {
        "type": "USERDEFINED",
        "value": "Smith",
        "key": "lastName"
      },
      "contentType": "application/json",
      "userId": "admin"
    }
  ]
}
```

You can see that the matched tag is included in the response.

Run the following cURL command to search by a specific key and value:
```
curl -X POST -H "Authorization: changeme" \
-d '{"query": {"tag": {"key": "lastName", "eq": "Smith"}}}' "http://localhost:8080/search"
```
And here's a sample JSON response (with jq):
```
{
  "documents": [
    {
      "path": "user.json",
      "insertedDate": "2023-11-20T23:10:58+0000",
      "lastModifiedDate": "2023-11-20T23:10:58+0000",
      "checksum": "c6961ae422fa7570aec5187ef6480148",
      "contentLength": 21,
      "documentId": "9c6fd25d-4f8e-44c6-8d99-c64bcac23345",
      "matchedTag": {
        "type": "USERDEFINED",
        "value": "Smith",
        "key": "lastName"
      },
      "contentType": "application/json",
      "userId": "admin"
    }
  ]
}
```

Run the following cURL command to search using "Begins With" (which is case sensitive):
```
curl -X POST -H "Authorization: changeme" \
-d '{"query": {"tag": {"key": "lastName","beginsWith":"S"}}}' "http://localhost:8080/search"
```
Here's a sample JSON response (with jq):
```
{
  "documents": [
    {
      "path": "user.json",
      "insertedDate": "2023-11-20T23:10:58+0000",
      "lastModifiedDate": "2023-11-20T23:10:58+0000",
      "checksum": "c6961ae422fa7570aec5187ef6480148",
      "contentLength": 21,
      "documentId": "9c6fd25d-4f8e-44c6-8d99-c64bcac23345",
      "matchedTag": {
        "type": "USERDEFINED",
        "value": "Smith",
        "key": "lastName"
      },
      "contentType": "application/json",
      "userId": "admin"
    }
  ]
}
```

## Tagging Documents
Document metadata is assigned using tags. A tag is made up of a key and an optional value.

 Run the following cURL command to add a tag to a document:
```
curl -X POST -H "Authorization: changeme" \
-d '{"key": "firstName","value": "John"}' "http://localhost:8080/documents/<DOCUMENT_ID>/tags"
```
This should give you a response:
```
{
  "message": "Created Tag 'firstName'."
}
```

Run the following cURL command to retrieve a document's tags:
```
curl -H "Authorization: changeme" "http://localhost:8080/documents/<DOCUMENT_ID>/tags"
```
Here's a sample JSON response (with jq):
```
{
  "tags": [
    {
      "key": "firstName",
      "value": "John",
      "userId": "admin",
      "insertedDate": "2023-11-24T16:48:01+0000",
      "type": "userdefined"
    },
    {
      "key": "lastName",
      "value": "Smith",
      "userId": "admin",
      "insertedDate": "2023-11-20T23:10:58+0000",
      "type": "userdefined"
    }
  ]
}
```

## API Reference

See the [FormKiQ API Reference](/docs/category/api-reference) for more endpoints you can try out.

If you have any questions, reach out to us on our https://github.com/formkiq/formkiq-core or in our [FormKiQ Slack Community](https://join.slack.com/t/formkiqcommunity/shared_invite/zt-2ki1i21w1-9ZYagvhY7ex1pH5Cyg2O3g).