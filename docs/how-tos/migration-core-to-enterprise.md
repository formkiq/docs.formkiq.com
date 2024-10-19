---
sidebar_position: 10
---

# Document Migration from FormKiQ Core to Enterprise

This guide will show you how to migrate documents from a FormKiQ Core installation to an Enterprise installation.

## What you’ll need

* [AWS Command Line Interface (AWS CLI)](https://aws.amazon.com/cli)

* AWS CLI configured with DynamoDb / S3 access to the FormKiQ installations

* [jq](https://jqlang.github.io/jq/) is a lightweight and flexible command-line JSON processor. 

## Document Metadata

The document metadata is stored in [Amazon DynamoDB](https://aws.amazon.com/dynamodb/). The migration of the metadata involves determining the source and destintation DynamoDB tables and using the AWS cli to migrate the data from one table to another.

### Source / Target Tables

The source and target tables can be found from the [DynamoDB console](https://console.aws.amazon.com/dynamodbv2/home) by searching for the `AppEnvironment` names used in the FormKiQ installation.

![DynamoDB Table names](./img/migration-dynamodb-tables.png)

### Export/Import Data

To export the contents from a DynamoDB table and then import the data into another DynamoDB table using the AWS CLI and the bash script below.

The script uses the AWS CLI to export the data from the source DynamoDB table to a JSON file. Then it uses the AWS CLI to import the data into the target DynamoDB table.

Make sure to update the `YOUR_SOURCE_TABLE_NAME` and `YOUR_TARGET_TABLE_NAME`.

```
#!/bin/bash

OLD_TABLE=YOUR_SOURCE_TABLE_NAME
NEW_TABLE=YOUR_TARGET_TABLE_NAME
TMP_FILE=/tmp/inserts.json
batchSize=25
index=0

DATA=$(aws dynamodb scan --table-name $OLD_TABLE --max-items $batchSize)
((index+=1))
echo $DATA | jq ".Items | {\"$NEW_TABLE\": [{\"PutRequest\": { \"Item\": .[]}}]}" > "$TMP_FILE"
aws dynamodb batch-write-item --request-items "file://$TMP_FILE"

nextToken=$(echo $DATA | jq '.NextToken')
while [[ "${nextToken}" != "" ]]
do
  DATA=$(aws dynamodb scan --table-name $OLD_TABLE --max-items $batchSize --starting-token $nextToken)
  ((index+=1))
  echo $DATA | jq ".Items | {\"$NEW_TABLE\": [{\"PutRequest\": { \"Item\": .[]}}]}" > "$TMP_FILE"
  if [ ! -s "$TMP_FILE" ]; then
    echo "Scan returned no data. Finished operation"
    exit
  fi
  aws dynamodb batch-write-item --request-items "file://$TMP_FILE"
  nextToken=$(echo $DATA | jq '.NextToken')
done

```

## Document Content

FormKiQ stores the content of the documents in [Amazon S3](https://aws.amazon.com/s3) in the bucket labeled `-documents`.

### Source / Target S3 Buckets

Looking at the CloudFormation Outputs from both the source and target installations you will find the name of the S3 buckets.

![S3 Source Documents Bucket](./img/migration-s3-source-buckets.png)

![S3 Target Documents Bucket](./img/migration-s3-target-buckets.png)

### Copy Content

You can use the aws s3 sync command to copy all contents from one S3 bucket to another. 

```
aws s3 sync s3://source-bucket-name s3://destination-bucket-name
```

## Post Migration Cleanup

### LastModifiedDate

When S3 data is copied, the document's LastModifiedDate will be updated and no longer match the source DynamoDb table. The following script can be run to resync the LastModifiedDate from the source table.

```
#!/bin/bash

# Set the table names and AWS region
SOURCE_TABLE="your-source-table-name"
TARGET_TABLE="your-target-table-name"
AWS_REGION="your-aws-region"  # e.g., us-west-2

# Scan the source table and retrieve specific attributes where SK is "document"
aws dynamodb scan \
    --table-name "$SOURCE_TABLE" \
    --projection-expression "PK, SK, lastModifiedDate" \
    --filter-expression "SK = :skValue" \
    --expression-attribute-values '{":skValue": {"S": "document"}}' \
    --region "$AWS_REGION" \
    --output json > scan_results.json

# Check if the scan was successful
if [ $? -eq 0 ]; then
    echo "Scan successful. Results saved to scan_results.json."
else
    echo "Failed to scan the source table."
    exit 1
fi

# Extract the required fields using jq
jq -c '.Items[] | {PK: .PK.S, SK: .SK.S, lastModifiedDate: .lastModifiedDate.S}' scan_results.json > filtered_results.json

if [ $? -eq 0 ]; then
    echo "Filtered results saved to filtered_results.json."
else
    echo "Failed to filter the results."
    exit 1
fi

# Iterate over each record in filtered_results.json
while IFS= read -r row; do
    PK=$(echo "$row" | jq -r '.PK')
    SK=$(echo "$row" | jq -r '.SK')
    lastModifiedDate=$(echo "$row" | jq -r '.lastModifiedDate')

    # Update the corresponding item in the target table with the new lastModifiedDate
    aws dynamodb update-item \
        --table-name "$TARGET_TABLE" \
        --key "{\"PK\": {\"S\": \"$PK\"}, \"SK\": {\"S\": \"$SK\"}}" \
        --update-expression "SET lastModifiedDate = :newDate" \
        --expression-attribute-values "{\":newDate\": {\"S\": \"$lastModifiedDate\"}}" \
        --region "$AWS_REGION" \
        --return-values ALL_NEW

    # Check if the update was successful
    if [ $? -eq 0 ]; then
        echo "Updated item with PK=$PK, SK=$SK in $TARGET_TABLE."
    else
        echo "Failed to update item with PK=$PK, SK=$SK in $TARGET_TABLE."
    fi
done < filtered_results.json
```

## Summary

And there you have it! We have shown how easy it is to migrate documents from a FormKiQ Core installation to a Enterprise installation.

This is just the tip of the iceberg when it comes to working with the FormKiQ APIs. d

If you have any questions, reach out to us on our https://github.com/formkiq/formkiq-core or https://formkiq.com.
