---
sidebar_position: 9
title: Regulated Production Deployment Checklist
---

# Regulated Production Deployment Checklist

Use this checklist before moving a regulated, residency-sensitive, or governance-heavy FormKiQ workload into production.

FormKiQ runs in your AWS account, so production readiness depends on the FormKiQ configuration, the AWS account controls around it, and the operational procedures your organization owns. This page is not legal advice and does not certify compliance with any specific law, regulation, or industry standard.

## Deployment Scope

Confirm the production scope before configuring controls.

- Identify the business process or application FormKiQ will support.
- Identify whether the deployment is for one department, multiple departments, customers, regions, or business units.
- Confirm the FormKiQ edition and modules required for production.
- Confirm whether the deployment is customer-managed, vendor-managed, or hybrid.
- Define production, staging, development, and test environment boundaries.
- Decide whether separate AWS accounts, regions, or FormKiQ stacks are required.
- Document the production owner, technical owner, security owner, and support contacts.

## AWS Account and Region

Confirm the AWS environment supports the required residency, security, and operational model.

- Select the AWS region based on data residency, latency, service availability, and internal policy.
- Confirm required AWS services are available in the selected region.
- Confirm optional services and modules, such as Amazon OpenSearch Service or Amazon Textract, are available in the selected region.
- Use separate AWS accounts for production and non-production when isolation is required.
- Confirm CloudFormation deployment permissions and IAM role boundaries.
- Confirm AWS service quotas for Lambda, DynamoDB, API Gateway, OpenSearch, and other high-volume services.
- Confirm tagging standards for cost allocation, ownership, environment, and data classification.
- Confirm AWS Organizations, SCPs, networking, and logging controls do not block required FormKiQ resources.

## Identity and Access

Define who can authenticate, which systems can call the API, and how permissions are managed.

- Decide which authentication methods are allowed in production: JWT, AWS IAM, API keys, SSO, or custom JWT authorizers.
- Configure the production identity provider and SSO requirements where applicable.
- Confirm administrator accounts are limited and reviewed.
- Define user groups, service roles, and integration identities.
- Use IAM roles for AWS-hosted integrations where possible instead of long-lived access keys.
- Define API key ownership, rotation, expiration, and revocation procedures if API keys are used.
- Confirm the process for provisioning, changing, and removing users.
- Confirm break-glass access and emergency access procedures.

## Document Permissions

Define document access boundaries before production content is migrated or uploaded.

- Decide whether site-level RBAC is sufficient or whether folder permissions are required.
- Decide whether metadata-driven ABAC through Open Policy Agent is required.
- Define standard sites, groups, roles, and permission levels.
- Define folder permission patterns for sensitive repositories.
- Define document attributes used for access decisions, such as department, owner, region, document type, confidentiality, or project.
- Test permission behavior with representative users before go-live.
- Test negative cases, such as users who should not see sensitive documents.
- Confirm administrative access is logged and periodically reviewed.

## Metadata and Classification

Define metadata standards that support search, automation, governance, and reporting.

- Identify required document types and classifications.
- Define required attributes, allowed values, and validation rules.
- Decide where tags are sufficient and where typed attributes are required.
- Define naming conventions for paths, sites, attributes, schemas, and document types.
- Confirm metadata needed for retention, legal hold, data subject requests, and audit reporting.
- Confirm metadata needed for workflow routing, search, AI processing, and integrations.
- Test metadata search and full-text search with representative documents.
- Define who can create or change metadata schemas in production.

## Encryption and Key Management

Confirm encryption expectations for documents, metadata, logs, indexes, backups, and integrations.

- Confirm encryption in transit through HTTPS/TLS endpoints.
- Confirm encryption at rest for Amazon S3, DynamoDB, CloudWatch, and search indexes.
- Decide whether AWS-managed keys are sufficient or customer-managed KMS keys are required.
- Define KMS key administrators, key users, rotation policy, and deletion protection.
- Confirm encryption requirements for backup, export, replication, and migration locations.
- Confirm custom domain, certificate, and DNS requirements.
- Confirm any private networking, VPC endpoint, or restricted network access requirements.

## Data Residency and Sovereignty

Confirm where data is stored, processed, indexed, logged, backed up, and exported.

- Confirm the production AWS region satisfies residency requirements.
- Confirm logs, backups, exports, search indexes, and derived files remain in approved regions.
- Confirm OCR, AI, search, malware scanning, and other processing occurs in approved regions.
- Confirm external integrations do not move data to unapproved locations.
- Decide whether regional isolation requires separate stacks, accounts, or regions.
- Document who can access data from outside the target region or jurisdiction.
- Confirm support access procedures align with contractual, regulatory, and internal requirements.

## Audit and Activity Logging

Confirm the organization can reconstruct important document and administrative activity.

