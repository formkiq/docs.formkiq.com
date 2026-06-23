---
sidebar_position: 2
slug: /category/choosing-formkiq
---

# Choosing FormKiQ

FormKiQ is an AWS-native, API-first document management platform for organizations that need more control and flexibility than typical hosted document management tools provide.

It is designed for teams that want to store, manage, search, classify, process, and automate documents in their own AWS account while keeping the option to embed document capabilities into existing business applications.

## When FormKiQ Is a Strong Fit

FormKiQ is a strong fit when your organization needs:

- Document management deployed in your own AWS account
- API-first integration with existing products, portals, or internal systems
- Flexible metadata, search, classification, and workflow automation
- Stronger control over security, architecture, data residency, and operations
- A modern alternative to rigid ECM platforms or manual document processes
- A faster path than building document infrastructure from scratch
- A growth path from open-source evaluation to supported commercial deployment

## Why Teams Choose FormKiQ

### Control Without Starting From Zero

FormKiQ gives IT and engineering teams a prebuilt document platform while preserving control over AWS infrastructure, data, security posture, and integration design.

### API-First Document Infrastructure

FormKiQ is not only a document repository. It is a document layer that can be integrated into applications, workflows, portals, and business systems through APIs and SDKs.

### AWS-Native Architecture

FormKiQ runs on AWS managed services and serverless architecture, helping teams align document management with existing AWS operations, scaling, and governance practices.

### Flexible Adoption Path

Teams can start with FormKiQ Core, validate fit with a proof of value, or deploy a commercial edition with onboarding, support, modules, and enterprise guidance.

### Automation Across the Document Lifecycle

FormKiQ supports document storage, metadata, search, workflows, rules, OCR, AI-assisted processing, document generation, and governance-oriented controls.

## Best-Fit Buyers

FormKiQ is especially relevant for:

- IT and infrastructure leaders responsible for modernization, security, and cloud architecture
- Engineering teams embedding document capabilities into software products
- Operations teams managing document-heavy workflows
- Compliance-conscious organizations that need traceability and controlled processes
- Organizations replacing legacy ECM systems, shared drives, or manual document handling
- AWS-centric teams that value deployment control and extensibility

## When FormKiQ May Not Be the Best Fit

FormKiQ may not be the right fit if you only need basic file sharing, commodity storage, or a fully vendor-hosted SaaS product with minimal technical ownership.

It is best suited for organizations where document management is operationally important and where APIs, automation, governance, metadata, migration, or architectural control matter.

## FormKiQ vs Building Directly on AWS

AWS provides strong building blocks for document systems, including Amazon S3, DynamoDB, Lambda, API Gateway, Cognito, Textract, OpenSearch, EventBridge, SQS, SNS, CloudWatch, and CloudTrail. These services can support a custom document platform, but they do not define the document model, API contract, access-control model, metadata strategy, workflow layer, audit model, migration approach, or operating process.

FormKiQ is designed for teams that want the benefits of AWS-native deployment without owning every layer of document platform development from scratch.

| Evaluation area | Building directly on AWS | Using FormKiQ |
| --- | --- | --- |
| Initial prototype | Fast for simple upload, storage, and retrieval. | Fast when you need document APIs, console access, metadata, and search early. |
| Production scope | Requires custom design across storage, API, authentication, authorization, metadata, search, events, monitoring, backup, and recovery. | Provides a prebuilt document platform deployed into your AWS account. |
| Governance | Access rules, audit history, retention behavior, and review controls must be designed and maintained across services and application code. | Provides sites, groups, permissions, folder controls, attributes, activity records, and optional ABAC through Open Policy Agent. |
| Search and metadata | Requires schema design, indexing strategy, query APIs, reindexing processes, and result-level permission checks. | Provides tags, attributes, schemas, metadata search, full-text search, and enhanced search module options. |
| OCR and AI processing | Requires orchestration, retries, result storage, confidence handling, human review, audit trails, and cost monitoring. | Supports OCR, document actions, workflows, and commercial OCR/IDP or AI processing modules depending on edition. |
| Migration | Requires custom extraction, mapping, import, validation, reconciliation, and cutover tooling. | Provides APIs, CLI workflows, CSV import patterns, deep links, and migration guidance. |
| Operations | Your team owns alerts, failed jobs, retries, upgrades, security review, support, and long-term maintenance. | Provides AWS-native operating patterns, documentation, and commercial support options for supported editions. |

Building directly on AWS may be a good fit when the use case is narrow, document requirements are simple, and your team is prepared to own the system long term. FormKiQ is usually a stronger fit when documents are operationally important and the system needs APIs, metadata, workflow, search, OCR, permissions, auditability, migration support, or governance controls in production.

AI-assisted development can speed up custom implementation, but it does not remove the need for architecture, security review, access-control testing, audit design, failed-job handling, migration validation, or production support. For regulated or control-sensitive document operations, the harder problem is not generating code. The harder problem is maintaining a governed document system over time.

## Where To Go Next

- [Quick Start (AWS)](/docs/getting-started/quick-start)
- [Platform Overview](/docs/platform/overview)
- [Costs](/docs/platform/costs)
- [Security](/docs/platform/security)
- [Regulated Production Deployment Checklist](/docs/platform/regulated-production-deployment-checklist)
- [Migration and Data Import](/docs/platform/migration-and-data-import)
- [API Walkthrough](/docs/getting-started/api-walkthrough)
