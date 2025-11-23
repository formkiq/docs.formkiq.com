---
sidebar_position: 8
---

# Backup and Recovery

## Overview

FormKiQ provides robust backup and recovery capabilities to protect your document management system against data loss, accidental deletion, or service disruptions. This documentation outlines the backup strategies, recovery procedures, and best practices for maintaining business continuity in your FormKiQ environment.

Your specific backup implementation should align with your organization's:
- Recovery Time Objective (RTO)
- Recovery Point Objective (RPO)
- Regulatory requirements
- Data retention policies

:::note
FormKiQ automatically configures Point-in-Time Recovery for all DynamoDB tables (except cache tables) with a 35-day recovery window, providing built-in protection for your document metadata.
:::

## Core System Components

FormKiQ's architecture consists of several core components, each requiring specific backup considerations:

| Component | AWS Service | Backup Method | Default Configuration |
|-----------|------------|---------------|----------------------|
| Document Content | Amazon S3 | S3 Versioning, Cross-Region Replication | Versioning enabled |
| Document Metadata | Amazon DynamoDB | Point-in-Time Recovery | Enabled with 35-day window |
| User Authentication | Amazon Cognito | Cognito User Pool Export | Manual export |
| API Configuration | API Gateway | CloudFormation or CDK | Infrastructure as Code |
| Custom Functions | AWS Lambda | Infrastructure as Code | CloudFormation/CDK |
| Search Indexes | Amazon OpenSearch (if used) | Automated Snapshots | Configurable |

## Automated Backup Capabilities

### DynamoDB Point-in-Time Recovery

FormKiQ automatically enables Point-in-Time Recovery (PITR) for all critical DynamoDB tables:

- **Continuous Backups**: Automatically maintains continuous backups of all data changes
- **Recovery Window**: Allows restoration to any point within the past 35 days
- **Granularity**: Recovery to any second within the backup window
- **No Performance Impact**: Zero impact on table performance or availability

To verify PITR status for your FormKiQ tables:

1. Open the AWS DynamoDB Console
2. Select each FormKiQ table (Documents, Sites, etc.)
3. Navigate to the "Backups" tab
4. Confirm "Point-in-time recovery" shows as "Enabled"

### S3 Object Versioning

FormKiQ configures versioning on document storage buckets, leveraging S3's native reliability of 99.999999999% (11 9's) durability and 99.99% availability across multiple Availability Zones:

- **Multiple Versions**: Maintains previous versions of all documents
- **Deletion Protection**: Preserves objects even when deleted (as delete markers)
- **Complete History**: Maintains a full history of document changes
- **Near Real-time Protection**: Provides immediate protection against accidental or malicious deletions

To verify S3 versioning:

1. Open the AWS S3 Console
2. Navigate to your FormKiQ document bucket
3. Select the "Properties" tab
4. Confirm "Bucket Versioning" is set to "Enabled"

### OpenSearch Automated Snapshots

For installations with the Enhanced Full-Text Search Add-On Module:

- **Daily Snapshots**: Automated daily snapshots of the search index
- **S3 Storage**: Snapshots stored in a dedicated S3 bucket
- **Retention Period**: Configurable retention period (default: 14 days)

## Additional Backup Options

### On-Demand Backups

Create complete DynamoDB table snapshots that persist until explicitly deleted.

**Best For**:
- Pre-deployment safeguards
- Schema migration protection
- Long-term retention (beyond 35 days)
- Compliance requirements
- Stable recovery points

```bash
# Using AWS CLI to create an on-demand backup
aws dynamodb create-backup \
  --table-name formkiq_documents \
  --backup-name "Pre-Migration-Backup-$(date +%Y%m%d)"
```

### Document Metadata Export (DynamoDB to S3)

Export table data for long-term archival, analysis, and compliance reporting:

