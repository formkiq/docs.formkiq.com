---
sidebar_position: 1
---

# Documents

```
API Endpoint: /documents
```

At the heart of the FormKiQ document management platform lies a sophisticated framework that seamlessly integrates storing, retrieving, and organizing documents. Our platform's robust storage capabilities ensure documents are securely housed and easily retrievable, leveraging cutting-edge technologies like Amazon S3 to guarantee data integrity and scalability. 

Documents can be organized in a way that mirrors their workflow, projects, or departments. This intuitive hierarchy ensures efficient navigation, as documents are logically grouped for swift access. Users can effortlessly retrieve specific files by browsing through familiar folder paths or by utilizing powerful search functionalities. This combination of advanced storage solutions and user-centric organization not only streamlines document management but also enhances collaboration and knowledge sharing across teams. Our platform transforms document handling into a seamless and structured process, offering a comprehensive solution for businesses seeking to optimize their document management practices.

## Metadata

FormKiQ has several types of metadata currently, separated into different resources:

### Standard

Standard document metadata: common metadata such as the path/filename, content type, checksum, and filesize, and one use-specific property, deepLinkPath, enabling an external document’s metadata to be included within FormKiQ while the file object itself is stored in another system.

### Attributes

```
API Endpoint: /documents/{documentId}/attributes
```

FormKiQ's document management platform revolutionizes the way documents are organized and retrieved by offering a robust document organizing capability through document attributes.

Attributes are created at the site level and then assigned to an additional document or entity, that attribute will have access to any additional properties provided to the attribute, such as attribute data type, validation and security.

The main reason for this is to enable attribute-driven and attribute-aware actions within FormKiQ, such as creating a conditional workflow step. By sharing certain properties such as the data type, actions can be applied consistently.

Supported Attribute date types:

* String values

* Numeric values

* Boolean values

* Key Only (no value)

### Tags (Replace by Attributes)

```
API Endpoint: /documents/{documentId}/tags
```

FormKiQ's tagging feature, documents can be meticulously labeled using a variety of options: 

* a standalone key for broad categorization
* a key paired with a value for detailed classification
* or a key associated with multiple values for comprehensive tagging. 

This flexibility empowers users to tailor their tagging approach according to their specific needs, enhancing document discovery and navigation. Through tags, documents become rich with context, allowing users to quickly identify relevant materials and establish meaningful connections between files. Whether it's a simple keyword, an intricate set of attributes, or a combination of both, our platform's tagging functionality ensures documents are intelligently categorized and readily accessible, fostering a dynamic and user-centric document management experience.

### Document Metadata

Document metadata is custom data that can be directly attach to a document. By embedding metadata within the document, users ensure that essential information remains intact and travels alongside the document, enhancing its context and discoverability.

When using document versioning, as documents evolve and new versions are created, the platform retains a historical record of metadata changes, providing a comprehensive history of the document's attributes across iterations. This powerful feature allows for the fosters accurate tracking and auditing for document controls.

Unlike a document tag (which is unversioned), metadata can only be searched when using one of FormKiQ's full-text solutions. Each document only support up to 25 Metadata entries.

:::note
Each document only support up to 25 Metadata entries.
:::

## Document Actions

```
API Endpoint: /documents/{documentId}/actions
```

The FormKiQ document management platform offers a dynamic and customizable approach to document processing through a comprehensive set of document actions. With the platform, users can seamlessly chain together multiple actions, creating powerful workflows that enhance document processing efficiency. 

These actions encompass a wide spectrum of functionalities, including:

* OCR (Optical Character Recognition) for text extraction
* Antivirus scanning for detecting trojans, viruses, malware & other malicious threats
* Webhooks for seamless integrations
* Intelligent document tagging for accurate categorization of documents using artificial intelligence

This suite of features transforms document management into a seamless process, enabling users to automatically process, organize, and enrich documents based on their unique needs. By chaining actions together, our platform empowers users to create sophisticated workflows that drive productivity, accuracy, and collaboration across the entire document lifecycle.


## Document Versions

```
API Endpoint: /documents/{documentId}/actions
```

FormKiQ handling of document versions is designed to efficiently manage and track multiple iterations of documents throughout their lifecycle. This system ensures that every modification made to a document is recorded and saved as a new version, maintaining a comprehensive history of changes. 

Users can access previous versions, compare changes, and restore earlier iterations if necessary, providing a robust audit trail and enhancing collaboration.

:::note
only supported in FormKiQ PRO / Enterprise
:::

## Document User Activities

```
API Endpoint: /documents/{documentId}/userActivities
```

FormKiQ tracks user's document activities and logs all interactions users have with documents within the system. This includes actions such as viewing, editing, sharing, and deleting documents. By maintaining detailed activity logs, FormKiQ ensures transparency and accountability, allowing administrators to ensure security and compliance with any regulatory requirements.

:::note
only supported in FormKiQ PRO / Enterprise
:::