---
sidebar_position: 8
toc_min_heading_level: 2
toc_max_heading_level: 2
---

# Backup and Recovery

## Overview

Backup and recovery planning for FormKiQ should cover document content, document metadata, configuration, identity, search indexes, logs, and any external systems connected to your workflows.

FormKiQ includes important AWS-native recovery controls, such as DynamoDB Point-in-Time Recovery and S3 bucket versioning, but customers remain responsible for defining recovery objectives, retention policies, backup monitoring, restore testing, and disaster recovery architecture.

Your plan should define:

- Recovery Time Objective (RTO): how quickly service must be restored
- Recovery Point Objective (RPO): how much data loss is acceptable
- Retention requirements for documents, metadata, logs, and backups
- Region, account, and data residency requirements
- Recovery ownership and approval process
- Testing cadence for restore procedures

:::warning
Backups are only useful if restore procedures are known and tested. Validate recovery in a non-production environment before relying on a process for production.
:::

## Core System Components

| Component | AWS service | Default or common protection | Customer planning required |
| --- | --- | --- | --- |
| Document content | Amazon S3 | S3 versioning in standard FormKiQ document buckets. | Lifecycle rules, retention, replication, object lock, purge policy, recovery testing. |
| Document metadata | Amazon DynamoDB | Point-in-Time Recovery for critical tables, except cache tables. | Restore process, table cutover or data repair plan, long-term exports if needed. |
| Site and application configuration | DynamoDB, CloudFormation, parameters | Some configuration stored in FormKiQ tables and stack configuration. | Stack template, parameters, outputs, module configuration, and change history exports. |
| User authentication | Amazon Cognito or external IdP | Cognito and IdP configuration managed outside document storage. | User pool/app client/group export, SSO metadata backup, IdP recovery process. |
| Search indexes | Typesense or Amazon OpenSearch when enabled | Backend-specific index durability; OpenSearch snapshots where configured. | Snapshot, restore, or reindex plan. |
| Document processing state | DynamoDB, queues, Lambda, logs | Operational records in FormKiQ tables and CloudWatch logs. | Recovery expectations for in-flight workflows and failed actions. |
| Observability and audit | CloudWatch, CloudTrail, FormKiQ activity records | Logs and events depend on customer retention settings. | Log retention, export, audit review, and incident evidence requirements. |

## Shared Responsibility

FormKiQ deploys into your AWS account. That gives you control over data residency, backup retention, encryption, monitoring, and recovery procedures, but it also means your operations team should validate those controls.

FormKiQ provides or configures:

- DynamoDB Point-in-Time Recovery for critical tables, excluding cache tables
- S3 versioning for document storage buckets in standard deployments
- CloudFormation-managed infrastructure
- API operations for document restore, document versions, OpenSearch snapshots, and reindexing where supported

Customers should define:

- Backup retention and legal hold requirements
- AWS Backup usage, if required
- Cross-region or cross-account backup copies
- OpenSearch snapshot retention
- Restore testing cadence
- Incident response and recovery ownership
- Procedures for external identity providers and downstream integrations

## Automated Backup Capabilities

### DynamoDB Point-in-Time Recovery

FormKiQ configures Point-in-Time Recovery (PITR) for critical DynamoDB tables, excluding cache tables. PITR allows a table to be restored to a new table at a selected point within the recovery window.

PITR is useful for:

- Accidental metadata deletion
- Bad application writes
- Failed imports or migrations
- Operational recovery within the 35-day PITR window

Important limitations:

- PITR restores to a new DynamoDB table. It does not overwrite the live table automatically.
- Restoring a FormKiQ table requires a controlled data repair, replacement, or cutover plan.
- Related data across multiple tables may need to be restored to the same recovery point.
- PITR does not restore S3 object content, OpenSearch indexes, Cognito users, or external systems.

Verify PITR:

```bash
aws dynamodb describe-continuous-backups \
  --table-name formkiq-documents-table-name
```

### S3 Object Versioning

FormKiQ document content is stored in Amazon S3. S3 versioning helps protect against accidental overwrite or deletion by retaining previous object versions and delete markers.

S3 versioning is useful for:

- Recovering previous document content
- Recovering objects hidden by delete markers
- Investigating accidental overwrite events
- Supporting rollback and audit scenarios

Important limitations:

- S3 versioning does not replace retention policy, legal hold, or object lock requirements.
- Lifecycle rules can expire old versions if configured to do so.
- Permanent purge operations and retention policies may affect recoverability.
- Metadata in DynamoDB and content in S3 may need to be reconciled together.

