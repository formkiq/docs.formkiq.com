---
sidebar_position: 3
---

# Adding Document Tag(s)

This tutorial will take you through different way to add tags to documents using the FormKiQ API.

## Prerequisite

* You have installed FormKiQ; see the <a href="/docs/getting-started/quick-start#install-formkiq">FormKiQ One-Click Installation Links</a> for more information
* Install either: cURL or your favorite API Client, like https://www.postman.com.
* Optionally install: https://stedolan.github.io/jq, a command-line JSON processor which formats JSON so it is more readable.
* All shell commands are shown for Unix-based systems. Windows has analogous commands for each.

## Get JWT Authentication Token

You first need to get an `authorization` token to access the FormKiQ API. See [Getting an JWT Authentication Token](/docs/how-tos/jwt-authentication-token) for steps on how to get the token.

## CloudFormation Outputs

We are going to need to know the name FormKiQ of a few AWS resources creating during the FormKiQ installation. Opening the [CloudFormation console](https://console.aws.amazon.com/cloudformation), find your FormKiQ stack and click the `Outputs` tab.

![CloudFormation Outputs](./img/cf-outputs-apis.png)

The following are outputs we'll need to know.

For all API requests the following table describes the values that need to be replaced in the API request.

| Argument | Description
| -------- | ------- |
| `HTTP_API_URL` | The URL for the API endpoint that uses Cognito authorization.
| `AUTHORIZATION_TOKEN` | The token retrieved from Step 1.

## Adding a Document Tag

The `POST /documents/{documentId}/tags` API is the primary method for adding a tag to a document.

```
curl -X POST https://HTTP_API_URL/documents/DOCUMENT_ID/tags \
   -H "Authorization: AUTHORIZATION_TOKEN" -d '{"key": "category","value": "thing"}'
```

A successful message indicates the tag has been added:
```
{
  "message":"Created Tag 'category'"
}
```

A document tag also support multiple values.

```
curl -X POST https://HTTP_API_URL/documents/DOCUMENT_ID/tags \
   -H "Authorization: AUTHORIZATION_TOKEN" -d '{"key": "playerId","values": ["111","222"]}'
```

## Get Specific Document Tag

The `GET /documents/{documentId}/tags/{tagKey}` can be used to retrieve a specific  document tag.

```
curl -X GET https://HTTP_API_URL/documents/DOCUMENT_ID/tags/TAG_KEY \
   -H "Authorization: AUTHORIZATION_TOKEN"
```

A successful response will return the tag for the document:
```
{
  "key":"category",
  "value":"thing"
}
```

## Adding a Document with Tags

When adding a document using `POST /documents` tags maybe added at the same time.

```
curl -X POST https://HTTP_API_URL/documents \
   -H "Authorization: AUTHORIZATION_TOKEN" -d '{"path": "test.txt","contentType": "text/plain","content": "This is sample content","tags":[{"key":"category","value":"person"}]}'
```

A successful response will return a unique documentId of the added document:
```
{
  "documentId" : "b18e0d3b-48cb-4589-ab5d-f19e27b44f05"
}
```

## Adding Document greater than 5 MB with tags

```
curl -X POST https://HTTP_API_URL/documents/uploads \
   -H "Authorization: AUTHORIZATION_TOKEN" -d '{"path": "sample.pdf","tags":[{"key":"category", "value":"person"}]}'
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
