---
id: fk-cli-import-csv-data-migration
title: Import CSV Data migration using the FormKiQ CLI
sidebar_position: 1
sidebar_label: Import-CSV Data Migration
slug: /tutorials/fk-cli-import-csv-data-migration
description: Step-by-step guide to migrating documents, attributes, and content into FormKiQ using the fk CLI CSV import commands.
tags:
  - tutorial
  - formkiq
  - cli
  - migration
---
# Import CSV Data Migration Using the FormKiQ CLI

## What You Will Build

This tutorial explains how to perform a **bulk data migration into FormKiQ** using the **FormKiQ CLI (`fk`)** and its built-in `--import-csv` functionality. The CLI importer is designed for efficiently loading large volumes of documents and metadata during initial onboarding or system migrations.

You will learn how to import **attributes**, **documents**, **document content**, and **document attributes** in a safe, repeatable order that supports re-runs without creating duplicates.

## Before You Begin

Before starting the migration, ensure you have:

- The **FormKiQ CLI (`fk`)** installed and configured
- Access credentials to your FormKiQ environment
- CSV files prepared for each import stage
- UUID v4 values generated for documents
- Sufficient CPU and network bandwidth on the machine running the CLI

## Workflow Overview

1. Verify the CLI configuration.
2. Import attribute definitions.
3. Import document records.
4. Import document attribute values.
5. Import document content.
6. Verify each import stage.
7. Review performance and troubleshooting guidance.

## Step 1: Verify the CLI Setup

### Install and configure the FormKiQ CLI

Verify the CLI is available:

```bash
fk --version
```

Ensure the CLI is authenticated and pointing to the correct environment:

```bash
fk status
```

### Migration order (important)

Always run imports in the following order:
- Attributes
- Documents
- Document attributes
- Document contents

This order ensures all referenced objects exist before they are used.