Verify bucket versioning:

```bash
aws s3api get-bucket-versioning \
  --bucket your-formkiq-document-bucket
```

### OpenSearch Automated Snapshots

Enhanced full-text search deployments may use Amazon OpenSearch Service. OpenSearch recovery should be planned separately from DynamoDB and S3.

OpenSearch snapshots are useful for:

- Restoring search indexes after index corruption
- Recovering from accidental index deletion
- Preserving search state before major search configuration changes

Important limitations:

- Search indexes are derived data. In some cases, reindexing from source documents is safer than restoring an old index.
- Snapshot availability and retention depend on the OpenSearch configuration.
- Restoring search does not restore source document metadata or content.

Related operations:

- [Add OpenSearch Snapshot](/docs/api-reference/add-open-search-snapshot)
- [Get OpenSearch Snapshots](/docs/api-reference/get-open-search-snapshots)
- [Restore OpenSearch Snapshot](/docs/api-reference/add-open-search-restore-snapshot)
- [Reindex Document](/docs/api-reference/add-reindex-document)

## AWS Backup

AWS Backup can centralize backup policy management across AWS services used by FormKiQ. It can be useful for enterprise governance, cross-account backup copies, retention enforcement, audit reporting, and Backup Vault Lock.

AWS Backup does not replace DynamoDB PITR for operational point-in-time recovery. Keep PITR enabled where FormKiQ configures it.

### AWS Backup Integration

Use AWS Backup when you need:

- Centralized backup plans
- Cross-region or cross-account backup copies
- Backup vault encryption and access policy controls
- Backup Vault Lock for immutability
- Compliance reporting across AWS accounts

Plan AWS Backup around resources such as:

| FormKiQ area | AWS Backup consideration |
| --- | --- |
| DynamoDB tables | Use backup plans for scheduled recovery points beyond PITR needs. |
| S3 buckets | Use AWS Backup for policy-based S3 backups if your compliance model requires it. |
| OpenSearch indexes | Manage OpenSearch snapshots separately. Do not assume AWS Backup replaces OpenSearch snapshot planning. |
| CloudFormation configuration | Export templates, parameters, and outputs separately. |
| Cognito and IdP configuration | Export or document separately; AWS Backup does not provide a full identity recovery story. |

Example AWS Backup plan shape:

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

## Additional Backup Options

### On-Demand Backups

Use on-demand DynamoDB backups for stable recovery points that must persist beyond the PITR window.

Best for:

- Pre-upgrade safeguards
- Migration checkpoints
- Long-term retention
- Compliance evidence
- Point-in-time snapshots before high-risk changes

```bash
aws dynamodb create-backup \
  --table-name formkiq-documents-table-name \
  --backup-name PreMigrationBackup
```

### Document Metadata Export

DynamoDB export to S3 can support long-term archival, analytics, compliance reporting, and migration workflows.

```bash
aws dynamodb export-table-to-point-in-time \
  --table-arn arn:aws:dynamodb:us-east-1:123456789012:table/formkiq-documents-table-name \
  --s3-bucket your-backup-bucket \
  --s3-prefix document-metadata-backup \
  --export-format DYNAMODB_JSON \
  --export-time "2026-05-20T12:00:00Z"
```

Best for:

- Extended archival needs
- Compliance reporting
- Offline analysis
- Migration planning
- Independent recovery records

### Cognito and Identity Configuration Export

If your deployment uses Amazon Cognito, back up more than the user list.

Capture:

- User pool ID and configuration
- App clients
- Groups and group membership
- Custom attributes
- Hosted UI/domain settings
- Lambda triggers
- SAML or OIDC identity provider settings
- Password and MFA policy settings

:::note
Cognito user exports do not fully preserve password state, MFA enrollment, app client secrets, hosted UI configuration, or all federation settings. Identity recovery should include configuration documentation and a tested identity-provider recovery process.
:::

Example user export:

```bash
aws cognito-idp list-users \
  --user-pool-id your-user-pool-id \
  --output json > cognito-users-export.json
```

### CloudFormation Stack Backup

Export CloudFormation templates, parameters, and outputs before upgrades and on a regular schedule.

```bash
aws cloudformation get-template \
  --stack-name your-formkiq-stack \
  --query TemplateBody \
  --output json > formkiq-template-backup.json
```

