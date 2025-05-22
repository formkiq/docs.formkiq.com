---
sidebar_position: 8
---

# Migration and Data Import

## Overview

FormKiQ provides multiple pathways for migrating documents and metadata from existing systems into your FormKiQ environment. Whether you're moving from legacy document management systems, cloud storage platforms, or file servers, FormKiQ's flexible architecture supports various migration strategies to ensure smooth data transitions with minimal disruption to your operations.

:::note
FormKiQ's migration capabilities are designed to preserve document integrity, maintain metadata relationships, and support both bulk and incremental migration scenarios across different source systems.
:::

## Migration Methods Overview

FormKiQ supports three primary migration approaches, each optimized for different scenarios and data volumes:

### 1. API-Based Migration Scripts
The most common and flexible approach, using custom scripts that leverage FormKiQ's REST API to transfer documents and metadata. This method provides maximum control over the migration process and supports complex data transformations.

### 2. CLI-Based S3 Import
Utilizes the FormKiQ CLI to migrate documents directly from existing S3 buckets, with webhook support for metadata enhancement during the import process. Ideal for AWS-native environments, though using one or both of the pre-hook and post-hook features may not be as intuitive as a combined migration script.

### 3. FKB64 Bundle Format
A specialized approach using Base64-encoded bundle files that combine document content and metadata into single files. Best suited for smaller documents and batch processing scenarios.

## API-Based Migration Scripts

### Planning Your API Migration

Before implementing API-based migration scripts, consider these key factors:

1. **Source System Analysis**:
   - Document volume and size distribution
   - Metadata schema and field mappings
   - Access permissions and security requirements
   - Content type diversity and special handling needs

2. **Migration Strategy**:
   - Batch size optimization for API throughput; while FormKiQ can scale horizontally to meet requirements, the source system may have limitations, and some AWS services such as OpenSearch will have throughput limits based on configuration.
   - Error handling and retry mechanisms; FormKiQ provides a DLQ for documents that were not imported successfully, but this will not have visibility into your source systems.
   - Progress tracking and resumption capabilities
   - Validation and quality assurance processes; while FormKiQ has functionality for data validation, adding some validation in the script itself may be more efficient and cost effective 

### Implementation Architecture

A typical API-based migration follows this pattern:

1. **Extract**: Retrieve documents and metadata from source systems
2. **Transform**: Map metadata fields and apply FormKiQ classifications
3. **Load**: Upload documents via FormKiQ API with enriched metadata
4. **Validate**: Verify successful migration and data integrity

### Migration Script Structure

API-based migration scripts typically follow a pattern of extracting documents and metadata from source systems, transforming the data to match FormKiQ's schema, and then uploading through the REST API. The scripts should include proper error handling, retry logic, and progress tracking capabilities.

### Advanced API Migration Features

#### Metadata Mapping and Classification

FormKiQ's classification system allows for sophisticated metadata organization during migration. Migration scripts can apply classifications based on document characteristics, content type, file naming conventions, or source system metadata to automatically organize documents during the import process.

#### Batch Processing with Error Handling

Effective migration scripts often implement batch processing capabilities with comprehensive error handling, including retry mechanisms, progress tracking, and the ability to resume from interruption points. This ensures reliable migration of large document volumes while maintaining detailed logs of the process.

### Performance Optimization

For large-scale migrations, implement these optimization strategies:

1. **Parallel Processing**:
   - Use threading or async processing for concurrent uploads
   - Monitor source API rate limits, AWS account limits, and service capacity (e.g., OpenSearch) and adjust concurrency accordingly
   - Implement exponential backoff for rate limit responses

2. **Memory Management**:
   - Stream large files instead of loading entirely into memory
   - Process large documents in chunks for memory-efficient operations
   - Clean up temporary files and variables regularly

3. **Progress Tracking**:
   - Maintain migration state in a file or datastore
   - Enable resumption from interruption points

## CLI-Based S3 Import

### FormKiQ CLI Installation and Setup

The FormKiQ CLI provides powerful tools for migrating documents from existing S3 buckets. Install the CLI using npm and configure it with your FormKiQ environment credentials and endpoints.

### Webhook Integration for Metadata Enhancement

FormKiQ CLI supports pre-hook and post-hook webhooks for advanced metadata processing during migration:

#### Pre-Hook and Post-Hook Configuration

Pre-hook scripts allow for metadata to be retrieved and organized before document import, enabling metadata to be included with the document object. More info can be found in this tutorial: [Pre-Hook Option Tutorial](/docs/tutorials/FileSync%20CLI/Pre-Hook)

#### Post-Hook Processing

Post-hook scripts enable validation and additional processing after document import. They can verify successful imports, trigger additional document processing workflows, update external systems, and log migration results for audit purposes.

## FKB64 Bundle Format Migration

### Understanding FKB64 Format

The FKB64 (FormKiQ Base64) format combines document content and metadata into a single Base64-encoded file, optimized for batch processing and staging bucket operations.

### FKB64 File Structure

The FKB64 format encodes both document content and metadata in a single Base64-encoded JSON structure. The format includes sections for document content (Base64-encoded), content type, filename, and comprehensive metadata including path, attributes, and tags.

### Creating FKB64 Files

FKB64 files can be created programmatically by reading document content, encoding it as Base64, combining it with structured metadata, and then encoding the entire JSON structure as Base64. This process involves careful handling of file types, metadata mapping, and proper encoding to ensure compatibility with FormKiQ's processing pipeline.

### Batch FKB64 Creation

For large-scale migrations, batch creation processes can automate FKB64 file generation from directories of documents with corresponding metadata mappings. This approach requires systematic metadata organization and validation processes to ensure consistency across the migration batch.

### Staging Bucket Deployment

Once FKB64 files are created, they can be uploaded to FormKiQ's staging bucket using AWS CLI or SDK tools. The staging bucket processes FKB64 files automatically, extracting and importing both content and metadata according to the encoded specifications.

### FKB64 Validation and Monitoring

Before deployment, FKB64 files should be validated for proper structure, valid Base64 encoding, and complete metadata. Monitoring tools can track the processing status of uploaded FKB64 files and report on successful imports or errors that require attention.

:::note
FormKiQ's migration capabilities continue to evolve. For the latest migration tools, API enhancements, and best practices, consult the FormKiQ documentation and support resources regularly.
:::

## Additional Resources

- [FormKiQ API Documentation](/docs/category/formkiq-api)
- [FormKiQ CLI Documentation](/docs/platform/cli)
- [Document Storage Architecture](/docs/platform/document_storage)
- [FKB64 File Specification](/docs/platform/document_storage#fkb64-file-specification)
- [DynamoDB Schema Documentation](/docs/platform/database_schema)
- [AWS S3 Migration Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/migration.html)