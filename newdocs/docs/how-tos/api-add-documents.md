---
sidebar_position: 2
---

# Adding Document(s)

This tutorial will take you through different way to add documents using the FormKiQ API.

## Prerequisite

* You have installed FormKiQ; see the <a href="/docs/getting-started/quick-start#install-formkiq">FormKiQ One-Click Installation Links</a> for more information
* Install either: cURL or your favorite API Client, like https://www.postman.com.
* Optionally install: https://stedolan.github.io/jq, a command-line JSON processor which formats JSON so it is more readable.
* All shell commands are shown for Unix-based systems. Windows has analogous commands for each.

## Get JWT Authentication Token

You first need to get an `authorization` token to access the FormKiQ API. See xref:how-to:jwt-authentication-token.adoc[Getting an JWT Authentication Token] for steps on how to get the token.

## CloudFormation Outputs

We are going to need to know the name FormKiQ of a few AWS resources creating during the FormKiQ installation. Opening the [CloudFormation console](https://console.aws.amazon.com/cloudformation), find your FormKiQ stack and click the `Outputs` tab.

![CloudFormation Outputs](./img/cf-outputs-apis.png)

The following are outputs we'll need to know.

For all API requests the following table describes the values that need to be replaced in the API request.

| Argument | Description
| -------- | ------- |
| `HttpApiUrl` | The URL for the API endpoint that uses Cognito authorization

## Adding a Document

The `POST /documents` API is the primary method for adding documents that are less than 5MB in size.

## Adding a Text Document

The following is an example of adding a simple text document.

```
curl -X POST https://HTTP_API_URL/documents \
   -H "Authorization: AUTHORIZATION_TOKEN" -d '{"path": "test.txt","contentType": "text/plain","content": "This is sample content"}'
```

A successful response will return a unique documentId of the added document:
```
{
  "documentId" : "b18e0d3b-48cb-4589-ab5d-f19e27b44f05"
}
```

## Adding a Base64 Encoded Document

The API supports [Base64-encoded](https://en.wikipedia.org/wiki/Base64) documents.

There are different ways to convert a file to [Base64](https://en.wikipedia.org/wiki/Base64). There are may tools and websites like [base64.guru](https://base64.guru/converter/encode/file) that can be used.


```
curl -X POST https://HTTP_API_URL/documents \
   -H "Authorization: AUTHORIZATION_TOKEN" -d '{"path": "sample.pdf","contentType": "application/pdf","isBase64":true,"content": "BASE64_CONTENT"}'
```

A successful response will return a unique documentId of the added document:
```
{
  "documentId":"7e0aca55-f6b2-4b93-95df-c188691dcb99"
}
```

## Adding Document greater than 5 MB

FormKiQ supports documents up to 5GB in size. When adding a document that is greater than 5 MB in size you need to ask FormKiQ for a large file upload url.

```
curl -X GET https://HTTP_API_URL/documents/uploads?path=sample.pdf \
   -H "Authorization: AUTHORIZATION_TOKEN"
```

A unique URL is returned that will allow you to add a document:
```
{
  "url" : "https://formkiq-core-dev-documents-XXXXXX.s3.us-east-2.amazonaws.com/05c1dc43-e9f3-4bb5 ....",
  "documentId" : "05c1dc43-e9f3-4bb5-9732-077c02dac2c9"
}
```

Then using the URL above to add the document.

```
curl -v -H "Content-Type: FILE_CONTENT_TYPE" --upload-file FILE_NAME "https://formkiq-core-dev-documents-XXXXX.s3.us-east-2.amazonaws.com/05c1dc43-e9f3-4bb5-9732-077c02da ...."
```

## Get Document Link

Using the DocumentId you can get a link to the document.

```
curl -X GET https://HTTP_API_URL/documents/DOCUMENT_ID/url \
   -H "Authorization: AUTHORIZATION_TOKEN"
```

Returns unique URL is returned that will allow you to get the document contents:
```
{
  "url" : "https://formkiq-core-dev-documents-XXXXXX.s3.us-east-2.amazonaws.com/05c1dc43-e9f3-4bb5 ....",
  "documentId" : "05c1dc43-e9f3-4bb5-9732-077c02dac2c9"
}
```

Then you can fetch the original document by:

```
curl "URL" --output sample.pdf
```
