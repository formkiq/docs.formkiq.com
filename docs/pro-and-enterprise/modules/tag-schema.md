---
sidebar_position: 1
---

# Tag Schema

✅ Enforce Required and Optional Tag Keys/Values

✅ Extend Search Functionality through Composite Keys for Tags

✅ Optionally Return Tags while using the `POST /search` API Endpoint


Tag Schema is a feature of FormKiQ Pro and Enterprise that provides the enforcement of a tag schema on specific documents and enhances search functionality through composite keys for tags.

With the Tag Schema Feature, you can create different sets of required or optional keys, i.e., the Tag Schemas, and each schema can be associated to any number of documents. You can also specify both a default value and a list of allowed values for both required and optional keys.

Each tag schema can have up to 5 required and 10 optional keys, for a total of 15; you should consider prioritizing tags used for searches in cases where your document content may have more than five required key/value pairs, vs. attempting to store all document key/value pairs as tags. In cases where you expect to search for more than 15 keys, we recommend our link:#fulltext-search-module[Fulltext Search Module].

A tag schema can specify any of the following options as its rules:

* only documents with the **required tag keys** can be accepted, with no optional keys allowed
* only documents with the **required tag keys** can be accepted, with only the specified optional keys allowed
* only documents with the **required tag keys** can be accepted, with any other keys being optional
* documents have **no required tag keys**, but only the specified optional keys allowed
* documents have **no required or optional tag keys** specified, and the schema is only used to create **composite keys** for searches (see below)

When a document is added with an associated tag schema, the document will be rejected if it does not conform to the rules of the schema.

When searching for documents, can you request that the tags in the schema are returned by using an optional boolean parameter, `includeTagsFromSchema`. Only documents with tag schemas will return their tags directly within search results. If a tag allows any number of optional tags (i.e., if `allowAdditionalTags` is not disabled in the schema), this optional parameter will only return the required tags. This is done to maintain a reasonable response size for these requests.

A tag schema also allows the creation of composite keys, i.e, `compositeKeys`, which allow for the searching of 2-3 tags at once. This allows FormKiQ to maintain its high scalability while remaining cost efficient.

There is no requirement that these composite keys be made up of required or specified optional tags, so you will want to ensure that you keep this in mind when creating any composite keys. Up to five separate composite keys can be created for a specific tag schema, while each composite key combines two or three tag keys. For more complex searches, we recommend our link:#fulltext-search-module[Fulltext Search Module].

:::note
when using composite keys involving three tag keys, searching for these keys requires that all three tag keys are specified; if you require an additional search for only two of the three keys, you would need to create a separate composite key consisting of only those two tag keys.
:::

## Use Cases
 
* If you have multiple input methods, such as having more than one application using the API, you can ensure that your documents are properly and consistently tagged no matter the source_
* If you expect your application(s) to search often using two tag keys, e.g., customerID and projectID, you can automate the creation and maintenance of composite keys to search in one request

## API

The Tag Schema Module adds API endpoints to create, retrieve, and delete tag schemas. As this module interacts with the FormKiQ Core API Endpoints, a `tagSchemaId` will also be available on most document endpoints, such as `POST /documents/`.

<!---
**You can view the full list of Tag Schema Module endpoints in the link:../api/README.html#tagschema[API Reference].**
--->