---
sidebar_position: 7
title: Locales
---

# Locales

## Overview

Locales let a FormKiQ site store and retrieve language-specific display values. They are mainly used for localized interface strings and localized allowed values for schema and classification attributes.

Locales do not translate document content automatically. They provide a way to manage localized resource items that applications, consoles, and integrations can use when presenting FormKiQ metadata to users.

Use Locales when you need:

- User interface labels in multiple languages
- Localized display text for schema allowed values
- Localized display text for classification allowed values
- Site-specific terminology for different regions or audiences
- Multi-language administration or document review experiences

## What Locales Control

FormKiQ locale resources control display values, not the stored canonical values.

For example, a schema might store the allowed value `HI` for a `priority` attribute. Locale resource items can display that value as:

| Locale | Stored value | Display value |
| --- | --- | --- |
| `en-US` | `HI` | `High` |
| `fr-CA` | `HI` | `Eleve` |
| `es-419` | `HI` | `Alto` |

The canonical value remains `HI`. The localized value changes based on the requested locale.

## Locale Tag Format

FormKiQ recommends using BCP 47-style language tags that combine an ISO 639 language code with an ISO 3166 country or region code.

Common examples:

- `en-US`
- `fr-CA`
- `de-DE`
- `pt-PT`
- `es-419`
- `en-001`

Language-only tags, such as `en` or `ar`, may be accepted. Prefer a more specific locale such as `en-US`, `fr-CA`, or `ar-SA` when regional terminology, formatting, or display text matters.

## Resource Types

Locale resource items are grouped by item type.

| Resource type | Purpose | Example |
| --- | --- | --- |
| `INTERFACE` | Localized strings for user interfaces, labels, prompts, or messages. | `uploadButton = Upload Document` |
| `SCHEMA` | Localized display values for allowed values in a site schema. | `priority: HI = High` |
| `CLASSIFICATION` | Localized display values for allowed values in a classification schema. | `contractType: MSA = Master Services Agreement` |

## Localized Allowed Values

Localized allowed values are useful when your stored values should remain stable but users should see translated or region-specific text.

Example schema allowed values:

```json
{
  "allowedValues": ["HI", "MD", "LO"]
}
```

Localized display values for `en-US`:

```json
{
  "localizedAllowedValues": {
    "HI": "High",
    "MD": "Medium",
    "LO": "Low"
  }
}
```

Localized display values for `fr-CA`:

```json
{
  "localizedAllowedValues": {
    "HI": "Eleve",
    "MD": "Moyen",
    "LO": "Faible"
  }
}
```

When a schema, classification, or allowed-values endpoint supports a `locale` query parameter, the response can include localized values for that locale.

Related endpoints:

- [`GET /sites/{siteId}/schema`](/docs/api-reference/get-sites-schema)
- [`GET /sites/{siteId}/classifications/{classificationId}`](/docs/api-reference/get-classification)
- [`GET /sites/{siteId}/schema/document/attributes/{key}/allowedValues`](/docs/api-reference/get-sites-schema-attribute-allowed-values)
- [`GET /sites/{siteId}/classifications/{classificationId}/attributes/{key}/allowedValues`](/docs/api-reference/get-classification-attribute-allowed-values)

## Common Use Cases

### Multi-Language Interfaces

Store interface labels, prompts, help text, or message strings as `INTERFACE` resource items. Applications can retrieve the locale-specific value and display the correct text for the user.

### Localized Metadata Forms

Use `SCHEMA` resource items so allowed values in document metadata forms display in the user's language while preserving stable stored values.

### Localized Classification Forms

Use `CLASSIFICATION` resource items when different document classes need localized allowed values. This is useful when document types, review categories, or business terms vary by language or region.

### Region-Specific Terminology

Use locales when different regions use different business terms for the same stored value. For example, a stored value can remain stable while the UI displays region-specific terminology.

## Best Practices

### Keep Stored Values Stable

Use short, stable canonical values for allowed values, and localize only the display text.

Good stored values:

- `HI`, `MD`, `LO`
- `DRAFT`, `APPROVED`, `ARCHIVED`
- `CONTRACT`, `INVOICE`, `POLICY`

Avoid storing translated labels as canonical values if the same value will be used across multiple locales.

### Use Specific Locale Tags

Use region-specific locale tags when wording may differ by country or region.

Examples:

- Use `fr-CA` for Canadian French.
- Use `pt-PT` for European Portuguese.
- Use `es-419` for Latin American Spanish.
- Use `en-001` for world English when a global English label set is needed.

### Plan Fallback Behavior

Applications should decide what to display when a localized value is missing. Common fallback options:

- Show the canonical stored value.
- Fall back to a default locale such as `en-US`.
- Show an administrative placeholder so missing translations can be corrected.

### Manage Locales with Schema Changes

When adding or changing allowed values in schemas or classifications:

- Add the canonical allowed value first.
- Add localized resource items for each supported locale.
- Confirm allowed-values endpoints return the expected `localizedAllowedValues`.
- Review downstream forms, reports, and integrations that display the value.

## API Operations

Use the generated API reference for exact request and response schemas.

### Locale Operations

| Operation | Purpose | API reference |
| --- | --- | --- |
| List locales | Retrieve locales configured for a site. | [`GET /sites/{siteId}/locales`](/docs/api-reference/get-locales) |
| Add locale | Add a locale to a site. | [`POST /sites/{siteId}/locales`](/docs/api-reference/add-locale) |
| Delete locale | Delete a locale from a site. | [`DELETE /sites/{siteId}/locales/{locale}`](/docs/api-reference/delete-locale) |

### Resource Item Operations

| Operation | Purpose | API reference |
| --- | --- | --- |
| List resource items | Retrieve localized resource items for a locale. | [`GET /sites/{siteId}/locales/{locale}/resourceItems`](/docs/api-reference/get-locale-resource-items) |
| Add resource item | Add a localized resource item. | [`POST /sites/{siteId}/locales/{locale}/resourceItems`](/docs/api-reference/add-locale-resource-item) |
| Get resource item | Retrieve one localized resource item. | [`GET /sites/{siteId}/locales/{locale}/resourceItems/{itemKey}`](/docs/api-reference/get-locale-resource-item) |
| Set resource item | Update a localized resource item. | [`PUT /sites/{siteId}/locales/{locale}/resourceItems/{itemKey}`](/docs/api-reference/set-locale-resource-item) |
| Delete resource item | Delete a localized resource item. | [`DELETE /sites/{siteId}/locales/{locale}/resourceItems/{itemKey}`](/docs/api-reference/delete-locale-resource-item) |

### Allowed Value Operations

| Operation | Purpose | API reference |
| --- | --- | --- |
| Get attribute allowed values | Retrieve allowed values for an attribute. | [`GET /attributes/{key}/allowedValues`](/docs/api-reference/get-attribute-allowed-values) |
| Get schema attribute allowed values | Retrieve allowed values and localized values for a site schema attribute. | [`GET /sites/{siteId}/schema/document/attributes/{key}/allowedValues`](/docs/api-reference/get-sites-schema-attribute-allowed-values) |
| Get classification attribute allowed values | Retrieve allowed values and localized values for a classification attribute. | [`GET /sites/{siteId}/classifications/{classificationId}/attributes/{key}/allowedValues`](/docs/api-reference/get-classification-attribute-allowed-values) |

## Where to Go Next

- [Attributes](/docs/features/attributes)
- [Schemas](/docs/features/schemas)
- [Documents](/docs/features/documents)
- [Document Attributes API Tutorial](/docs/tutorials/Documents/document-attributes-api)
- [DynamoDB Schema](/docs/platform/database_schema)