```bash
aws cloudformation describe-stacks \
  --stack-name your-formkiq-stack \
  --query "Stacks[0].{Parameters:Parameters,Outputs:Outputs}" \
  --output json > formkiq-stack-state-backup.json
```

## Recovery Procedures

### Recovery Decision Guide

| Scenario | First recovery path |
| --- | --- |
| A user soft-deleted a document | Use FormKiQ document restore. |
| A document was overwritten | Restore the previous S3 object version and reconcile metadata if needed. |
| A document was purged | Review backups, audit logs, retention controls, and legal/compliance requirements. Purge is intended to remove content from active storage. |
| Metadata was corrupted | Use DynamoDB PITR to restore to a new table, then repair or migrate affected records. |
| Search results are wrong | Reindex affected documents or restore OpenSearch snapshot if required. |
| User access is broken | Restore or reconfigure Cognito, SSO, groups, app clients, or API auth settings. |
| Stack configuration was changed incorrectly | Reapply previous CloudFormation parameters or template. |
| Full environment is unavailable | Follow complete environment recovery plan. |

### Document Restore and S3 Recovery

Start with the least disruptive recovery option.

1. If the document was soft-deleted, use FormKiQ restore: [`PUT /documents/{documentId}/restore`](/docs/api-reference/set-document-restore).
2. If content was overwritten, identify the correct S3 object version.
3. Restore or copy the needed object version.
4. Confirm FormKiQ metadata still points to the expected content.
5. Verify download, search, and document activity records.

For purge behavior, review [`DELETE /documents/{documentId}/purge`](/docs/api-reference/purge-document). Purge is designed to remove active document content and metadata traces outside audit logs and backups.

### DynamoDB Point-in-Time Recovery

To restore a DynamoDB table:

1. Identify the affected table or tables.
2. Identify the recovery timestamp.
3. Restore the table to a new table.
4. Compare restored records with the live table.
5. Repair affected records, migrate restored data, or plan a controlled cutover.
6. Validate FormKiQ behavior in a test environment before production changes.

```bash
aws dynamodb restore-table-to-point-in-time \
  --source-table-name formkiq-documents-table-name \
  --target-table-name formkiq-documents-restored \
  --restore-date-time "2026-05-20T12:00:00Z"
```

:::warning
Do not point a production FormKiQ stack at a restored DynamoDB table without a tested cutover plan. FormKiQ data spans tables, S3 content, indexes, queues, and integrations that may need coordinated recovery.
:::

### OpenSearch Index Recovery

If enhanced full-text search is installed, choose between reindexing and snapshot restore.

Use reindexing when:

- Source documents and metadata are healthy
- Search results are stale or incomplete
- Mappings, schema, or full-text settings changed

Use snapshot restore when:

- The index was deleted or corrupted
- Reindexing is too slow for the recovery target
- A known-good snapshot exists

Related operations:

- [Get OpenSearch Snapshots](/docs/api-reference/get-open-search-snapshots)
- [Restore OpenSearch Snapshot](/docs/api-reference/add-open-search-restore-snapshot)
- [Reindex Document](/docs/api-reference/add-reindex-document)

### Complete System Recovery

Full environment recovery usually requires multiple coordinated steps:

1. Redeploy or repair the FormKiQ CloudFormation stack.
2. Restore or validate DynamoDB metadata and configuration.
3. Restore or validate S3 document content.
4. Restore, rebuild, or reindex search backends.
5. Restore Cognito, SSO, custom authorizer, API key, or IAM access paths.
6. Reconfigure domains, certificates, VPC settings, and integrations if needed.
7. Validate API URLs and console access.
8. Run a full functional smoke test.

## Disaster Recovery Strategies

### Cross-Region Replication

Cross-region recovery is an architecture decision, not a simple backup setting. It should be designed and tested before an incident.

S3 Cross-Region Replication can help with:

- Regional disaster recovery
- Data residency or duplicate-region requirements
- Protection against regional S3 access disruption

Plan for:

- Destination bucket encryption and KMS keys
- Replication of delete markers and noncurrent versions
- Replication monitoring
- Lifecycle policy differences between regions
- Application cutover to the recovery region

### DynamoDB Global Tables

DynamoDB Global Tables may be useful for multi-region architectures, but they should not be treated as a generic backup feature.

Use only after validating:

- FormKiQ table design and write patterns
- Conflict behavior
- Region support
- CloudFormation ownership
- Recovery runbooks
- Cost and operational complexity

