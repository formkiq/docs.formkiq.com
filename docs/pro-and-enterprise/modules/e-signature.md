---
sidebar_position: 1
---

# E-Signature Module

✅ Powered by [DocuSign API](https://www.docusign.com/) to enable electronic signatures for any PDF or MS Office document

The E-Signature Module is a FormKiQ Enterprise Add-On Module that enables electronic signature integration; at this time, only DocuSign is supported, but other e-signature integrations can be performed for FormKiQ Enterprise customers.

## Setup DocuSign

To send a document to DocuSign for signing, you need to interact with the DocuSign API. Below is how to configure FormKiQ to use your DocuSign account to send a document for signature using the DocuSign eSignature REST API.

### Set Up a DocuSign Developer Account

* Sign up for a free developer account at [DocuSign Developer Center](https://developers.docusign.com).

* Log in to the [DocuSign Admin Console](https://admindemo.docusign.com) and create an Integration Key (Client ID).

### Create an Integration Key (Client ID)

* In the DocuSign Admin Console, navigate to API and Keys under Integrations.

* Click on Add App/Integration Key.

* Fill out the required information. For the Redirect URI, enter a URI where DocuSign will send the OAuth response. This can be http://localhost if you're testing locally.

* Save your Integration Key (Client ID) and the RSA Private Key.

## Setup FormKiQ

Using the FormKiQ `PATCH /sites/{siteId}/configuration` API, configure your docusign configuration using the request body:

```
{
  "docusign": {
    "userId": "string",
    "integrationKey": "string",
    "rsaPrivateKey": "string"
  }
}
```

* INTEGRATION_KEY: Your Integration Key (Client ID).

* USER_ID: The API Username of the user (found in the Admin Console under Users).

* RSA_PRIVATE_KEY: The private key you generated and added to your DocuSign integration key (it should be in PEM format).

## API

Using the /esignature/docusign/{documentId} API, you can send a specific document off to Docusign for signature.

An request body example is as follows:

```
{
  "emailSubject": "This is the document that needs to be signed",
  "status":"SENT",
  "developmentMode": true,
  "signers": [
    {
      "name": "John Smith",
      "email": "johnsmith@<yourdomain.com>"
    }
  ],
  "carbonCopies": [
    {
      "name": "Jane Smith",
      "email": "janesmith@<yourdomain.com>"
    }
  ]
}
```
