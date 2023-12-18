---
sidebar_position: 5
---

# Document Actions

This guide show you how to add actions to your documents to automate your document workflows.

Document actions allow you to have your documents automatically perform certain operations.

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

## Add Document with Webhook Actions

The webhook action will send a POST request to any endpoint.

In the example below, using https://pipedream.com we can create an endpoint and then have FormKiQ call that endpoint once the document is created.

```
curl -X POST https://HTTP_API_URL/documents \
   -H "Authorization: AUTHORIZATION_TOKEN" -d '{
  "path": "test.txt",
  "contentType": "text/plain",
  "content": "This is sample content",
  "actions": [
    {
      "type": "webhook",
      "parameters": {
        "url": "https://eos1teg4kuo0fa7.m.pipedream.net"
      }
    }
  ]
}'
```

A successful message return the document id that was created.
```
{
  "documentId":"983a9d66-3833-4e09-b3b0-a1808b87502c"
}
```

## Add Document with OCR & FULLTEXT Actions

FormKiQ Core has OCR with Tesseract, while [FormKiQ Pro and Enterprise](https://www.formkiq.com/products/formkiq-pro) have an <a href="/docs/pro-and-enterprise/enhanced-document-ocr">Enhanced Document OCR Module</a>. [FormKiQ Enterprise](https://www.formkiq.com/products/formkiq-enterprise) also has an <a href="/docs/pro-and-enterprise/enhanced-fulltext-document-search">Enhanced Fulltext Document Search Module</a> which can be used to automatically run a OCR scan on a document and put the OCR results automatically into a [Opensearch](https://aws.amazon.com/opensearch-service) to enable full text document searching.


```
curl -X POST https://HTTP_API_URL/documents \
   -H "Authorization: AUTHORIZATION_TOKEN" -d '{
  "path": "sample.pdf",
  "contentType": "application/pdf",
  "isBase64":true,
  "content": "BASE64_CONTENT",
  "actions": [
    {
      "type": "ocr"
    },
    {
      "type": "fulltext"
    },
  ]
}'
```

A successful message return the document id that was created.
```
{
  "documentId":"983a9d66-3833-4e09-b3b0-a1808b87502c"
}
```

## Get Document Actions Status

The `GET /documents/{documentId}/actions` can be used to get the status of the action.

```
curl -X GET https://HTTP_API_URL/documents/DOCUMENT_ID/actions \
   -H "Authorization: AUTHORIZATION_TOKEN"
```

Which will return a list of document actions like:
```
{
  "actions":[{
    "type":"webhook",
    "parameters":{
      "url":"https://eos1teg4kuo0fa7.m.pipedream.net"
    },
    "status":"complete"}
  ]
}
```
