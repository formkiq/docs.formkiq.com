---
sidebar_position: 8
---

# Compliance, Data Residency, and Data Sovereignty

## Overview

FormKiQ is designed with global compliance in mind, providing enterprises with the tools necessary to meet regulatory requirements across different regions. FormKiQ's architecture allows organizations to maintain control over where their data is stored and processed, supporting compliance with data residency and sovereignty requirements in various jurisdictions.

:::note
FormKiQ's cloud-native architecture leverages AWS regional infrastructure to help organizations meet specific geographic data storage requirements.
:::

## Data Residency

Data residency refers to the geographic location where your data is stored. FormKiQ supports data residency requirements by leveraging AWS regional infrastructure, allowing you to select the specific geographic location where your data will be stored.

### Regional Deployment Options

FormKiQ can be deployed in any AWS region where the required services are available, including:

- North America (US, Canada)
- Europe (EU countries, UK)
- Asia Pacific (Australia, Singapore, Japan)
- South America (Brazil)
- Middle East and Africa coming soon

By choosing the appropriate AWS region for your FormKiQ deployment, you can ensure that your document data remains within your preferred geographic boundaries to satisfy regulatory requirements.

### Multi-Region Architecture

For organizations with global operations and complex data residency requirements, FormKiQ can also support multi-region deployments on request:

- Deploy separate FormKiQ instances in different regions
- Maintain isolation between regional deployments for data residency compliance
- Configure region-specific access controls and policies

## Data Sovereignty

Data sovereignty encompasses legal requirements that data be subject to the laws and governance structures of the nation where it is collected or processed. FormKiQ's flexible architecture supports organizations in meeting data sovereignty requirements across multiple jurisdictions.

### Key Data Sovereignty Features

- **Access Controls**: Granular permissions using RBAC and ABAC to enforce jurisdiction-specific access policies
- **Encryption**: Comprehensive data encryption to maintain data confidentiality
- **Audit Logging**: Detailed audit trails for data access and processing activities
- **Configurable Data Retention**: Policies for data lifecycle management to comply with retention requirements

## Regional Compliance Support

### European Union (GDPR)

FormKiQ supports compliance with the General Data Protection Regulation (GDPR) through:

- Data storage in EU regions to maintain data residency within the European Economic Area (eu-west-1 - Ireland, eu-west-3 - Paris, eu-central-1 - Frankfurt, other regions coming soon)
- Data processing controls to support data subject rights (access, rectification, erasure)
- Secure data transfer mechanisms when cross-border data transfers are necessary
- Comprehensive audit logging for transparency and accountability
- Data minimization capabilities through selective metadata extraction and storage

### United Kingdom (UK GDPR and Data Protection Act 2018)

FormKiQ supports compliance with the UK's data protection framework through:

- Data storage in the London AWS region to maintain UK data residency (eu-west-2)
- Controls aligned with UK GDPR requirements for data subject rights
- Security measures that meet UK standards for "appropriate technical and organizational measures"
- Audit capabilities to demonstrate accountability and compliance
- Data transfer mechanisms for secure movement of data between UK and other jurisdictions

### Canada (PIPEDA)

The Personal Information Protection and Electronic Documents Act (PIPEDA) compliance is supported through:

- Canadian region deployment options for data residency (ca-central-1 - Montreal and ca-west-1 - Calgary)
- Consent management tools for document collection and processing
- Security measures that meet the "appropriate level of protection" requirement
- Access controls to restrict personal information to authorized personnel
- Breach notification capabilities

### California (CCPA/CPRA)

FormKiQ features supporting California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA) requirements include:

- Data discovery capabilities to identify consumer personal information
- Metadata tagging to categorize sensitive personal information
- Access controls to limit data usage to specified purposes
- Audit trails to demonstrate compliance with consumer rights requests
- Document retention management to enforce data deletion requirements

### Australia (Privacy Act)

Australian Privacy Act compliance is facilitated through:

- Data storage in Sydney AWS region (ap-southeast-2)
- Security controls aligned with Australian Privacy Principles (APPs)
- Collection limitations through selective document processing
- Access management for personal information
- Audit capabilities to demonstrate APP compliance

## Implementing Compliant Solutions

### Architecture Considerations

When implementing a compliant document management solution with FormKiQ, consider:

1. **Region Selection**: Choose AWS regions that align with your organization's data residency requirements
2. **User Access Models**: Implement RBAC/ABAC policies that respect geographic data access restrictions
3. **Data Classification**: Utilize metadata and attributes to identify and manage regulated data
4. **Monitoring Configuration**: Set up appropriate audit logging and monitoring for compliance verification

### Deployment Examples

#### Example 1: Multi-National Financial Services

A financial services company operating in the EU, Canada, and the US can implement FormKiQ with:

- Separate FormKiQ instances in EU, Canadian, and US AWS regions
- Region-specific access policies enforced through ABAC
- Cross-region authentication while maintaining data isolation
- Region-specific retention periods based on local regulations

#### Example 2: Healthcare Provider

A healthcare organization subject to HIPAA, GDPR, and Australian privacy laws can deploy:

- Region-specific FormKiQ instances with appropriate encryption settings
- PHI/PII identification through metadata tagging
- Jurisdiction-specific access controls and data processing policies
- Comprehensive audit logs to demonstrate regulatory compliance

## AWS Compliance Programs

FormKiQ leverages AWS infrastructure, which maintains certifications and attestations for various compliance programs including:

- ISO 27001, 27017, 27018, 9001
- SOC 1, SOC 2, SOC 3
- PCI DSS
- GDPR
- HIPAA eligibility
- FedRAMP
- MTCS
- IRAP

FormKiQ's architecture is designed to operate within these compliance frameworks, enabling customers to extend these compliance capabilities to their document management system.

:::note
While FormKiQ provides the technical capabilities to support compliance, customers remain responsible for configuring their implementation to meet specific regulatory requirements. We recommend consulting with legal and compliance professionals when designing your document management solution.
:::

## Additional Compliance Resources

- [AWS Compliance Programs](https://aws.amazon.com/compliance/programs/)
- [AWS Regions and Service Availability](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/)
- [FormKiQ Security Documentation](/docs/platform/security)