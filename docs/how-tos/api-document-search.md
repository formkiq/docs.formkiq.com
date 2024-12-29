---
sidebar_position: 4
---

# Searching for Documents

This tutorial will take you through different way to search for documents using the FormKiQ API.

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

## Search for a Document Tag

The `POST /search` API is the primary method for search for documents with a specific tag.


```
curl -X POST https://HTTP_API_URL/search \
   -H "Authorization: AUTHORIZATION_TOKEN" -d '{"query":{"tag":{"key": "category"}}}'
```

A successful response will return matching documents:
```
{
  "documents": [
    {
      "documentId": "05c1dc43-e9f3-4bb5-9732-077c02dac2c9",
      "matchedTag": {
        "type": "USERDEFINED",
        "value": "thing",
        "key": "category"
      },
      "contentType": "application/pdf",
      ...
    }
  ]
}
```

## Search for a Document Tag / Value

The following example show how to search for a specific tag / value combination.

```
curl -X POST https://HTTP_API_URL/search \
   -H "Authorization: AUTHORIZATION_TOKEN" -d '{"query":{"tag":{"key": "category","eq":"person"}}}'
```

A successful response will return matching documents:
```
{
  "documents": [
    {
      "documentId": "05c1dc43-e9f3-4bb5-9732-077c02dac2c9",
      "matchedTag": {
        "type": "USERDEFINED",
        "value": "thing",
        "key": "category"
      },
      "contentType": "application/pdf",
      ...
    }
  ]
}
```

## Search for a Document Tag / Value

The following example show how to search for a specific tag and where the  value starts with a specific characters.

```
curl -X POST https://HTTP_API_URL/search \
   -H "Authorization: AUTHORIZATION_TOKEN" -d '{"query":{"tag":{"key": "category","beginsWith":"p"}}}'
```

## Search for Document Composite Key

FormKiQ alo includes the ability to define composite keys at the site or classification level, which allows for searching for multiple tags.

```
curl -X POST https://HTTP_API_URL/search \
   -H "Authorization: AUTHORIZATION_TOKEN" -d '{"query":{"tags":[{"key":"category","eq":"person"},{"key": "playerId","eq":"111"}]}}'
```


## Search using Full Text Module

[FormKiQ Enterprise](https://www.formkiq.com/products/formkiq-enterprise) has an <a href="/docs/add-on-modules/modules/enhanced-fulltext-document-search">Enhanced Fulltext Document Search Module</a> that provides FormKiQ integration with [AWS OpenSearch](https://aws.amazon.com/opensearch-service) which is an AWS fully managed [Elasticsearch-compatible](https://www.elastic.co) service.

```
curl -X POST https://HTTP_API_URL/searchFulltext \
   -H "Authorization: AUTHORIZATION_TOKEN" -d '{"path": "test.txt","contentType": "text/plain","content": "This is sample content","tags":[{"key":"category","value":"person"}]}'
```

A successful response will return a list of documents:
```
{
  "documents": [
    {
      "documentId": "83afd66e-9f16-4a62-a286-1e8c54c449d8",
      "path": "sample.pdf",
      ...
    }
  ]
}
```

## OpenSearch Custom/Complex Queries

The `POST /queryFulltext` allows for custom, complex queries using the OpenSearch search API.

The request body is set to any valid [OpenSearch Search API](https://opensearch.org/docs/2.3/opensearch/query-dsl/index/) request.

```
curl -X POST https://HTTP_API_URL/documents/queryFulltext \
   -H "Authorization: AUTHORIZATION_TOKEN" -d '{"query":{"match_all":{}}}'
```

Query Results
```
{
  "result": {
    "took": 68.0,
    "hits": {
      "max_score": 1.0,
      "hits": [
        {
          "_index": "formkiq_bb69d12f-d598-4db5-8307-641c6d0a2b16",
          "_id": "bf4a0257-58e0-4e54-800f-e0a060d4ebfe",
          "_score": 1.0,
          "_source": {
            "content": "some test stuff",
            "documentId": "bf4a0257-58e0-4e54-800f-e0a060d4ebfe",
            ...
          }
        }
      ]
    }
  }
}
```

