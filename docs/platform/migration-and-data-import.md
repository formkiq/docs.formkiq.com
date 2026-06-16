---
sidebar_position: 8
---

# Migration and Data Import

## Overview

FormKiQ supports several migration patterns for moving documents, metadata, attributes, and external references from existing systems into a FormKiQ deployment. The right approach depends on the source system, document volume, metadata complexity, cutover window, and whether content should be copied into FormKiQ-managed storage or referenced from an existing location.

Most production migrations follow the same pattern:

1. Inventory the source repository.
2. Map source fields to FormKiQ documents, paths, attributes, tags, schemas, and sites.
3. Run a small pilot migration.
4. Perform bulk import in repeatable batches.
5. Validate counts, content, metadata, and search behavior.
6. Run a final delta migration and cut over users or applications.

:::tip
For large migrations, treat the migration process as an operational project, not only a data transfer. Plan for retries, validation, rollback, cost monitoring, and source-to-target reconciliation before the first production import.
:::

## Choose a Migration Method

| Migration method | Best for | Main advantages | Watch for |
| --- | --- | --- | --- |
| API-based migration | Custom source systems, complex transformations, application-led imports, incremental synchronization | Maximum control over mapping, validation, retries, and business logic | Requires custom scripting and careful retry/idempotency design |
| FormKiQ CLI and CSV import | Structured bulk imports where documents, content locations, and attributes can be prepared as CSV files | Repeatable, batch-oriented, and easier to validate before import | Available for supported commercial installations; CSV quality matters |
| FormKiQ CLI sync | Local folders or S3 locations that should be synchronized into FormKiQ | Good for file-system style migrations and ongoing sync scenarios | Metadata enrichment may require pre-hook or post-hook logic |
| FKB64 staging bucket import | Smaller documents, generated bundles, and staging-bucket based import workflows | Combines content and metadata into one import object | Base64 adds size overhead and requires strict file structure validation |
| S3 deep links | Content that should remain in an existing S3 location | Avoids copying large content sets into FormKiQ storage | External object permissions, lifecycle, and retention stay outside FormKiQ-managed storage |
| Stack-to-stack migration | Moving data between FormKiQ installations | Useful for environment moves or recovery workflows | Requires DynamoDB and S3 coordination; validate target stack compatibility |

## Before You Migrate

Complete a planning pass before writing migration scripts or preparing import files.

| Planning area | Questions to answer |
| --- | --- |
| Source inventory | How many documents exist, how large are they, what file types are present, and how many versions need to move? |
| Metadata | Which fields should become FormKiQ attributes, tags, paths, classifications, or external references? |
| Tenancy | Should documents import into the default site, defined sites, customer sites, departments, or separate FormKiQ instances? |
| Permissions | Which users, groups, folder permissions, or access-control rules must exist before import? |
| Validation | What source-of-truth counts, checksums, sample sets, and reports will prove that the migration succeeded? |
| Processing | Should OCR, full-text indexing, rulesets, workflows, or AI processing run during import or after cutover? |
| Cutover | Will there be a read-only freeze, a final delta load, or a period where source and target run in parallel? |
| Recovery | What backups, exports, rollback steps, and re-run strategy are available if a batch fails? |

## Map Source Data to FormKiQ

Define the target data model before importing content.

| Source concept | FormKiQ target |
| --- | --- |
| File or object | Document |
| Folder path | Document path |
| Repository, customer, department, or workspace | Site or separate FormKiQ deployment |
| Source metadata field | Attribute definition and document attribute |
| Keyword or label | Tag or attribute, depending on search and governance needs |
| Document type | Classification or schema |
| External object URL | Deep link |
| Source record ID | Attribute, tag, or migration tracking table |
| Version history | Document versions, if version retention is required |

Use [Attributes](/docs/features/attributes), [Schemas](/docs/features/schemas), and [Multi-Tenant and Multi-Instance Deployments](/docs/platform/multi-tenant-vs-multi-instance) to model the target repository before importing production data.

## API-Based Migration

API-based migration is the best option when the source repository requires custom extraction, transformation, validation, or incremental synchronization. It is also the best path when an application already owns the migration workflow.

Typical API migration flow:

1. Extract source document metadata and content references.
2. Normalize paths, content types, dates, identifiers, and metadata values.
3. Create or update FormKiQ attribute definitions and schemas.
4. Create documents or upload document content through the API.
5. Add attributes, tags, actions, or classifications.
6. Record the source ID and FormKiQ `documentId` in a migration tracking table.
7. Validate the imported document and move to the next batch.