- Confirm FormKiQ activity records are available for document and user activity.
- Confirm AWS CloudTrail is enabled for the production account and region.
- Confirm CloudWatch log retention periods.
- Confirm audit data export or reporting requirements.
- Confirm access to audit reports is restricted to appropriate roles.
- Confirm activity needed for legal, compliance, security, and operational investigations.
- Test at least one audit scenario, such as document upload, metadata change, access, workflow decision, or deletion.
- Define audit retention and review procedures.

## Backup and Recovery

Confirm recovery objectives and recovery procedures before go-live.

- Define recovery point objective (RPO) and recovery time objective (RTO).
- Confirm DynamoDB Point-in-Time Recovery expectations.
- Confirm Amazon S3 versioning, lifecycle, replication, or backup requirements.
- Confirm OpenSearch snapshot requirements if enhanced search is used.
- Define backup retention periods and approved backup locations.
- Test restore procedures for representative document metadata and content.
- Define recovery procedures for accidental deletion, failed migration, failed deployment, and service disruption.
- Confirm who approves recovery actions in production.

## Retention, Legal Hold, and Deletion

Confirm records and lifecycle behavior before storing regulated production documents.

- Define retention categories and rules for each production document type.
- Define legal hold roles and approval procedures.
- Confirm how document versions, derived files, OCR output, full-text indexes, and metadata follow retention expectations.
- Define soft delete, permanent delete, purge, and restore procedures.
- Confirm whether deletion requests require workflow approval or audit review.
- Confirm how data subject requests, records disposition, and litigation holds are handled.
- Test legal hold and deletion behavior with non-production sample documents.

## Monitoring and Alerting

Confirm production monitoring detects user-impacting and compliance-impacting issues.

- Monitor API availability and response errors.
- Monitor Lambda errors, throttles, duration, and concurrency.
- Monitor DynamoDB throttling, table capacity, backup status, and point-in-time recovery status.
- Monitor S3 errors, replication status, storage growth, and lifecycle behavior where applicable.
- Monitor queue depth, dead-letter queues, failed actions, and stuck workflows.
- Monitor OpenSearch health, storage, indexing, and query behavior if enabled.
- Monitor CloudWatch log volume and cost drivers.
- Define alert routing, escalation paths, and response expectations.

## Migration and Validation

Confirm production content can be migrated, validated, reconciled, and supported after cutover.

- Inventory source repositories, document counts, file sizes, versions, metadata fields, permissions, and retention rules.
- Map source fields to FormKiQ sites, paths, attributes, tags, schemas, and classifications.
- Decide whether content is copied into FormKiQ-managed storage or referenced through external links.
- Run a pilot migration with representative documents and metadata.
- Validate counts, checksums, metadata accuracy, permissions, search behavior, and workflow triggers.
- Define retry, rollback, and re-run procedures.
- Define final delta migration and cutover plan.
- Preserve source-to-FormKiQ document ID mappings for support and reconciliation.

## Cost and Capacity

Confirm expected AWS usage and high-volume scenarios before production rollout.

- Estimate document storage, average file size, document growth, and retention impact.
- Estimate API requests, document views, downloads, and data transfer.
- Estimate OCR, Textract, AI processing, malware scanning, and indexing volume.
- Estimate OpenSearch or Typesense costs if full-text search is enabled.
- Estimate migration burst costs separately from steady-state costs.
- Configure AWS budgets, cost allocation tags, and alert thresholds.
- Confirm service quotas support expected ingestion, search, processing, and migration volume.

## Operational Support

Confirm how the system will be operated after go-live.

- Define first-line, second-line, and vendor support responsibilities.
- Document runbooks for authentication failures, API errors, failed processing, search issues, and failed workflows.
- Define incident response expectations and escalation contacts.
- Define update, upgrade, rollback, and change-management procedures.
- Define maintenance windows and release communication expectations.
- Confirm who reviews security updates, product releases, AWS changes, and cost trends.
- Confirm where support tickets, operational notes, and architecture decisions are tracked.

## Go-Live Readiness

Use this final review before enabling production users or integrations.

- Production deployment completed in the approved AWS account and region.
- Security, residency, backup, monitoring, and support controls reviewed.
- Representative users and service integrations tested.
- Required metadata, permissions, workflows, and search patterns validated.
- Migration pilot completed and reconciled.
- Audit and activity reporting tested.
- Backup and recovery plan documented.
- Cost and quota review completed.
- Operational support plan approved.
- Legal, compliance, security, and business stakeholders have signed off according to internal process.

## Related Resources

- [Security](/docs/platform/security)
- [Compliance, Data Residency, and Data Sovereignty](/docs/platform/compliance-data-residency-and-data-sovereignty)
- [Multi-Tenant and Multi-Instance Deployments](/docs/platform/multi-tenant-vs-multi-instance)
- [Backup and Recovery](/docs/platform/backup_and_recovery)
- [Migration and Data Import](/docs/platform/migration-and-data-import)
- [AWS Cost Planning](/docs/platform/costs)
- [Status Monitoring and Alerting](/docs/how-tos/set-up-status-monitoring-and-alerting)
