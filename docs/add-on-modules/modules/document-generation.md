---
sidebar_position: 1
---

# Document Generation

The Document Generation feature in the FormKiQ Document Management Platform enables the creation of dynamic documents by combining a predefined document template with one or more data sources. The document generation process uses the Apache FreeMarker templating engine, offering robust capabilities for customizing document content.

## Benefits

- **Efficiency**: Streamline document creation workflows by automating repetitive tasks.
- **Customization**: Use powerful templating features with Apache FreeMarker to create tailored outputs.
- **Scalability**: Handle large volumes of document generation requests with ease.
- **Flexibility**: Generate documents in multiple output formats, such as DOCX and PDF.


## Apache FreeMarker Syntax

Here are a few examples of Apache FreeMarker syntax commonly used in templates:

For the complete reference, visit the official [Apache FreeMarker Documentation](https://freemarker.apache.org/docs/index.html).

### Variable Insertion

Insert variables directly into the template.
```ftl
Hello, ${user.name}!
```

### Conditional Logic

Use conditional statements to customize output based on data values.

```
<#if user.age >= 18>
  Welcome to the adult portal.
<#else>
  Welcome to the kids' section.
</#if>
```

### Looping Through a List

Iterate over a collection to display repeated content.

```
<#list products as product>
  - ${product.name}: ${product.price}
</#list>
```

### Nested Loops

Handle nested data structures for complex templates.

```
<#list orders as order>
  Order ID: ${order.id}
  <#list order.items as item>
    - ${item.name} (${item.quantity})
  </#list>
</#list>
```

### Default Values

Provide default values for missing data.

```
Customer Name: ${customer.name!"Unknown Customer"}
```

### String Manipulation

Perform basic string operations.

```
Customer Name (Uppercase): ${customer.name?upper_case}
Order Total (Formatted): ${order.total?string.currency}
```

### Date Formatting

Format dates for better readability.

```
Order Date: ${order.date?string("yyyy-MM-dd")}
```

### Conditional Assignments

Assign values based on conditions.

```
<#assign status = (order.total > 100) ? "Premium" : "Standard">
Order Status: ${status}
```

### Comments

Add comments to templates for clarity.

```
<#-- This is a single-line comment -->
```


## API Endpoints

POST `/documents/{documentId}/generate`

where the documentId is the template document id.

For full API documentation, See [full documentation here](/docs/api-reference/add-document-generate).

### Sample API Requests

#### Request

```json
POST /documents/{documentId}/generate
{
  "locale": {
    "language": "en",
    "country": "US"
  },
  "datasources": [
    {
      "name": "customerData",
      "documentId": "12345",
      "dataRoot": "data"
    }
  ],
  "outputType": "PDF",
  "saveAsDocumentId": "67890",
  "path": "/output/reports/customer_report.pdf"
}
```

#### Explanation of Fields

* locale: Specifies the language and country for locale-specific data formatting.

  * language: Language code (e.g., en (English), fr (French), de (German)) following the ISO 639-1 standard.
  * country: Country code (e.g., "US" for the United States) following the ISO 3166-1 standard.
* datasources: A list of data sources to merge with the template.
  * name: Name of the data source.
  * documentId: Document ID of the data source file.
  * dataRoot: Root key in the data source to use as the base.
  * outputType: Format of the generated document. Supported values: DOCX, PDF.
  * saveAsDocumentId: Specific Document ID for saving the generated document.
  * path: File path to save the generated document.


## DataSource

The DataSource is a JSON document that provides the values used to populate the placeholders and logic within the Apache FreeMarker template. This enables dynamic content generation by combining the static structure of the template with the dynamic data from the DataSource.

### Key Attributes of a DataSource

- **JSON Document**: The data source must be structured as a JSON document. Each key-value pair in the document corresponds to a variable or object used in the template.
- **`dataRoot` Parameter**: Controls the root node of the JSON document to load into the template. This allows flexibility in selecting the portion of the document to use for rendering.

### Example of a DataSource

#### JSON DataSource
```json
{
  "company": {
    "name": "Acme Corp",
    "location": "New York",
    "employees": [
      {
        "name": "John Doe",
        "position": "Manager",
        "age": 35
      },
      {
        "name": "Jane Smith",
        "position": "Engineer",
        "age": 29
      }
    ]
  }
}
```

### Using dataRoot

By specifying dataRoot: **company**, only the data under the company key is accessible in the template.

```
Company Name: ${name}
Location: ${location}
<#list employees as employee>
  - ${employee.name}, ${employee.position}
</#list>
```

## Document Attributes

In addition to the user-provided DataSource, **Document Attributes** associated with the document are automatically loaded and added to the DataSource. This ensures that metadata and other predefined attributes related to the document can be directly utilized in the template without additional configuration.

### Example

**Document Attributes**

| **Attribute Key** | **Value**                          |
|--------------------|------------------------------------|
| title            | Quarterly Financial Report        |
| author           | Jane Doe                          |
| createdDate      | 2024-01-15                        |
| department       | Finance                           |

**Template**

```ftl
Document Title: ${title}
Author: ${author}
Date Created: ${createdDate}
Department: ${department}
```
