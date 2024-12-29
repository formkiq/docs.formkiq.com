---
sidebar_position: 1
---

# E-Signature

## Overview

The E-Signature module integrates electronic signature capabilities into FormKiQ through the [DocuSign API](https://www.docusign.com/). This Enterprise Add-On Module enables secure, legally-binding electronic signatures for PDF and MS Office documents.

## Features & Benefits

### Core Features
- Electronic signature integration for documents
- Support for PDF and MS Office formats
- Secure signature workflows
- Customizable notifications
- Status tracking

### Key Benefits
- **Simplified Process**: Streamlined signature collection
- **Security**: DocuSign's secure signature platform
- **Flexibility**: Remote and in-person signing
- **Integration**: Seamless FormKiQ platform integration
- **Notifications**: Customizable reminders and expiration settings

## Use Cases

### Business Operations
- Contract Management
- Purchase Order Approvals
- Proposal Signatures
- Document Approvals

### Human Resources
- Employment Agreements
- Onboarding Documents
- Policy Acknowledgments
- Benefits Enrollment

### Real Estate
- Property Contracts
- Lease Agreements
- Disclosure Forms
- Purchase Agreements

### Healthcare
- Patient Consent Forms
- Medical Records
- HIPAA Documents
- Treatment Authorizations

## Setup Guide

### 1. DocuSign Configuration

#### Create Developer Account
1. Visit [DocuSign Developer Center](https://developers.docusign.com/)
2. Create and activate account

#### Generate Integration Key
1. Navigate to Settings → Integrations → Apps and Keys
2. Click "Add App & Integration Key"
3. Save app name to receive Integration Key

#### Create RSA Keypair
1. Locate RSA Keypairs section
2. Click "Add RSA Keypair"
3. Download private key immediately
4. Store key securely

#### Obtain User ID
1. Access DocuSign Profile
2. Locate User ID in API and Keys section

### 2. FormKiQ Configuration

Configure DocuSign integration using the FormKiQ API:

```http
PATCH /sites/{siteId}/configuration
```

```json
{
  "docusign": {
    "userId": "your-docuSign-userId",
    "integrationKey": "your-docuSign-integrationKey",
    "rsaPrivateKey": "your-docuSign-rsaPrivateKey"
  }
}
```

## API Reference

### Create Envelope
```http
POST /esignature/docusign/{documentId}/envelopes
```
Initiates signature process by creating DocuSign envelope

### Create Recipient View
```http
POST /esignature/docusign/{documentId}/envelopes/{envelopeId}/views/recipient
```
Generates recipient-specific signing URL

### Handle Events
```http
POST /esignature/docusign/events
```
Processes DocuSign callback events

For complete API documentation, see [E-Signature API Reference](/docs/api-reference/add-docusign-envelopes).

## Best Practices

1. **Security**
   - Secure storage of integration keys
   - Regular key rotation
   - Monitor signature events

2. **Implementation**
   - Test workflows thoroughly
   - Implement error handling
   - Monitor signature status

3. **User Experience**
   - Clear signing instructions
   - Appropriate reminders
   - Status notifications