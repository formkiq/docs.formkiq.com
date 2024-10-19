# DynamoDB Backup

## Introduction
This backup policy outlines the procedures for creating, maintaining, and restoring backups of DynamoDB tables to ensure data durability, business continuity, and quick recovery in case of data loss, corruption, or unintentional modification.

Depending on your companies Recovery Time Objective (RTO), Recovery Point Objective (RPO) objectives, regulatory, and business requirements for data retention the default FormKiQ configuration may be enough or you might need to enable additional backup strategies.

## Point-in-Time Recovery

By default FormKiQ sets up all DynamoDb tables that store document data with Point-in-Time Recovery (PITR) enabled. This ensures continuous backups of these tables and allows for the recovery from human errors, data corruption, or accidental table modifications.

With Point-in-Time Recovery (PITR), enabled this will provide continuous backups for up to **35 days** window.

## Additional Backup Strategy

### On-Demand Backups

On-demand backups create a snapshot of the entire DynamoDB table, which is retained until explicitly deleted. On-demand backups are not continuous but can be created at specific points in time.

#### When to Implement:
  - Before making significant schema changes or data migrations.
  - Prior to any major deployments or upgrades that could potentially cause data corruption.
  - To comply with long-term retention policies that exceed the 35-day limit of PITR.
  - For tables that are not frequently updated but need long-term, stable backup points.

#### Why to Implement

On-demand backups provide a stable snapshot for long-term retention and disaster recovery outside the 35-day PITR window. This is especially useful for audit purposes or meeting compliance requirements where longer retention periods are necessary.

#### How to Implement
  - Use the AWS Management Console, AWS CLI, or SDK to create on-demand backups.
  - Schedule on-demand backups using automation (e.g., AWS Lambda, AWS Backup, or a CI/CD pipeline).
  - Retain these backups for a specified time, typically **90 days**.

### AWS Backup Integration

AWS Backup is a centralized backup service for managing backups across multiple AWS services, including DynamoDB.

#### When to Implement
  - If your organization manages multiple AWS resources and you require centralized backup management.
  - For cross-region or cross-account backup needs.
  - To comply with governance and compliance policies that require backup automation and reporting.

#### Why to Implement

AWS Backup provides a unified backup management system, automating the backup creation, retention, and deletion processes for multiple AWS services. It ensures compliance, simplifies cross-region backups, and supports disaster recovery.

#### How to Implement

  - Define backup plans using AWS Backup, specifying the DynamoDB tables to back up and the frequency of backups.
  - Use AWS Backup for **cross-region** backups to ensure resilience against regional outages.
  - Schedule backups and automate retention policies using AWS Backup’s lifecycle rules.

### Export to Amazon S3

Exporting DynamoDB table data to Amazon S3 allows for the extraction of table data for archival, analysis, and integration with other systems.

#### When to Implement

  - When you need an archive of data beyond the 35-day PITR window.
  - When you need to perform long-term auditing or compliance reporting that requires storing data outside of DynamoDB.
  - If integration with other analytics tools is necessary (e.g., Amazon Athena, Amazon Redshift).

#### Why to Implement

Exporting to S3 provides flexibility for long-term data retention, offline analysis, and third-party integration. It offers cost-effective storage for data that is no longer needed in DynamoDB but must be retained.

#### How to Implement

  - Use the **Export to S3** feature in DynamoDB to export data to Amazon S3 without affecting table performance.
  - Schedule regular exports (e.g., monthly) to capture historical data snapshots.
  - Implement lifecycle policies in Amazon S3 to manage the retention and archival of exported data.

## Restoring from Backups

### Restoring Using Point-in-Time Recovery (PITR)

#### When to Use

PITR should be used when you need to restore a table due to human errors such as accidental data deletion, corruption, or modification.

#### How to Restore
* In the AWS Management Console, navigate to **DynamoDB**.
* Select the table you wish to restore.
* Choose **Actions** > **Restore Table to Point in Time**.
* Specify the date and exact time (to the second) to restore the table to.
* Confirm the restoration process. A new table will be created with the restored data.  
  
**Limitations**: PITR can restore data only within the last 35 days.

### Restoring Using On-Demand Backups

On-demand backups should be used for restoring a table after a major incident, such as a complete table loss or failure during a schema update, or when restoring from a long-term retention backup.

#### How to Restore

* In the AWS Management Console, go to **DynamoDB** and select **Backups**.
* Find the backup you wish to restore from.
* Select the **Restore** option and choose the appropriate backup snapshot.
* Specify the table name for the restored data (it will create a new table).
* Confirm the restoration process.
  
**Limitations**: Restores are limited by the time and date the backup was taken.

### Restoring Using AWS Backup

Use AWS Backup when performing cross-region or cross-account disaster recovery, or when centralizing recovery across multiple AWS services.

#### How to Restore

* Open the **AWS Backup** console.
* Navigate to **Protected Resources** and select **DynamoDB**.
* Select the backup plan and the specific backup to restore.
* Click on **Restore** and specify the region and account where the restore should take place.
* AWS Backup will initiate the restore, and a new table will be created with the restored data.

**Limitations**: Ensure that the destination region/account has proper permissions for restoring resources.

### Restoring Using Export to Amazon S3

Use S3 exports when you need to restore data outside the normal DynamoDB operations, such as for historical analysis or long-term audit requirements.

#### How to Restore
* In the AWS Management Console, go to **Amazon S3** and find the bucket where the data was exported.
* Retrieve the exported data files (they will be in a format such as **.csv** or **.json**).
* Depending on the purpose, re-import the data back into DynamoDB (if needed) using scripts or AWS Glue ETL jobs, or analyze the data directly in Amazon S3 using tools like Amazon Athena.

**Limitations**: Restoring data from S3 is not a direct DynamoDB recovery process; additional ETL workflows are needed for re-ingestion.