```bash
# Using the AWS CLI to export a DynamoDB table to S3
aws dynamodb export-table-to-point-in-time \
  --table-arn arn:aws:dynamodb:us-east-1:123456789012:table/formkiq_documents \
  --s3-bucket your-backup-bucket \
  --s3-prefix document-metadata-backup \
  --export-format DYNAMODB_JSON \
  --export-time "2023-05-20T12:00:00Z"

**Best For**:
- Extended archival needs
- Compliance reporting
- Data analysis requirements
- Third-party integrations
- Cost-effective storage
```

### Cognito User Export

To back up user information:

1. Open the AWS Cognito Console
2. Select your FormKiQ User Pool
3. Navigate to "Users"
4. Use the "Export to CSV" option
5. Store the CSV in a secure location

Alternatively, use the AWS CLI:

```bash
# Get the user pool ID from your FormKiQ CloudFormation stack outputs
USER_POOL_ID=$(aws cloudformation describe-stacks \
  --stack-name your-formkiq-stack \
  --query "Stacks[0].Outputs[?OutputKey=='CognitoUserPoolId'].OutputValue" \
  --output text)

# List users and export to a file
aws cognito-idp list-users \
  --user-pool-id $USER_POOL_ID \
  --attributes-to-get "email" "name" "given_name" "family_name" "custom:role" \
  --output json > cognito_users_backup_$(date +%Y%m%d).json

# For larger user pools, use pagination
aws cognito-idp list-users \
  --user-pool-id $USER_POOL_ID \
  --pagination-token "EXAMPLE-TOKEN" \
  --limit 60 \
  --output json >> cognito_users_backup_$(date +%Y%m%d).json
```

### CloudFormation Stack Backup

It's good practice to periodically save your CloudFormation template:

```bash
# Export the FormKiQ CloudFormation template
aws cloudformation get-template \
  --stack-name your-formkiq-stack \
  --query "TemplateBody" \
  --output json > formkiq_template_backup_$(date +%Y%m%d).json
```

## Recovery Procedures

### DynamoDB Point-in-Time Recovery

To restore a DynamoDB table to a previous state:

1. Open the AWS DynamoDB Console
2. Select the table to restore
3. Choose "Backups" tab
4. Select "Restore to point in time"
5. Specify the exact date and time for restoration
6. Provide a name for the restored table
7. Click "Restore"

**Performance**:
- **RTO**: 1-4 hours (depending on table size)
- Creates a new table with restored data
- Original table remains unaffected
- Restoration limited to 35-day window

```bash
# Using AWS CLI to restore a table to a point in time
aws dynamodb restore-table-to-point-in-time \
  --source-table-name formkiq_documents \
  --target-table-name formkiq_documents_restored \
  --use-latest-restorable-time
```

After restoration, update your FormKiQ configuration to point to the restored table or migrate data back to the original table.

### S3 Document Recovery

To recover deleted documents or previous versions:

1. Open the AWS S3 Console
2. Navigate to your FormKiQ document bucket
3. Toggle "Show versions" option to ON
4. Locate the document version to restore
5. Select the version and choose "Download" or "Copy"

**Performance**:
- **RTO**: Immediate to minutes (depending on object size)
- No data transfer fees between versions within same region
- Instant accessibility after restoration
- No impact on production systems

### OpenSearch Index Recovery

To restore a search index:

1. Identify the snapshot to restore from
2. Restore the snapshot to a new domain
3. Verify the index data
4. Update your FormKiQ configuration to point to the restored index

```bash
# Using the OpenSearch APIs to restore a snapshot
curl -X POST \
  -H 'Content-Type: application/json' \
  https://your-opensearch-endpoint/_snapshot/cs-automated/snapshot_name/_restore \
  -d '{"indices": "formkiq-index", "rename_pattern": "(.+)", "rename_replacement": "restored_$1"}'
```

### Complete System Recovery

For a full system recovery:

1. **Redeploy the FormKiQ CloudFormation stack** using your backup template
2. **Restore DynamoDB tables** using Point-in-Time Recovery
3. **Confirm S3 bucket contents** are accessible
4. **Rebuild OpenSearch indexes** if necessary
5. **Validate system functionality** through the API and console