:::note
When importing a large number of documents, review [Scaling FormKiQ Components](/docs/platform/overview#scaling-formkiq-components) to reduce overall migration time.
:::

## Step 2: Import Attributes

Attributes define the metadata fields that can later be assigned to documents.

**CSV format**

```
AttributeKey,DataType,Type
status,STRING,STANDARD
priority,NUMBER,STANDARD
reviewed,BOOLEAN,STANDARD
reviewDate,DATE,STANDARD
```

- AttributeKey: Unique attribute identifier
- DataType: STRING, NUMBER, BOOLEAN, DATE, or KEY_ONLY
- Type: STANDARD, GOVERNANCE, or OPA

**Command**

```bash
fk --import-csv --attributes attributes.csv
```

This step can be safely re-run to add or update attribute definitions.

## Step 3: Import Documents

This step registers document records in FormKiQ without uploading content yet.

**CSV format**

```csv
DocumentId,Path,ContentType,DeepLink,Artifacts,ArtifactCategory,ResourceType
550e8400-e29b-41d4-a716-446655440000,/invoices/2025/05/001.pdf,application/pdf,,true,,DOCUMENT
123e4567-e89b-12d3-a456-426614174000,/reports/2025/Q1.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,https://example.com/reports/Q1,,quarterly-report,DEEP_LINK
```

| Column | Required | Description |
| --- | --- | --- |
| `DocumentId` | Yes | User-supplied UUID v4. |
| `Path` | Yes | Virtual FormKiQ path or document name. |
| `ContentType` | Yes | Document MIME type. The value may be empty. |
| `DeepLink` | Yes | External URL for the document. The value may be empty. |
| `Artifacts` | No | Whether the document supports artifact documents. Accepted values are `true` and `false`. |
| `ArtifactCategory` | No | Artifact category assigned to the document. |
| `ResourceType` | No | Document resource type. Accepted values are `DOCUMENT`, `DOSSIER`, and `DEEP_LINK`. |

:::note
CSV headers are case-sensitive. The `Artifacts`, `ArtifactCategory`, and `ResourceType` columns are optional and may be omitted entirely, so existing files containing only `DocumentId`, `Path`, `ContentType`, and `DeepLink` remain valid. Blank optional values are not sent to FormKiQ.

Using a consistent `DocumentId` allows you to rerun imports without creating duplicates.
:::

**Command**

```bash
fk --import-csv --documents documents.csv
```

The CLI writes successful records to a sequenced file beside the input, such as `documents.success.001.csv`. The output includes an `ArtifactId` column populated from the `POST /documents` response:

```csv
DocumentId,Path,ContentType,DeepLink,Artifacts,ArtifactCategory,ResourceType,ArtifactId
550e8400-e29b-41d4-a716-446655440000,/invoices/2025/05/001.pdf,application/pdf,,true,,DOCUMENT,01KJ4FA17H9Q8ZJ3YV6M2C8W5X
```

Copy the returned `ArtifactId` into the following document attribute and content CSV rows that target the artifact. The value is blank for documents without artifacts.

## Step 4: Import Document Attributes

This step assigns metadata values to existing documents.

**CSV format**

```csv
DocumentId,ArtifactId,AttributeKey,StringValue,NumberValue,BooleanValue,DateValue
550e8400-e29b-41d4-a716-446655440000,01KJ4FA17H9Q8ZJ3YV6M2C8W5X,status,approved,,,
550e8400-e29b-41d4-a716-446655440000,01KJ4FA17H9Q8ZJ3YV6M2C8W5X,priority,,5,,
123e4567-e89b-12d3-a456-426614174000,,isPublished,,,true,
123e4567-e89b-12d3-a456-426614174000,,reviewDate,,,,2026-08-14T00:00:00Z
```

Rules:
- DocumentId must already exist
- ArtifactId is optional; omit the column or leave it blank to target the primary document
- AttributeKey must be defined
- Only one of StringValue, NumberValue, BooleanValue, or DateValue should be populated per row
- DateValue accepts ISO-8601 dates or date-times; UTC date-times such as `2026-08-14T00:00:00Z` are recommended
- Repeat a row with the same DocumentId, ArtifactId, and AttributeKey to import multiple string or date values
- DateValue may be omitted from CSV files that do not import date attributes

**Command**

```bash
fk --import-csv --document-attributes document-attributes.csv
```

This step performs the bulk data transfer and is the most resource-intensive part of the migration.

## Step 5: Import Document Contents

This step uploads or links the actual binary content for each document.

**CSV format**

```csv
DocumentId,ArtifactId,Location
550e8400-e29b-41d4-a716-446655440000,01KJ4FA17H9Q8ZJ3YV6M2C8W5X,/path/to/file.pdf
123e4567-e89b-12d3-a456-426614174000,,s3://my-bucket/documents/report.xlsx
```

Location can be:
- A local filesystem path
- An S3 URI (s3://bucket/key)

`ArtifactId` is optional. Omit the column or leave it blank to upload content to the primary document.

**Command**

```bash
fk --import-csv --document-contents document-contents.csv
```

This step performs the bulk data transfer and is the most resource-intensive part of the migration.

## Verify the Result

After running an import, you can use the `--verify` option to **validate the imported data against FormKiQ**.  
This verification step confirms that the data written during the import is **consistent with FormKiQ’s internal rules and state**.

The verification process checks:

- That imported **attributes** are correctly registered
- That **documents** exist and are accessible
- That **document content** is properly associated
- That **document attributes** are valid and resolvable
- That relationships and data types conform to FormKiQ expectations

:::note
The `--verify` option is run **after an import has completed**.  
It does **not** validate CSV structure or local file contents, and it does **not** modify any data.
:::

**Example: verify imported attributes**

```bash
fk --import-csv --attributes attributes.csv --verify
```

**Example: verify imported documents**
```bash
fk --import-csv --documents documents.csv --verify
```

**Example: verify imported document attributes**
```bash
fk --import-csv --document-attributes document-attributes.csv --verify
```

**Example: verify imported document contents**
```bash
fk --import-csv --document-contents document-contents.csv --verify
```

:::tip
Run verification immediately after each import stage to catch issues early before proceeding to the next step in the migration.
:::

## Performance and environment considerations

Migration speed is heavily influenced by where the CLI is executed:

### Local machine

Limited by your internet bandwidth to AWS

### AWS CloudShell

Convenient, but has CPU and throughput limits

### Amazon EC2 (recommended)
- Use C5 instances for compute-intensive workloads
- High network throughput improves import speed
- Spot instances can significantly reduce cost for large migrations

:::tip
Running the CLI on an EC2 instance in the same region as FormKiQ provides the best performance.
:::

## Clean Up

Archive the import CSV files and CLI output logs with your migration records. Remove local files containing sensitive data after validation is complete.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| Document not found | Document content or attributes were imported before the document records. | Run the import stages in the documented order. |
| Attribute does not exist | Document attributes reference keys that were not created. | Verify the attributes import before assigning document attributes. |
| Slow import performance | The CLI host, network, API, or downstream services are constrained. | Run the CLI from EC2 in the same Region and review scaling guidance. |
| Duplicate documents | Document IDs were regenerated between import attempts. | Use stable UUIDs in the `DocumentId` column. |

## Next Steps

After completing the migration, validate imported data using the FormKiQ UI or API.

- [FormKiQ CLI](/docs/formkiq-modules/modules/formkiq-cli)
- [Migration and Data Import](/docs/platform/migration-and-data-import)
