---
sidebar_position: 5
---

# Documents

## Overview

FormKiQ's document management platform provides a comprehensive framework for storing, retrieving, and organizing documents. Built on Amazon S3, the platform ensures enterprise-grade security, scalability, and reliability for all your document management needs.

## Core Components

### Document Metadata

FormKiQ supports two types of metadata for maximum flexibility:

#### Standard Metadata
Essential document properties tracked automatically:
- Path/filename
- Content type
- Checksum
- File size
- Deep link path (for external documents)

#### Extended Metadata
Custom data directly attached to documents:
- Supports up to 25 metadata entries per document
- Versioned with document changes
- Enables comprehensive audit trails
- Searchable through full-text solutions

### Document Attributes

Attributes provide powerful document organization capabilities through structured metadata. They enable:
- Custom classification schemes
- Advanced search functionality
- Workflow automation
- Access control

[Learn more about Attributes](/docs/features/attributes)

### Document Relationships

FormKiQ supports sophisticated document relationships to maintain logical connections between related files:

#### Relationship Types:
1. **PRIMARY**: Main document serving as the principal source
2. **ATTACHMENT**: Supporting files linked to primary documents
3. **APPENDIX**: Additional reference materials
4. **SUPPLEMENT**: Standalone supplementary information
5. **ASSOCIATED**: Documents with non-hierarchical connections
6. **RENDITION**: Alternative formats or translations
7. **TEMPLATE**: Templates, such as those used in document generation
8. **DATASOURCE**: Datasources, such as those used in document generation

## Document Management Features

### Document Actions

FormKiQ supports various automated actions for document processing:

| Action | Description | Edition |
|--------|-------------|----------|
| ANTIVIRUS | Malware scanning using ClamAV | Essentials/Advanced/Enterprise |
| DOCUMENTTAGGING | AI-powered document categorization | Core |
| EVENTBRIDGE | AWS EventBridge integration | Core |
| FULLTEXT | Text extraction and indexing | Core + Add-On Options |
| IDP | Intelligent Document Processing | Essentials/Advanced/Enterprise + Add-On Options |
| NOTIFICATION | Email notifications | Core |
| OCR | Text extraction from images/PDFs | Core + Add-On Options |
| PUBLISH | Publication of approved documents | Essentials/Advanced/Enterprise |
| QUEUE | Workflow management | Essentials/Advanced/Enterprise |
| WEBHOOK | External system integration | Core |

### Document Versioning

Available as an Add-On Module, versioning provides:
- Complete change history
- Version comparison
- Rollback capabilities
- Audit trails

### User Activity Tracking

Monitor and log all document interactions:
- View access
- Modifications
- Sharing events
- Deletion records

:::note
User activity tracking is available as an Add-On Module
:::

## API Integration

FormKiQ provides comprehensive API endpoints for document management:

```json
// Example: Add Document Attribute
POST /documents/:documentId/attributes
{
  "attributes": [
    {
      "key": "Department",
      "stringValue": "Human Resources"
    },
    {
      "classificationId": "confidential"
    }
  ]
}
```

[Complete API Documentation](/docs/api-reference/add-document)

## Best Practices

1. **Document Organization**
   - Implement consistent naming conventions
   - Use attributes for classification
   - Establish clear relationship hierarchies
   - Leverage metadata for searchability

2. **Version Control**
   - Enable versioning for critical documents
   - Document version changes
   - Implement approval workflows
   - Regular backup procedures

3. **Security**
   - Configure appropriate access controls
   - Regular security audits
   - Monitor user activities
   - Implement encryption where needed

4. **Performance**
   - Optimize file sizes
   - Use appropriate storage classes
   - Implement caching strategies
   - Monitor system metrics