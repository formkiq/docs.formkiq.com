---
sidebar_position: 1
---

# Site / Classification Schemas

This guide demonstrates how to organized documents through using **Site Schemas** and **Classification Schemas**. 

We will be:

* Creating a Site Schema which will require certain attributes added to each document

* Creating a Classification Schema which will categorize documents

The code for the tutorial can be found on the [FormKiQ Github Tutorials](https://github.com/formkiq/tutorials/tree/master/java/schemas)

## What you’ll need

* A text editor or IDE - for example [IntelliJ IDEA](https://www.jetbrains.com/idea/download)

* Access to a FormKiQ Core installation

* The `HttpApiUrl` found on the CloudFormation Outputs tab

* A [JWT Authentication Token](/docs/how-tos/jwt-authentication-token)

## FormKiQ Client Library

FormKiQ has a client library available in [java](https://github.com/formkiq/formkiq-client-sdk-java/) and [python](https://github.com/formkiq/formkiq-client-sdk-python) which makes communicating with the FormKiQ application easier.

:::note
This tutorial will be using the Java API and required the client 1.15.0 or greater, but will reference the REST API endpoints used.
:::

## Setup API

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

## Create Attributes

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

## Create Site Schema

Create a Site Schema that requires an attribute "securityLevel" added to each document.

```
// Site Schema requires a Security Level attribute
SchemaAttributes schemaAttributes = new SchemaAttributes().addRequiredItem(new AttributeSchemaRequired().attributeKey("securityLevel").addAllowedValuesItem("public").addAllowedValuesItem("private"));
SetSitesSchemaRequest req = new SetSitesSchemaRequest().name("Site Schema").attributes(schemaAttributes);
schemasApi.setSitesSchema(siteId, req);
```

## Create Classification Schema

A Classification Schema overrides the Site Schema and allow for multiple kinds of document classifications.

```
// Create Document Type Classification
SchemaAttributes schemaAttributes = new SchemaAttributes().addRequiredItem(new AttributeSchemaRequired().attributeKey("documentType")).addRequiredItem(new AttributeSchemaRequired().attributeKey("documentNo"));

// Add Composite Key to allow searching of both 'documentType', 'documentNo' attributes
schemaAttributes.addCompositeKeysItem(new AttributeSchemaCompositeKey().addAttributeKeysItem("documentType").addAttributeKeysItem("documentNo"));

AddClassificationRequest req = new AddClassificationRequest().classification(new AddClassification().name("Document Type Schema").attributes(schemaAttributes));

String classificationId = schemasApi.addClassification(siteId, req).getClassificationId();
```

## Add Document with Site Schema

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

## Add Document with Classification Schema

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

## Summary

And there you have it! We have shown how easy it is to add Site and Classification Schemas to allow for the automatic classifications of documents.

This is just the tip of the iceberg when it comes to working with the FormKiQ APIs.

If you have any questions, reach out to us on our https://github.com/formkiq/formkiq-core or https://formkiq.com.
