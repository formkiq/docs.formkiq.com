---
sidebar_position: 1
---

# E-Signature Module

✅ Powered by [DocuSign API](https://www.docusign.com/) to enable electronic signatures for any PDF or MS Office document

The E-Signature Module is a FormKiQ Enterprise Add-On Module that enables electronic signature integration; at this time, only DocuSign is supported, but other e-signature integrations can be performed for FormKiQ Enterprise customers.

## Use Cases

* **Contract Management**: Send contracts to clients or partners for signature and ensure compliance with legal standards.
* **HR Onboarding**: Facilitate signing of employment agreements and onboarding documents for new hires.
* **Approval Workflows**: Obtain approvals on proposals, purchase orders, or project documents.
* **Real Estate Transactions**: Manage the signing of real estate contracts and agreements.
* **Healthcare Forms**: Digitally sign patient consent forms and medical records.

## Benefits

* **Ease of Use**: Simplifies the process of sending and managing electronic signature requests.
* **Security**: Leverages DocuSign’s secure platform for legally binding e-signatures.
* **Flexibility**: Supports both remote and in-person signing workflows.
* **Customizable Notifications**: Provides options for reminders and expiration settings to manage pending signatures.
* **Seamless Integration**: Integrates DocuSign settings into the FormKiQ platform for smooth operation.

## Setup DocuSign

To send a document to DocuSign for signing, you need to interact with the DocuSign API. Below is how to configure FormKiQ to use your DocuSign account to send a document for signature using the DocuSign eSignature REST API.

### Set Up a DocuSign Developer Account

* Visit the [DocuSign Developer Center](https://developers.docusign.com/).
* Create an account and log in.

### Create an Integration Key

* Navigate to **Settings** in your DocuSign Developer account.
* Under the **Integrations** section, select **Apps and Keys**.
* Click **Add App & Integration Key**.
* Enter a name for your app and save it. This generates your **Integration Key**, a unique identifier for your application.

### Generate an RSA Private Key

* After creating the Integration Key, locate the **RSA Keypairs** section under the app details.
* Click **Add RSA Keypair**.
* DocuSign will generate a public-private key pair for you. Download the **RSA Private Key** immediately, as it will not be accessible later.
* This key is essential for securing the communication between your application and DocuSign.

### Get Your User ID

* Navigate to your **Profile** in the DocuSign Developer account.
* Look for your **User ID** (sometimes referred to as API Username or Account ID) under the **API and Keys** section.
* Note this value, as it will be used in the configuration.

## Setup FormKiQ

Use the following API to set up DocuSign with FormKiQ:

**PATCH `/sites/{siteId}/configuration`**

#### Request Body
```json
{
  "docusign": {
    "userId": "your-docuSign-userId",
    "integrationKey": "your-docuSign-integrationKey",
    "rsaPrivateKey": "your-docuSign-rsaPrivateKey"
  }
}
```

## API

The following endpoints are available for DocuSign e-signature functionality, for full API documentation, See [full documentation here](/docs/api-reference/add-docusign-envelopes):

### Create DocuSign Envelope

POST `/esignature/docusign/{documentId}/envelopes`

Creates a DocuSign envelope to send documents for electronic signing.

### Create DocuSign Recipient View

POST `/esignature/docusign/{documentId}/envelopes/{envelopeId}/views/recipient`

Creates a URL for a recipient to view and sign a document.

### DocuSign Callback URL Handler

POST `/esignature/docusign/events`

Handles callback events from DocuSign, such as envelope completion or recipient actions.

