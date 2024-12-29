---
sidebar_position: 1
---

# Document Generation

## Overview

The Document Generation feature enables creation of dynamic documents by combining templates with data sources using the Apache FreeMarker templating engine. This powerful system allows for automated document creation with customizable content.

## Benefits

- **Efficiency**: Automate repetitive document creation tasks
- **Customization**: Leverage Apache FreeMarker's powerful templating features
- **Scalability**: Handle high-volume document generation
- **Flexibility**: Support for multiple output formats (DOCX, PDF)

## Template Syntax Guide

FormKiQ uses Apache FreeMarker for template processing. Here are common syntax examples:

### Basic Variables
```ftl
Hello, ${user.name}!
```

### Conditional Statements
```ftl
<#if user.age >= 18>
  Welcome to the adult portal.
<#else>
  Welcome to the kids' section.
</#if>
```

### List Iteration
```ftl
<#list products as product>
  - ${product.name}: ${product.price}
</#list>
```

### Default Values
```ftl
Customer Name: ${customer.name!"Unknown Customer"}
```

### String Operations
```ftl
Customer Name (Uppercase): ${customer.name?upper_case}
Order Total: ${order.total?string.currency}
```

### Date Formatting
```ftl
Order Date: ${order.date?string("yyyy-MM-dd")}
```

For complete template syntax, see the [Apache FreeMarker Documentation](https://freemarker.apache.org/docs/index.html).

## API Reference

### Generate Document
```http
POST /documents/{documentId}/generate
```

### Request Structure
```json
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

### Parameters

| Parameter | Description | Format |
|-----------|-------------|---------|
| locale.language | Language code | ISO 639-1 (e.g., en, fr, de) |
| locale.country | Country code | ISO 3166-1 (e.g., US, GB, FR) |
| outputType | Output format | "DOCX" or "PDF" |
| saveAsDocumentId | Target document ID | String |
| path | Output file path | String |

## Data Sources

### Overview
Data sources provide the dynamic content for template generation through JSON documents.

### Structure Example
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
When specifying `dataRoot: "company"`, the template can access data directly:

```ftl
Company Name: ${name}
Location: ${location}
<#list employees as employee>
  - ${employee.name}, ${employee.position}
</#list>
```

## Document Attributes

Document attributes are automatically included in the template data context:

| Attribute | Description | Example |
|-----------|-------------|---------|
| title | Document title | "Quarterly Financial Report" |
| author | Document author | "Jane Doe" |
| createdDate | Creation date | "2024-01-15" |
| department | Department | "Finance" |

### Template Usage
```ftl
Document Title: ${title}
Author: ${author}
Date Created: ${createdDate}
Department: ${department}
```

For complete API documentation, see the [Document Generation API Reference](/docs/api-reference/add-document-generate).