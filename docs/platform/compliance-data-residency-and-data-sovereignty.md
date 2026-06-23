---
sidebar_position: 8
title: Compliance, Data Residency, and Data Sovereignty
---

# Compliance, Data Residency, and Data Sovereignty

## Overview

FormKiQ can help organizations design document management deployments that support data residency, data sovereignty, privacy, audit, and governance requirements. Because FormKiQ runs in the customer's AWS account, customers keep control over the AWS region, account structure, network boundaries, encryption settings, identity model, retention approach, and operational monitoring.

This page explains the technical controls and deployment patterns that can support compliance programs. It is not legal advice and should not be read as a certification that a specific FormKiQ deployment satisfies a law, regulation, or industry standard.

For a practical pre-production review, use the [Regulated Production Deployment Checklist](/docs/platform/regulated-production-deployment-checklist) after identifying the relevant residency, sovereignty, and compliance requirements.

## Shared Responsibility

Compliance depends on the way FormKiQ, AWS, and the customer environment are configured together.

| Area | Responsibility |
| --- | --- |
| AWS infrastructure | AWS provides regional infrastructure, physical security, service-level compliance programs, and cloud service controls. |
| FormKiQ platform | FormKiQ provides document APIs, metadata controls, authentication options, authorization models, audit data, encryption support, and deployment patterns that can be configured for regulated environments. |
| Customer configuration | Customers choose AWS regions, accounts, networking, IAM policies, identity providers, retention policies, access models, backup settings, monitoring, incident response, and legal/compliance processes. |
| Legal compliance | Customers remain responsible for determining whether their implementation satisfies specific regulatory, contractual, or jurisdictional requirements. |

## Data Residency

Data residency refers to where data is stored. In FormKiQ, residency is primarily controlled by the AWS region where the stack is deployed and by any optional cross-region architecture the customer chooses to configure.

### Region Selection

FormKiQ can be deployed in AWS regions where the required AWS services are available. The exact services depend on the selected FormKiQ edition and modules, but commonly include Amazon S3, Amazon DynamoDB, Amazon API Gateway, AWS Lambda, Amazon Cognito, Amazon CloudWatch, and optional services such as Amazon OpenSearch Service.

Before deployment, confirm:

- The preferred AWS region meets the organization's data residency requirement.
- Required AWS services are available in that region.
- Optional modules, such as enhanced search or advanced encryption, are supported in that region.
- Backup, log, monitoring, and export destinations remain within approved regions.
- Any external integrations process or store data in approved locations.

For current AWS availability, use [AWS Regions and Service Availability](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/).

### Data Stored by FormKiQ

FormKiQ deployments can store or process several categories of data.

| Data category | Typical storage or processing location |
| --- | --- |
| Document content | Amazon S3 in the deployment region. |
| Document metadata and configuration | Amazon DynamoDB in the deployment region. |
| Search indexes | Amazon OpenSearch Service when enhanced search is installed. |
| User and group data | Amazon Cognito or the configured identity provider. |
| Audit and activity records | FormKiQ tables and logs, depending on configuration. |
| Logs and metrics | Amazon CloudWatch in the deployment region. |
| Backups and exports | Customer-configured AWS backup, export, or replication destinations. |

See [Document Storage](/docs/platform/document_storage) for more detail on storage architecture.

### Multi-Region Deployments

Organizations with regional data boundaries can deploy separate FormKiQ instances in different AWS regions. This pattern is often cleaner than trying to centralize all data in one global deployment.

Multi-region deployments can support:

- Separate regional document repositories
- Region-specific identity and access policies
- Isolation between regulated data sets
- Localized backup and recovery plans
- Region-specific retention and audit requirements

If cross-region access, reporting, replication, or identity federation is required, it should be designed explicitly so data movement and processing locations remain understood.

## Data Sovereignty

Data sovereignty refers to the legal and governance requirements that may apply based on where data is collected, stored, processed, accessed, or transferred.