## Disaster Recovery Strategies

### Cross-Region Replication

For enhanced business continuity, consider implementing cross-region replication:

#### S3 Cross-Region Replication

**Best For**:
- Regional disaster recovery
- Geographic redundancy
- Compliance requirements
- Multi-region availability
- Low-latency access across regions

```yaml
# Example CloudFormation snippet for S3 CRR configuration
ReplicationConfiguration:
  Role: !GetAtt ReplicationRole.Arn
  Rules:
    - Status: Enabled
      Priority: 1
      DeleteMarkerReplication:
        Status: Enabled
      Destination:
        Bucket: !Sub arn:aws:s3:::${SecondaryBucket}
        EncryptionConfiguration:
          ReplicaKmsKeyID: !GetAtt ReplicaKeyId.Arn
```

**Monitoring Metrics**:
Monitor these key replication metrics:
- Replication latency (average time for object replication)
- Bytes pending replication
- Operations pending replication
- Replication failure rates

#### DynamoDB Global Tables

For multi-region redundancy, consider upgrading to DynamoDB Global Tables:

1. Open the AWS DynamoDB Console
2. Select your FormKiQ table
3. Choose "Global Tables" tab
4. Select "Create replica"
5. Choose the secondary region
6. Click "Create replica"

### Backup Strategy Tiers

| Tier | Strategy | Components | Recovery Time Objective |
|------|----------|------------|-------------------------|
| Basic | Point-in-Time Recovery + S3 Versioning | Document content and metadata | 1-4 hours |
| Standard | Basic + Manual exports | All system data | 2-8 hours |
| Enhanced | Standard + Cross-Region Replication | All system data with geographic redundancy | 15-60 minutes |
| Enterprise | Enhanced + Global Tables + Multi-region deployment | Complete system redundancy | < 15 minutes |

## Testing and Validation

Regular testing of your backup and recovery procedures is essential:

### Quarterly Testing Checklist

1. **DynamoDB Restoration Test**:
   - Restore a table to a point in time
   - Verify data integrity
   - Test application functionality with restored data

2. **S3 Document Recovery Test**:
   - Recover a document from a previous version
   - Verify file integrity
   - Confirm metadata association

3. **Full System Recovery Drill**:
   - Restore complete system in test environment
   - Validate all components and integrations
   - Measure actual recovery time

## Backup Monitoring and Maintenance

### CloudWatch Alarms

Set up the following CloudWatch alarms to monitor backup health:

1. **PITR Status Alarm**:
   - Monitor `ContinuousBackupsStatus` metric
   - Alert on DISABLED status

2. **S3 Versioning Alarm**:
   - Create custom Lambda to check versioning status
   - Schedule regular verification

3. **Replication Latency Alarm**:
   - For Cross-Region Replication, monitor `ReplicationLatency`
   - Alert on delays exceeding threshold
   - Track `BytesPendingReplication` and `OperationsPendingReplication`
   - Monitor `ReplicationTimeHigh` if Replication Time Control is enabled

### Backup Validation Procedures

Implement regular validation of your backups:

1. **Metadata Integrity Check**:
   ```bash
   # Sample script to validate DynamoDB export integrity
   aws s3 cp s3://your-backup-bucket/latest-export/manifest-summary.json .
   cat manifest-summary.json | jq '.itemCount'
   ```

2. **Document Sample Verification**:
   - Periodically restore a sample document
   - Verify content matches original
   - Confirm all versions are available

## Compliance and Retention

### Backup Retention Policy

Configure appropriate retention policies based on your requirements:

1. **Short-term Operational Recovery**:
   - DynamoDB PITR: 35 days
   - S3 current and previous versions: Indefinite

2. **Medium-term Compliance**:
   - Monthly DynamoDB exports: 1 year
   - Cognito user exports: 1 year

