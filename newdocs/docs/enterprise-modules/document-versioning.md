---
sidebar_position: 1
---

# Document Versioning

✅ Track Versions using S3 Versions and the FormKiQ Document API

✅ Add Versioned Metadata for Document Control

Document Versioning is a FormKiQ Module that provides version tracking for document content and metadata, allowing document control for security, compliance, and audit requirements.

The module uses [Amazon S3](https://aws.amazon.com/s3) versions, which provides reliable tracking of all changes to your documents.

## Use Case

* If documents need occasional updates, and it's important to track when those updates occurred or who made the modifications, this module can provide that information as part of your standard workflow.

## API

The Document Versioning Module adds endpoints to get version info, as well as to request specific versions when requesting a document for display or download. In addition, there is an endpoint to set the current version, allowing a change to be reverted by promoting a previous version to become the most recent, i.e., current, version of the document.

<!---
**You can view the full list of Document Versioning Module endpoints in the link:../api/README.html#documentversions[API Reference].**
-->