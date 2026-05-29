---
sidebar_position: 10
---

# Site / Classification Schemas

This tutorial demonstrates how to organize documents using **Site Schemas** and **Classification Schemas**.

## What You Will Build

You will create attribute definitions, configure a site schema that requires an attribute on every document, configure a classification schema with a composite key, add valid and invalid documents, and search documents by classification attributes.

The code for the tutorial can be found on the [FormKiQ Github Tutorials](https://github.com/formkiq/tutorials/tree/master/java/schemas)

## Before You Begin

* A text editor or IDE - for example [IntelliJ IDEA](https://www.jetbrains.com/idea/download)

* Access to a FormKiQ Core installation

* The `HttpApiUrl` found on the CloudFormation Outputs tab

* A [JWT Authentication Token](/docs/how-tos/jwt-authentication-token)

## Workflow Overview

1. Configure the Java API client.
2. Create attributes used by schemas.
3. Create a site schema.
4. Create a classification schema.
5. Add documents that pass or fail schema validation.
6. Search using classification attributes.

## Step 1: Configure the FormKiQ Client Library

FormKiQ has a client library available in [java](https://github.com/formkiq/formkiq-client-sdk-java/) and [python](https://github.com/formkiq/formkiq-client-sdk-python) which makes communicating with the FormKiQ application easier.

:::note
This tutorial will be using the Java API and required the client 1.15.0 or greater, but will reference the REST API endpoints used.
:::

### Setup API

The Java API requires the creation of a `ApiClient` which requires a JWT `AccessToken` and the `FormKiQ url` of the FormKiQ instances to use.

* A JWT Authentication Token can be aquired using this [how-to](/docs/how-tos/jwt-authentication-token).

* The HTTP_API_URL can be found from the "Outputs" tab of the CloudFormation console 

```
private static final String ACCESS_TOKEN = "<ACCESS_TOKEN>";
private static final String HTTP_API_URL = "<CloudFormation Outputs HttpApiUrl>";
```

The API is broken into sections. In this case, we will need to use the DocumentWorkflowsApi, RulesetApi, and DocumentsApi. These APIs can be instantiated as follows:

```
/**
 * Setup API classes.
 */
public void setUpApi() {

  ApiClient client = (new ApiClient()).setReadTimeout(0).setBasePath(HTTP_API_URL);
  client.addDefaultHeader("Authorization", ACCESS_TOKEN);

  documentsApi = new DocumentsApi(client);
  attributesApi = new AttributesApi(client);
  schemasApi = new SchemasApi(client);
  searchApi = new DocumentSearchApi(client);
}
```

## Step 2: Create Attributes

Create the attributes that will be used in the Site / Classification Schema.

```
// Add Security Level Attribute
AddAttributeRequest req0 = new AddAttributeRequest().attribute(new AddAttribute().key("securityLevel").dataType(AttributeDataType.STRING));
attributesApi.addAttribute(req0, siteId);

// Add Document Type Attribute
AddAttributeRequest req1 = new AddAttributeRequest().attribute(new AddAttribute().key("documentType").dataType(AttributeDataType.STRING));
attributesApi.addAttribute(req1, siteId);

// Add Document Number Attribute
AddAttributeRequest req2 = new AddAttributeRequest().attribute(new AddAttribute().key("documentNo").dataType(AttributeDataType.STRING));
attributesApi.addAttribute(req2, siteId);
```

## Step 3: Create a Site Schema

Create a Site Schema that requires an attribute "securityLevel" added to each document.

```
// Site Schema requires a Security Level attribute
SchemaAttributes schemaAttributes = new SchemaAttributes().addRequiredItem(new AttributeSchemaRequired().attributeKey("securityLevel").addAllowedValuesItem("public").addAllowedValuesItem("private"));
SetSitesSchemaRequest req = new SetSitesSchemaRequest().name("Site Schema").attributes(schemaAttributes);
schemasApi.setSitesSchema(siteId, req);
```

## Step 4: Create a Classification Schema

A Classification Schema overrides the Site Schema and allow for multiple kinds of document classifications.

```
// Create Document Type Classification
SchemaAttributes schemaAttributes = new SchemaAttributes().addRequiredItem(new AttributeSchemaRequired().attributeKey("documentType")).addRequiredItem(new AttributeSchemaRequired().attributeKey("documentNo"));

// Add Composite Key to allow searching of both 'documentType', 'documentNo' attributes
schemaAttributes.addCompositeKeysItem(new AttributeSchemaCompositeKey().addAttributeKeysItem("documentType").addAttributeKeysItem("documentNo"));

AddClassificationRequest req = new AddClassificationRequest().classification(new AddClassification().name("Document Type Schema").attributes(schemaAttributes));

String classificationId = schemasApi.addClassification(siteId, req).getClassificationId();
```

## Step 5: Add a Document with the Site Schema

Once the Site Schema is set, any document added must follow the schema. In this case, the "securityLevel" attribute is required. Adding a document without this attribute will not be added.

```
// add document failing Site Schema
try {
  app.addDocument(siteId, "invalid document", "text/plain", null);
} catch (ApiException e) {
  System.out.println("Cannot add document: " + e.getResponseBody());
}
```

Adding a document with the "securityLevel" attribute set, the document will be added successfully.

```
AddDocumentAttribute att0 = new AddDocumentAttribute(new AddDocumentAttributeStandard().key("securityLevel").stringValue("private"));
String docId0 = app.addDocument(siteId, "valid Site Schema", "text/plain", List.of(att0));
System.out.println("Added document: " + docId0 + " with valid Site Schema");
```

## Step 6: Add a Document with the Classification Schema

Adding a document with a Classification attribute allows to override the Site Schema and apply custom classification to a document. In the code below, a classification is used to require the "documentType" and "documentNo" attributes.

```
// add document with documentType / documentNo  Site Schema

AddDocumentAttribute att1 = new AddDocumentAttribute(new AddDocumentAttributeStandard().key("documentType").stringValue("text"));

AddDocumentAttribute att2 = new AddDocumentAttribute(new AddDocumentAttributeStandard().key("documentNo").stringValue("txt-001"));

AddDocumentAttribute classification = new AddDocumentAttribute(new AddDocumentAttributeClassification().classificationId(classificationId));

String docId1 = app.addDocument(siteId, "valid Document Type Schema", "text/plain", List.of(att1, att2, classification));
System.out.println("Added document: " + docId1 + " with valid Classification");
```

The classification also has a component key which adds the ability to search for both attributes.

```
DocumentSearchAttribute attr0 = new DocumentSearchAttribute().key("documentType").eq(documentType);
DocumentSearchAttribute attr1 = new DocumentSearchAttribute().key("documentNo").eq(documentNo);

DocumentSearchRequest searchReq = new DocumentSearchRequest().query(new DocumentSearch().attributes(List.of(attr0, attr1)));

List<SearchResultDocument> documents = searchApi.documentSearch(searchReq, siteId, null, null, null).getDocuments();
```

## Verify the Result

Confirm that a document without the required `securityLevel` attribute is rejected, a document with the required site schema attribute is accepted, and a document with classification attributes can be found using the composite-key search.

## Clean Up

Delete the test schema, classification, attributes, and documents if they are not needed after the tutorial.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| Document creation fails | A required schema attribute is missing. | Confirm required site or classification attributes are included. |
| Composite-key search returns no results | Composite keys were created after documents were added. | Reindex or update existing documents after schema changes. |
| Classification does not apply | Wrong classification ID or missing classification attribute. | Confirm the classification ID returned from `addClassification`. |

## Next Steps

- [Schemas](/docs/features/schemas)
- [Attributes](/docs/features/attributes)
- [Search](/docs/features/search)
