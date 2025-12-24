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
## Overview

This tutorial explains how to perform a **bulk data migration into FormKiQ** using the **FormKiQ CLI (`fk`)** and its built-in `--import-csv` functionality. The CLI importer is designed for efficiently loading large volumes of documents and metadata during initial onboarding or system migrations.

You will learn how to import **attributes**, **documents**, **document content**, and **document attributes** in a safe, repeatable order that supports re-runs without creating duplicates.

---

## Prerequisites

Before starting the migration, ensure you have:

- The **FormKiQ CLI (`fk`)** installed and configured
- Access credentials to your FormKiQ environment
- CSV files prepared for each import stage
- UUID v4 values generated for documents
- Sufficient CPU and network bandwidth on the machine running the CLI

---

## Setup

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

## Step-by-step walkthrough

### Import attributes

Attributes define the metadata fields that can later be assigned to documents.

**CSV format**

```
AttributeKey,DataType,Type
status,STRING,STANDARD
priority,NUMBER,STANDARD
reviewed,BOOLEAN,STANDARD
```

- AttributeKey: Unique attribute identifier
- DataType: STRING, NUMBER, BOOLEAN, or KEY_ONLY
- Type: STANDARD, GOVERNANCE, or OPA

**Command**

```bash
fk --import-csv --attributes attributes.csv
```

This step can be safely re-run to add or update attribute definitions.

### Import documents

This step registers document records in FormKiQ without uploading content yet.

**CSV format**

```
DocumentId,Path,ContentType,DeepLink
550e8400-e29b-41d4-a716-446655440000,/invoices/2025/05/001.pdf,application/pdf,
123e4567-e89b-12d3-a456-426614174000,/reports/2025/Q1.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
```

- DocumentId: UUID v4 (user-supplied)
- Path: Virtual FormKiQ path
- ContentType: MIME type
- DeepLink: Optional external URL

:::note
Using a consistent DocumentId allows you to re-run imports without creating duplicates.
:::

**Command**

```bash
fk --import-csv --documents documents.csv
```

### Import document attributes

This step assigns metadata values to existing documents.

**CSV format**

```
DocumentId,AttributeKey,StringValue,NumberValue,BooleanValue
550e8400-e29b-41d4-a716-446655440000,status,approved,,
550e8400-e29b-41d4-a716-446655440000,priority,,5,
123e4567-e89b-12d3-a456-426614174000,isPublished,,,true
```

Rules:
- DocumentId must already exist
- AttributeKey must be defined
- Only one value column should be populated per row

**Command**

```bash
fk --import-csv --document-attributes document-attributes.csv
```

This step performs the bulk data transfer and is the most resource-intensive part of the migration.

### Import document contents

This step uploads or links the actual binary content for each document.

**CSV format**

```
DocumentId,Location
550e8400-e29b-41d4-a716-446655440000,/path/to/file.pdf
123e4567-e89b-12d3-a456-426614174000,s3://my-bucket/documents/report.xlsx
```

Location can be:
- A local filesystem path
- An S3 URI (s3://bucket/key)

**Command**

```bash
fk --import-csv --document-contents document-contents.csv
```

This step performs the bulk data transfer and is the most resource-intensive part of the migration.

### Verify the import against FormKiQ (recommended)

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

## Common errors and troubleshooting

### Document not found
- Ensure document import ran before content or attribute imports

### Attribute does not exist
- Verify attributes were imported successfully before assigning values

### Slow import performance
- Review scaling guidance and consider using a larger EC2 instance

### Duplicate documents
- Ensure consistent UUID usage in DocumentId

## Next steps

After completing the migration, validate imported data using the FormKiQ UI or API.