Common API operations:

| Operation | Use |
| --- | --- |
| [POST /documents](/docs/api-reference/add-document) | Create document records, including inline content or external references. |
| [POST /documents/upload](/docs/api-reference/add-document-upload) | Create a presigned upload flow for larger files. |
| [POST /documents/&lt;documentId&gt;/attributes](/docs/api-reference/add-document-attributes) | Add structured metadata to imported documents. |
| [POST /documents/&lt;documentId&gt;/tags](/docs/api-reference/add-document-tags) | Add searchable labels or lightweight grouping values. |
| [POST /documents/&lt;documentId&gt;/reindex](/docs/api-reference/add-reindex-document) | Reindex documents after content or metadata changes. |

For SDK examples, see [Python SDK](/docs/tutorials/using-python-client-sdk) and [TypeScript SDK](/docs/tutorials/using-typescript-client-sdk).

### API Migration Design

Design API migration jobs to be idempotent. If a batch is retried, the script should avoid creating duplicate documents or conflicting metadata.

Recommended practices:

- Store a source ID to FormKiQ `documentId` mapping.
- Use deterministic paths or migration tracking attributes where possible.
- Validate metadata types before calling the API.
- Retry transient failures with exponential backoff.
- Log failed source records with enough detail to replay them.
- Use presigned upload flows for large files instead of loading files into memory.
- Separate extraction, transformation, upload, and validation so each stage can be rerun.

## FormKiQ CLI and CSV Import

The [FormKiQ CLI](/docs/formkiq-modules/modules/formkiq-cli) is useful when migration data can be prepared as CSV files or when files can be synchronized from a local directory or S3 location.

The CSV import flow can load:

- Attribute definitions
- Document records
- Document content locations
- Document attributes

Recommended CSV import order:

1. Import attributes.
2. Import documents.
3. Import document attributes.
4. Import document content.
5. Run verification.

For the step-by-step CSV workflow, see [Import CSV Data Migration](/docs/tutorials/fk-cli-import-csv-data-migration).

### FormKiQ CLI Hooks

For folder or S3 synchronization, pre-hook and post-hook logic can enrich or validate documents during migration.

Use a pre-hook when metadata needs to be derived before import, such as:

- Looking up a source system record by filename.
- Adding tags based on folder path.
- Attaching metadata from a nearby JSON or CSV file.
- Selecting actions to run after upload.

Use a post-hook when downstream validation or reporting should happen after a document is imported.

For hook details, see [Pre-Hook Option](/docs/tutorials/formkiq-cli/pre-hook).

## FKB64 Staging Bucket Import

FKB64 is a FormKiQ Base64 bundle format that combines document content and metadata into a single encoded import file. It is most useful when another process generates FormKiQ-ready import objects and uploads them to the FormKiQ staging bucket.

Use FKB64 when:

- The import producer can generate strict FormKiQ bundle files.
- Documents are small enough that Base64 overhead is acceptable.
- Content and metadata should travel together.
- A staging bucket workflow is easier than direct API calls.

Avoid FKB64 for very large documents unless the size overhead and processing behavior have been tested. For larger documents, API upload or FormKiQ CLI content import is usually easier to operate and monitor.

