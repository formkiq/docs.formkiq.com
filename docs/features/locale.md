---
sidebar_position: 7
---

# Locale

## Overview

The Locale feature enables the management and retrieval of localized content for individual websites. It provides endpoints for handling different language settings and their associated resource items, making it easier to support multi-language sites and internationalization (i18n).

## Use Cases

### Multi-Language Support
Retrieve the supported locales for a site to present content in multiple languages.

### Content Localization:
Access and update resource items containing localized strings, which can be used for UI labels, error messages, and other text elements.

### Enhanced User Experience:
Tailor the user experience by dynamically loading locale-specific content, ensuring that users see information in their preferred language.
   
### Site Customization:
Allow site administrators to manage locale settings and resource items, enabling on-the-fly customization of content based on the target audience.

## Resource Types

### INTERFACE

The locale interface resource is a generic resource that has a **interfaceKey** and an associated **localizedValue**.

### SCHEMA

Allow the association of a Schema attribute's allowed value to be associated **localizedValue**.

Localized values can be retrieved using the **GET /sites/&lt;siteId&gt;/schema/document** and the locale query parameter.

### CLASSIFICATION

Allow the association of a Schema classification attribute's allowed value to be associated **localizedValue**.

Localized values can be retrieved using the **GET /sites/&lt;siteId&gt;/classifications/&lt;classificationId&gt;** and the locale query parameter.


## API Locale Endpoints

[See full Documents API documentation here](/docs/category/formkiq-api)

### POST /locale 

Adds a new locale to the specified site.

#### Sample Request

```bash
curl -X POST "https://<FORMKIQ_API>/locale?siteId=yourSiteId" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "locale": "en-US"
}'
```

### GET /locale 

Returns a list of locale(s) in a specified site

#### Sample Request

```bash
curl -X GET "https://<FORMKIQ_API>/locale?siteId=yourSiteId&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Sample Response (HTTP 200)

```
{
  "locales": [
    {
      "locale": "en-US"
    }
  ]
}
```

### POST /sites/&lt;siteId&gt;/locales/&lt;locale&gt;/resourceItems

Adds a new localized resource item for a given locale.

#### INTERFACE Request

```bash
curl -X POST "https://<FORMKIQ_API>/sites/{siteId}/locales/{locale}/resourceItems?siteId=yourSiteId" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "resourceItem": {
    "itemType": "INTERFACE",
    "localizedValue": "myLocaleValue",
    "interfaceKey": "myKey"
  }
}'
```

#### SCHEMA Request

```bash
curl -X POST "https://<FORMKIQ_API>/sites/{siteId}/locales/{locale}/resourceItems?siteId=yourSiteId" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "resourceItem": {
    "itemType": "SCHEMA",
    "attributeKey":"priority",
    "localizedValue": "High",
    "allowedValue": "HI"
  }
}'
```

#### CLASSIFICATION Request

```bash
curl -X POST "https://<FORMKIQ_API>/sites/{siteId}/locales/{locale}/resourceItems?siteId=yourSiteId" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "resourceItem": {
    "itemType": "CLASSIFICATION",
    "attributeKey":"priority",
    "localizedValue": "High",
    "allowedValue": "HI"
  }
}'
```

#### Sample Response (HTTP 200)

```
{
  "itemKey": "INTERFACE##myKey"
}
```

### GET /sites/&lt;siteId&gt;/schema/document/attributes/&lt;key&gt;/allowedValues

Returns an attribute's allowed values from the site schema.

#### Request Example

```bash
curl -X GET "https://<FORMKIQ_API>/sites/{siteId}/schema/document/attributes/{key}/allowedValues?siteId=yourSiteId" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Sample Response (HTTP 200)

```
{
  "allowedValues": [
    "HI", "LO", "MD"
  ],
  "localizedAllowedValues": {
    "HI": "High"
  }
}
```

### GET /sites/&lt;siteId&gt;/classifications/&lt;classificationId&gt;/attributes/&lt;key&gt;/allowedValues

Returns an attribute's allowed values from the site classification schema.

#### Request Example

```bash
curl -X GET "https://<FORMKIQ_API>/sites/{siteId}/classifications/{classificationId}/attributes/{key}/allowedValues?siteId=yourSiteId" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Sample Response (HTTP 200)

```
{
  "allowedValues": [
    "HI", "LO", "MD"
  ],
  "localizedAllowedValues": {
    "HI": "High"
  }
}
```