---
sidebar_position: 2
---

# Data Migration

This tutorial show you how to use the "--sync-dynamodb" option in the [FileSync CLI](/docs/add-on-modules/modules/filesync-cli) and the "sync" option in the [AWS CLI](https://aws.amazon.com/cli/) to sync documents from one FormKiQ installation to another.

## What you’ll need

* Access to a FormKiQ Pro or FormKiQ Enterprise installation

* An installed and configured latest version of the [FileSync CLI](/docs/add-on-modules/modules/filesync-cli)

## Step 1: Sync DynamoDb

**The first step is to sync the document metadata.**

Using the [FileSync CLI](/docs/add-on-modules/modules/filesync-cli), you can sync the FormKiQ metadata that is stored in [Amazon DynamoDb](https://aws.amazon.com/dynamodb) using the command:

```
fk --sync-dynamodb --source &lt;source_dynamodb_tablename&gt; --destintation &lt;destination_dynamodb_tablename&gt;
```

:::note
The --dry-run and --verbose can be used with this command to see the output from the CLI
:::

### Example

```
fk --sync-dynamodb --source formkiq-enterprise-dev1-documents --destintation formkiq-enterprise-dev2-documents
```

## Step 2: Sync Document Content

**Once the document metadata has been synced, you can proceed to the second step of moving the actual file objects.**

Using the [AWS CLI](https://aws.amazon.com/cli/), you can sync the document contents from one S3 bucket to another.

```
aws s3 sync s3://&lt;source-bucket&gt; s3://&lt;destination-bucket&gt;
```

:::note
The --dry-run can be used with this command to see the output from the CLI
:::

### Example

```
aws s3 sync s3://&lt;formkiq-enterprise-dev1-documents-1111111111&gt; s3://&lt;formkiq-enterprise-dev2-documents-1111111111&gt;
```

## Summary

And there you have it! We have shown how easy it is to use [FileSync CLI](/docs/add-on-modules/modules/filesync-cli) and [AWS CLI](https://aws.amazon.com/cli/) to sync documents from one FormKiQ installation to another.

This is just the tip of the iceberg when it comes to working with the FormKiQ APIs.

If you have any questions, reach out to us on our https://github.com/formkiq/formkiq-core or https://formkiq.com.