3. **Long-term Archival**:
   - Annual full system backup: 7+ years
   - Consider S3 Glacier Instance Retrieval / S3 Glacier for cost optimization

### Compliance Documentation

Maintain records of your backup and recovery activities:

1. **Backup Execution Logs**:
   - Store CloudWatch Logs for all backup operations
   - Document manual backup procedures

2. **Recovery Test Reports**:
   - Document all recovery tests
   - Record success metrics and issues encountered

3. **Audit Trail**:
   - Maintain change logs for backup configuration
   - Document access to backup resources

## Cost Optimization

### Backup Storage Optimization

Implement cost-saving measures for backup storage:

1. **S3 Lifecycle Policies**:
   ```json
   {
   "Rules": [
      {
         "Status": "Enabled",
         "Prefix": "backup/",
         "Transition": {
         "Days": 60,
         "StorageClass": "GLACIER_IR"
         }
      }
   ]
   }
   ```

2. **S3 Version Management**:
   - Configure version lifecycle policies to expire older versions
   - Transition non-current versions to cheaper storage classes
   - Implement expiration rules for delete markers with no non-current versions

3. **DynamoDB Export Compression**:
   - Enable compression for DynamoDB exports
   - Implement server-side encryption for security

4. **Selective Backup Strategy**:
   - Identify critical vs. non-critical data
   - Apply different retention periods based on data value
   - Use tagging to manage backup lifecycle automatically

## Additional Considerations

### Multi-Tenant Environment Backups

For FormKiQ deployments with multiple sites:

1. **Site Isolation**:
   - Consider separate backup schedules for different sites
   - Prioritize critical tenants for more frequent backups

2. **Site-Specific Recovery**:
   - Develop procedures for recovering individual sites
   - Test selective tenant restoration

### Automation and Integration

Enhance your backup strategy with automation:

1. **AWS Backup Integration**:
   - Consider using AWS Backup service for centralized management
   - Define backup plans for FormKiQ resources

2. **EventBridge Automation**:
   - Create EventBridge rules to trigger backup verification
   - Send notifications on backup completion or failure

3. **CI/CD Pipeline Integration**:
   - Include backup verification in deployment pipelines
   - Ensure new deployments don't compromise recovery capabilities

:::note
While FormKiQ provides robust built-in backup mechanisms, it's the responsibility of system administrators to define and test comprehensive backup and recovery procedures aligned with their organization's business continuity requirements.
:::

## AWS Backup Integration

AWS Backup provides a centralized service to manage and automate backups across AWS services. Consider integrating FormKiQ with AWS Backup for enhanced management capabilities:

### Setting Up AWS Backup for FormKiQ

1. Create a Backup Plan:
   - Define backup frequency, window, and lifecycle
   - Create resource assignments for FormKiQ resources

2. Configure Resource Assignments:
   - Include DynamoDB tables, S3 buckets, and other FormKiQ resources
   - Use tags to identify FormKiQ resources

3. Monitor Backup Jobs:
   - Track backup job status in AWS Backup dashboard
   - Set up notifications for backup events

### Example AWS Backup Plan

```json
{
  "BackupPlan": {
    "BackupPlanName": "FormKiQ-Daily-Backup",
    "Rules": [
      {
        "RuleName": "DailyBackups",
        "TargetBackupVault": "FormKiQ-Vault",
        "ScheduleExpression": "cron(0 5 * * ? *)",
        "StartWindowMinutes": 60,
        "CompletionWindowMinutes": 180,
        "Lifecycle": {
          "DeleteAfterDays": 35
        },
        "RecoveryPointTags": {
          "Application": "FormKiQ"
        }
      }
    ]
  }
}
```

## Additional Resources

- [AWS DynamoDB Backup and Restore Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/BackupRestore.html)
- [AWS S3 Versioning Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)
- [AWS Backup Service Documentation](https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html)
- [FormKiQ Security Documentation](/docs/platform/security)