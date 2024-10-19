---
sidebar_position: 1
---

# Document Generation

The document generation API allows the generation of documents from a custom template and a data document. This API can be used for generatng invoice, reports, letters and other types of documents where a predefined format needs to be populated with dynamic data.

## `POST /documents/{documentId}/generate`

This API allows the generatation of a document based from a template file.

The body of the request looks as follows:

```
{
  "templateDocumentId": "string",
  "outputType": "DOCX"
}
```

### DocumentId
The document identifier that contains the dynamic data information.

### TemplateDocumentId
The document identifer that defines which template document to use.

### OutputType
The output type of the generated document.

:::note
Supports Template documents that are in DOCX format
:::

## Template Fields

In the document generation API, template fields are specified using field names enclosed in curly backets, such as `{field_name}`. These placeholders indicate where dynamic data from the data document should be inserted within the template. 

During the document generation process, each placeholder in the template is replaced with the corresponding value from the data document based on the field name.

### Fields

Fields within the template are represented by field names enclosed in curly brackets, e.g, `{field_name}`. These placeholders are replaced with the corresponding values from the data document.

#### Document Example

The following example demonstrates using a DOCX template and data document to generate a final DOCX document.

##### Template Document

Create a DOCX file with the following content.

```
Invoice: {invoice_number} | Date: {date}
```

##### Data Document

Using the following data document, we will use the invoice_number, date to create a new document with the values populated.

```
{
  "data": {
    "invoice_number": "12345",
    "date": "Jan 1, 2024"
  }
}
```

##### API Request

If the stored template document has a FormKiQ document id of `c061f1dd-f61c-465aa7cb-c14edd0f095d` and the data document has a FormKiQ document id of `d96c3899-cfbe-42febc80-04fdc0266306`.

Sending the following request

```
POST /documents/d96c3899-cfbe-42febc80-04fdc0266306/generate

{
  "templateDocumentId": "c061f1dd-f61c-465aa7cb-c14edd0f095d",
  "outputType": "DOCX"
}
```

Will result in a new document being generated and the document id returned in the response.

```
{
  "documentId": "86f3f1de-e165-48f0-90af-2f585bf53050"
}
```

### Sections

Sections in the template can be dynamically generated using special section placeholders. These placeholders mark a block of content that can be repeated or conditionally included based on the data document.

#### Document Table Example

The following example demonstrates generating tabular data using a DOCX template and data document to generate a final DOCX document.

##### Template Document

Create a DOCX file with the following content.

| Product | Quantity |
| ------- | -------- |
| `{#items}{product}` | `{quantity}{/items}` |

##### Data Document

Using the following data document, we will use the items to create a new document with the values populated inside of a table.

```
{
  "data":{
    "items":[
      {
        "product": "shampoo",
        "quantity": "10"
      },
      {
        "product": "soap",
        "quantity": "5"
      }
    ]
  }
}
```

##### API Request

If the stored template document has a FormKiQ document id of `94a574f2-2e2b-40ea-920f-c8131b510424` and the data document has a FormKiQ document id of `7c3eeb64-5977-41da-9364-ccf8aa94a30a`.

Sending the following request

```
POST /documents/7c3eeb64-5977-41da-9364-ccf8aa94a30a/generate

{
  "templateDocumentId": "94a574f2-2e2b-40ea-920f-c8131b510424",
  "outputType": "DOCX"
}
```

Will result in a new document being generated and the document id returned in the response.

```
{
  "documentId": "cc094434-b19f-44d8-9037-50419e0cf672"
}
```

When opening the document you will see the following table generated.

| Product | Quantity |
| ------- | -------- |
| shampoo | 10 |
| soap | 5 |
