---
id: dynamodb-data-migration
title: DynamoDb data Migration
sidebar_position: 3
sidebar_label: DynamoDb Data migration
slug: /tutorials/dynamodb-data-migration
description: Step-by-step guide to migrating DynamoDb to another FormKiQ instance.
tags:
  - tutorial
  - formkiq
  - cli
  - migration
---

# Data Migration

This tutorial show you how to use the "--restore-dynamodb" option in the [FileSync CLI](/docs/add-on-modules/modules/filesync-cli) and the "sync" option in the [AWS CLI](https://aws.amazon.com/cli/) to sync documents from one FormKiQ installation to another.

## What you’ll need

* Access to a FormKiQ Advanced or Enterprise installation

* An installed and configured latest version of the [FileSync CLI](/docs/add-on-modules/modules/filesync-cli)

## Step 1: Sync DynamoDb

**The first step is to sync the document metadata.**

Using the [FileSync CLI](/docs/add-on-modules/modules/filesync-cli), you can sync the FormKiQ metadata that is stored in [Amazon DynamoDb](https://aws.amazon.com/dynamodb) using the command:

```
fk --restore-dynamodb --from-table <source_dynamodb_tablename> --to-table <destination_dynamodb_tablename>
```

:::note
The --dry-run and --verbose can be used with this command to see the output from the CLI
:::

### Example

```
fk --restore-dynamodb --from-table formkiq-enterprise-dev1-documents --to-table formkiq-enterprise-dev2-documents
```

## Step 2: Sync Document Content

**Once the document metadata has been synced, you can proceed to the second step of moving the actual file objects.**

Using the [AWS CLI](https://aws.amazon.com/cli/), you can sync the document contents from one S3 bucket to another.

```
aws s3 sync s3://<source-bucket> s3://<destination-bucket>
```

:::note
The --dry-run can be used with this command to see the output from the CLI
:::

### Example

```
aws s3 sync s3://formkiq-enterprise-dev1-documents-1111111111 s3://formkiq-enterprise-dev2-documents-1111111111
```

## Summary

And there you have it! We have shown how easy it is to use [FileSync CLI](/docs/add-on-modules/modules/filesync-cli) and [AWS CLI](https://aws.amazon.com/cli/) to sync documents from one FormKiQ installation to another.

This is just the tip of the iceberg when it comes to working with the FormKiQ APIs.

If you have any questions, reach out to us on our https://github.com/formkiq/formkiq-core or https://formkiq.com.