For many deployments, PITR, on-demand backups, exports, and tested restore procedures are a better first step than global active-active database replication.

### Backup Strategy Tiers

| Tier | Strategy | Typical use |
| --- | --- | --- |
| Basic | DynamoDB PITR, S3 versioning, CloudFormation exports | Standard operational recovery in one region. |
| Standard | Basic plus on-demand backups, metadata exports, restore testing | Production environments with formal recovery expectations. |
| Enhanced | Standard plus AWS Backup, cross-account or cross-region copies, OpenSearch snapshots | Regulated or higher availability environments. |
| Enterprise | Enhanced plus tested regional recovery architecture | Environments with strict RTO/RPO or region failure requirements. |

## Testing and Validation

Test backup and recovery regularly.

Recommended quarterly checks:

- Restore a DynamoDB table to a new table and validate sample records.
- Recover a sample S3 document version and verify checksum or file integrity.
- Restore a soft-deleted FormKiQ document.
- Validate OpenSearch snapshot or reindex procedure if enhanced search is installed.
- Export and review CloudFormation parameters and outputs.
- Confirm Cognito or SSO recovery documentation is current.
- Run a complete recovery drill in a non-production environment.
- Record actual RTO and RPO from the test.

## Backup Monitoring and Maintenance

Monitor backup posture with AWS-native tools.

Recommended checks:

- DynamoDB PITR remains enabled for required tables.
- S3 bucket versioning remains enabled.
- S3 lifecycle rules do not expire versions earlier than policy allows.
- OpenSearch snapshots complete successfully where configured.
- AWS Backup jobs complete successfully where used.
- Cross-region replication has no growing backlog if enabled.
- CloudFormation template and parameter exports are current.
- Restore tests are completed and documented.

Use AWS Config, EventBridge, CloudWatch, AWS Backup job notifications, or custom checks depending on your governance model.

## Compliance and Retention

Define retention by data type.

| Data type | Retention considerations |
| --- | --- |
| Document content | Business retention, legal hold, object lock, version lifecycle, purge policy. |
| Document metadata | PITR window, on-demand backups, exports, audit requirements. |
| Search indexes | Snapshot retention or reindex strategy. |
| User and access data | Cognito/IdP export, group membership, audit evidence. |
| Logs and activity | CloudWatch retention, CloudTrail, reporting and analytics needs. |
| Backup records | Evidence of backup jobs, restore tests, and recovery approvals. |

For regulated deployments, align backup retention with legal, contractual, and data residency requirements. Also confirm where backup copies, exports, and replicated data are stored.

## Cost Optimization

Backup and recovery choices affect AWS cost.

Cost drivers include:

- S3 current and noncurrent object versions
- S3 replication and cross-region transfer
- DynamoDB PITR, on-demand backups, and exports
- AWS Backup recovery points and cross-account or cross-region copies
- OpenSearch snapshots and restored domains
- CloudWatch and CloudTrail retention

Use lifecycle policies carefully. Lower-cost storage can reduce backup cost, but it can also increase restore time or retrieval cost.

For cost planning, see [Costs & AWS Usage](/docs/platform/costs).

## Additional Considerations

### Multi-Tenant Environment Backups

For multi-site deployments, a single backup plan may still cover shared infrastructure, but recovery decisions can be tenant-specific.

Plan for:

- Which sites are business-critical
- Whether a single site can be repaired without affecting others
- How tenant-specific exports are handled
- Whether tenants have different retention or residency requirements
- How recovery evidence is reported per tenant

For deployment model guidance, see [Multi-Tenant and Multi-Instance Deployments](/docs/platform/multi-tenant-vs-multi-instance).

### Automation and Integration

Use automation where it reduces operational risk:

- Schedule backup verification checks.
- Send backup and restore events to operations channels.
- Include recovery checks in deployment pipelines.
- Export stack configuration before production changes.
- Run document restore tests with controlled sample documents.

## Additional Resources

- [Updates, Upgrades, and Rollbacks](/docs/platform/updates_upgrades_and_rollbacks)
- [Document Storage](/docs/platform/document_storage)
- [Documents](/docs/features/documents)
- [Search](/docs/features/search)
- [Status Monitoring and Alerting](/docs/how-tos/set-up-status-monitoring-and-alerting)
- [AWS DynamoDB Backup and Restore Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/BackupRestore.html)
- [AWS S3 Versioning Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)
- [AWS Backup Service Documentation](https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html)
