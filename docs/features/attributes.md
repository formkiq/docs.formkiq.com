---
sidebar_position: 1
---

# Attributes

The Attributes feature in FormKiQ allows for the definition and management of metadata attributes associated with documents. This feature is crucial for categorizing, searching, and managing documents based on specific metadata criteria.

Attributes are created at the site level and then assigned to an additional document or entity, that attribute will have access to any additional properties provided to the attribute, such as attribute data type, validation and security.

The main reason for this is to enable attribute-driven and attribute-aware actions within FormKiQ, such as creating a conditional workflow step. By sharing certain properties such as the data type, actions can be applied consistently.

An attribute is defined by its key, data type, and type. These properties ensure that each attribute is uniquely identified, appropriately typed, and categorized according to its usage within the system.

An attribute is defined by its key, data type, and type. These properties ensure that each attribute is uniquely identified, appropriately typed, and categorized according to its usage within the system.

  - **Parameters:**
    - **key**: A string representing the unique key for the attribute.
    - **dataType**: Specifies the type of data that the attribute holds. Supported values are:
      - `STRING`: Used for attributes that contain textual information, such as titles, authors, or descriptions.
      - `NUMBER`: Used for attributes that contain numeric values, such as page counts, version numbers, or identifiers.
      - `BOOLEAN`: Used for attributes that hold true or false values, such as flags for review status or publication status.
      - `KEY_ONLY`: Used for attributes that are primarily identifiers without additional data, serving as unique keys.
    - **type**: Specifies the type of attribute. Supported values are:
      - `STANDARD`: Regular attributes used for general purposes.
      - `OPA`: Attributes that are used with Open Policy Agent for policy-based access control, enabling complex, attribute-based policies for document access and management.

## API Endpoints

The Attributes API provides a flexible way to manage and retrieve metadata attributes associated with documents. These attributes can represent document properties or tags that help in organizing, searching, and filtering documents. 

[See full API documentation here](/docs/api-reference/add-attribute)

## Use Cases

  1.  **Listing Available Attributes**
Retrieve a comprehensive list of all document attributes available for a given site. This can be useful when populating UI elements for filtering or categorizing documents.
  2.  **Adding Custom Attributes**
Allows users to add new attributes that can be associated with documents, enabling custom metadata tailored to organizational needs.
  3.  **Retrieving a Specific Attribute**
Fetch details about a specific attribute using its unique key. This can be helpful for applications needing detailed information about an attribute’s properties or configurations.
  4.  **Deleting an Attribute**
Enables users to remove attributes that are no longer relevant, simplifying data management and ensuring metadata stays up-to-date.
  5.  **Getting Allowed Values for an Attribute**
Retrieves a list of allowed values for an attribute, supporting scenarios where attributes have predefined options (e.g., status fields, categories). This can help maintain consistency and integrity in document categorization.

## Reserved Attribute Keys

The following attribute keys are reserved for internal use by FormKiQ and cannot be used as custom attribute keys.

* Classification: Reserved for document classification purposes. [Document Classification Documentation](/docs/features/documents#document-classifications)

* Relationships: Reserved for defining relationships between documents. [Document Relationships Documentation](/docs/features/documents#document-relationships)

* MalwareScanResult: Reserved for storing results from malware scans.

* EsignatureDocusignEnvelopeId: Reserved for tracking DocuSign envelope IDs in e-signature workflows.

* EsignatureDocusignStatus: Reserved for tracking the status of DocuSign e-signature requests.