More information is available in the [FKB64 File Specification](/docs/platform/document_storage#fkb64-file-specification).

## S3 Deep Links

Some migrations should register documents in FormKiQ while leaving content in an existing S3 bucket. This can reduce migration time and storage duplication when the source S3 location will continue to be governed outside of FormKiQ.

Use deep links when:

- The source bucket already has the required retention, encryption, and access controls.
- Copying content into FormKiQ-managed storage is not required.
- Applications need FormKiQ metadata, search, workflow, or governance around externally stored content.

Review [Document Storage](/docs/platform/document_storage#s3-deep-links) before choosing this pattern. Deep-linked content depends on the external storage location remaining available and properly secured.

## Stack-to-Stack Migration

When moving documents between FormKiQ environments, use the FormKiQ CLI and AWS CLI workflows designed for FormKiQ-to-FormKiQ data movement.

Common scenarios include:

- Moving from a test environment to a production environment.
- Rehydrating a replacement stack from restored data.
- Copying a subset of documents between isolated deployments.
- Supporting recovery or rollback plans.

For the existing walkthrough, see [DynamoDB Data Migration](/docs/tutorials/dynamodb-data-migration). Also review [Backup and Recovery](/docs/platform/backup_and_recovery) before moving production data.

## Validation and Reconciliation

Build validation into every migration stage. A migration is not complete because files uploaded successfully; it is complete when the target repository can be trusted by users and downstream systems.

Recommended validation checks:

| Check | What to verify |
| --- | --- |
| Document count | Source document count matches FormKiQ import count for the migrated scope. |
| Content integrity | Sampled or full-set checksums, file sizes, and content types match the source. |
| Metadata | Required attributes, tags, classifications, and schemas are present and correctly typed. |
| Paths | Documents appear in the expected virtual paths and site boundaries. |
| Search | Expected documents are returned by full-text and attribute searches. |
| Processing | OCR, full-text, rulesets, workflows, and actions have completed where expected. |
| Failures | Dead-letter queues, import logs, CloudWatch logs, and CLI verification output are reviewed. |
| User access | Representative users can access only the expected documents. |

For failed asynchronous processing, review [Dead-Letter Queue](/docs/platform/error_handling/dlq).

## Performance and Scaling

Large imports can stress the source system, migration host, network path, FormKiQ APIs, DynamoDB, S3, OpenSearch, and downstream processing services.

Performance recommendations:

- Run migration jobs in the same AWS Region as the FormKiQ deployment when possible.
- Use EC2 for large migrations instead of a local workstation or AWS CloudShell.
- Start with a small pilot batch and increase concurrency gradually.
- Monitor API errors, throttling, Lambda errors, SQS depth, and OpenSearch indexing behavior.
- Use presigned S3 upload or FormKiQ CLI content import for large binary files.
- Avoid running expensive actions on every document during the first bulk load unless they are required for cutover.
- Reindex or run OCR after the content load if that gives better control over cost and throughput.
- Keep migration batches small enough that a failed batch can be replayed without manual cleanup.

For service-level scaling considerations, see [Scaling FormKiQ Components](/docs/platform/overview#scaling-formkiq-components).

## Security and Compliance

Migration jobs often handle the same sensitive documents and metadata as the production repository. Apply production security controls to migration infrastructure.

Security checklist:

- Use least-privilege IAM roles for migration workers.
- Confirm the target AWS Region satisfies data residency requirements.
- Encrypt temporary files, staging buckets, and intermediate exports.
- Avoid writing sensitive document content or metadata values into logs.
- Restrict access to source exports, CSV files, and migration tracking tables.
- Clean up temporary buckets, local files, access keys, and staging data after validation.
- Confirm whether OCR, AI processing, or external integrations are allowed for the migrated dataset.

For broader guidance, see [Security](/docs/platform/security) and [Compliance, Data Residency, and Data Sovereignty](/docs/platform/compliance-data-residency-and-data-sovereignty).

## Cutover and Rollback

Plan cutover before the production import begins.

Recommended cutover approach:

1. Run a pilot migration in a non-production environment.
2. Run a larger dry run in the production-like target.
3. Freeze or limit writes in the source system.
4. Run the final bulk or delta import.
5. Validate source-to-target counts and representative user workflows.
6. Switch users or applications to FormKiQ.
7. Keep the source system read-only until the rollback window closes.

Rollback options depend on the migration method and how much the target system was used after cutover. For high-risk migrations, import into a new site or isolated environment first so the migration can be discarded without affecting existing production documents.

Review [Backup and Recovery](/docs/platform/backup_and_recovery) and [Updates, Upgrades, and Rollbacks](/docs/platform/updates_upgrades_and_rollbacks) when planning production rollback procedures.

## Where to Go Next

- [FormKiQ API Reference](/docs/category/formkiq-api)
- [FormKiQ CLI](/docs/formkiq-modules/modules/formkiq-cli)
- [Import CSV Data Migration](/docs/tutorials/fk-cli-import-csv-data-migration)
- [DynamoDB Data Migration](/docs/tutorials/dynamodb-data-migration)
- [Document Storage](/docs/platform/document_storage)
- [DynamoDB Schema](/docs/platform/database_schema)
- [Attributes](/docs/features/attributes)
- [Schemas](/docs/features/schemas)
- [Search](/docs/features/search)
- [AWS S3 Migration Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/migration.html)
