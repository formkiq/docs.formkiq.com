---
sidebar_position: 1
---

# Attributes

## Overview

Attributes in FormKiQ provide a powerful system for managing document metadata. This feature enables you to categorize, search, and manage documents through customizable metadata fields. Each attribute is created at the site level and can be reused across multiple documents or entities, ensuring consistency in data structure and validation.

## Key Concepts

### Attribute Structure
Each attribute consists of three fundamental components:
- **Key**: A unique identifier for the attribute
- **Data Type**: The type of data the attribute can hold
- **Type**: The attribute's purpose or classification within the system

### Data Types
FormKiQ supports the following data types for attributes:

- **STRING**: For text-based information (e.g., titles, descriptions, authors)
- **NUMBER**: For numeric values (e.g., version numbers, page counts)
- **BOOLEAN**: For true/false values (e.g., approval status, publication flags)
- **KEY_ONLY**: For identifier-only attributes without additional data
- **PUBLICATION**: For creating permanent publication links in documentation review processes
- **RELATIONSHIP**: For establishing connections between documents (e.g., attachments, parent-child relationships)

### Attribute Types

FormKiQ offers two types of attributes:

- **STANDARD**: General-purpose attributes for common metadata needs
- **OPA (Open Policy Agent)**: Specialized attributes for implementing policy-based access control

## Common Use Cases

### Document Organization
- Create custom taxonomies
- Implement version control
- Establish document hierarchies
- Tag documents for easy retrieval

### Workflow Management
- Track document status
- Manage approval processes
- Monitor document lifecycle stages
- Implement conditional workflows

### Access Control
- Define document permissions
- Implement role-based access
- Create attribute-based policies
- Manage document sharing

## Reserved Attribute Keys

The following keys are reserved for FormKiQ system use:

- **Classification**: Used for document classification
- **Relationships**: Manages document relationships
- **MalwareScanResult**: Stores malware scan results
- **EsignatureDocusignEnvelopeId**: Tracks DocuSign envelope IDs
- **EsignatureDocusignStatus**: Monitors DocuSign signature status

## Best Practices

1. **Attribute Naming**
   - Use clear, descriptive keys
   - Follow a consistent naming convention
   - Avoid special characters
   - Consider future scalability

2. **Data Type Selection**
   - Choose appropriate data types for validation
   - Consider reporting requirements
   - Plan for data aggregation needs
   - Account for search functionality

3. **Attribute Organization**
   - Group related attributes logically
   - Plan attribute hierarchies
   - Document attribute relationships
   - Consider workflow implications

## API Integration

FormKiQ provides comprehensive API endpoints for attribute management:

- List available attributes
- Add custom attributes
- Retrieve specific attributes
- Delete obsolete attributes
- Get allowed attribute values

For detailed API documentation, refer to our [API Reference](/docs/api-reference/add-attribute).