FormKiQ can support sovereignty requirements through customer-controlled deployment choices:

| Requirement | FormKiQ control or design option |
| --- | --- |
| Keep documents in a specific jurisdiction | Deploy FormKiQ in an AWS region approved for that jurisdiction. |
| Restrict access by region, business unit, or tenant | Use sites, groups, RBAC, folder permissions, and optional ABAC policies. |
| Limit administrative access | Configure IAM, Cognito groups, identity provider rules, and operational roles. |
| Protect document content and metadata | Use AWS encryption controls and optional FormKiQ encryption modules. |
| Prove access and activity | Use FormKiQ activity data, CloudWatch logs, CloudTrail, and reporting exports. |
| Separate regional operations | Use separate AWS accounts, stacks, or regions for regulated environments. |

## Compliance Controls FormKiQ Can Support

FormKiQ provides technical capabilities that customers can combine with their own policies, procedures, and AWS account controls.

| Compliance need | Relevant FormKiQ or AWS capability |
| --- | --- |
| Access control | JWT authentication, IAM authentication, API keys, RBAC, folder permissions, and optional ABAC through OPA. |
| Data classification | Document attributes, schemas, classification workflows, OCR, and metadata tagging. |
| Auditability | Document activity records, API logs, CloudWatch logs, CloudTrail, and reporting exports. |
| Retention planning | Document metadata, entity-based retention models, backup retention planning, S3 lifecycle policies, and customer-defined processes. |
| Encryption | AWS-managed encryption, customer-managed key options, and the Full Encryption module. |
| Backup and recovery | DynamoDB Point-in-Time Recovery, S3 versioning, OpenSearch snapshots, AWS Backup, and customer-defined recovery procedures. |
| Tenant or jurisdiction separation | Separate sites, groups, AWS accounts, stacks, or regional deployments. |
| Search and discovery | Metadata search, full-text search, attributes, and reporting exports. |

Related details are available in [Security](/docs/platform/security), [Reporting, Analytics, and Audit](/docs/platform/reporting-and-analytics), [Backup and Recovery](/docs/platform/backup_and_recovery), [Full Encryption](/docs/formkiq-modules/modules/full-encryption), and [Open Policy Agent](/docs/formkiq-modules/modules/open_policy_agent).

## Regional Privacy and Residency Considerations

The following sections describe common considerations for regional privacy and residency planning. They are not a substitute for legal review.

### European Union

For EU privacy and residency requirements, customers commonly evaluate:

- Deployment in an approved AWS region in or near the European Economic Area
- Whether backups, logs, exports, search indexes, and integrations remain in approved regions
- Data subject request workflows for access, correction, deletion, export, and restriction
- Metadata minimization and document classification practices
- Audit evidence for access, processing, and administrative actions
- Cross-border transfer requirements when users or systems outside the EU access data

### United Kingdom

For UK privacy and residency requirements, customers commonly evaluate:

- Deployment in an approved UK or otherwise acceptable AWS region
- Alignment between UK identity, administrative access, and operational support processes
- Controls for data subject requests
- Auditability of access and processing activities
- Transfer controls for integrations or support activity outside the UK

### Canada

For Canadian privacy and residency requirements, customers commonly evaluate:

- Deployment in an approved Canadian AWS region where required
- Whether provincial, sector-specific, or contractual residency rules apply
- Access restrictions for personal information
- Audit trails for document activity and administrative activity
- Breach response and notification processes owned by the customer
- Retention, deletion, and records management policies

### United States

For US privacy, sector, or state-level requirements, customers commonly evaluate:

- Deployment in an approved US AWS region
- Whether state privacy requirements apply, such as California privacy laws
- Data discovery and classification workflows for personal information
- Access controls that limit use to approved business purposes
- Audit trails for consumer, customer, employee, or regulated records
- Deletion, retention, litigation hold, and records management processes

### Australia

For Australian privacy and residency requirements, customers commonly evaluate:

- Deployment in an approved Australian AWS region where required
- Access controls for personal information
- Audit evidence for access and processing activities
- Collection limitation and metadata minimization practices
- Retention and disposal processes aligned to customer policy

### Healthcare and Regulated Data

Healthcare, financial services, public sector, and other regulated deployments may require additional contractual, operational, and technical controls. For example, HIPAA-oriented deployments may require review of AWS eligible services, business associate agreements, access logging, encryption, backup retention, incident response, and customer operating procedures.

Do not assume a deployment is compliant because it uses AWS or FormKiQ. The customer must validate the complete architecture, contracts, procedures, and evidence requirements for the applicable regulation.

## Deployment Patterns

### Single-Region Deployment

A single-region deployment is usually the simplest pattern when all users and documents can be governed under one jurisdictional or organizational policy.

Use this pattern when:

- One AWS region satisfies the residency requirement.
- Users can access the same regional deployment.
- Backup, monitoring, and export destinations are approved for that region.
- Operational processes are centralized.

### Multi-Region Isolated Deployment

A multi-region isolated deployment uses separate FormKiQ stacks for different jurisdictions or business units.

Use this pattern when:

- Different regions require separate data boundaries.
- Regional teams need different retention, access, or audit policies.
- Cross-region data movement must be minimized.
- Each jurisdiction needs its own recovery and monitoring plan.

### Multi-Account Deployment

A multi-account deployment separates environments by AWS account. This can be combined with single-region or multi-region patterns.

Use this pattern when:

- Production, staging, and development require strict isolation.
- Regulated data should be separated from general business workloads.
- Different business units or customers require separate AWS account boundaries.
- IAM, billing, logging, or incident response should be managed separately.

## Compliance Planning Checklist

Use this checklist before deploying FormKiQ for a regulated or residency-sensitive workload.

- Confirm the required AWS region and service availability.
- Identify all data categories that will be stored, indexed, logged, exported, or backed up.
- Decide whether one FormKiQ stack is sufficient or whether regional/account isolation is required.
- Define which users, groups, roles, and systems can access each site.
- Decide whether RBAC is sufficient or ABAC/OPA is needed for metadata-based access.
- Define document classification and metadata standards.
- Confirm encryption requirements, including whether customer-managed keys are required.
- Define backup retention, recovery objectives, and export locations.
- Confirm CloudWatch, CloudTrail, audit, and reporting requirements.
- Review whether external integrations move data outside approved regions.
- Document data subject request, deletion, retention, legal hold, and incident response processes.
- Validate legal, contractual, and compliance obligations with the appropriate internal or external advisors.

## AWS Compliance Programs

AWS maintains compliance programs, certifications, and attestations for many services and regions. These AWS programs can be relevant to a FormKiQ deployment because FormKiQ runs on AWS services in the customer's account.

Customers should confirm:

- Which AWS compliance programs apply to the selected services and regions
- Whether the customer's selected AWS account, region, and services are in scope
- Whether additional contracts, agreements, or internal controls are required
- Whether optional FormKiQ modules or customer integrations introduce additional requirements

Use the current [AWS Compliance Programs](https://aws.amazon.com/compliance/programs/) documentation as the source of truth for AWS attestations and regional service scope.

## Additional Compliance Resources

- [Security](/docs/platform/security)
- [Regulated Production Deployment Checklist](/docs/platform/regulated-production-deployment-checklist)
- [Reporting, Analytics, and Audit](/docs/platform/reporting-and-analytics)
- [Backup and Recovery](/docs/platform/backup_and_recovery)
- [Document Storage](/docs/platform/document_storage)
- [Multi-Tenant vs Multi-Instance](/docs/platform/multi-tenant-vs-multi-instance)
- [Full Encryption](/docs/formkiq-modules/modules/full-encryption)
- [Open Policy Agent](/docs/formkiq-modules/modules/open_policy_agent)
- [AWS Compliance Programs](https://aws.amazon.com/compliance/programs/)
- [AWS Regions and Service Availability](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/)
