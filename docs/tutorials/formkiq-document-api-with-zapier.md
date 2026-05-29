---
sidebar_position: 30
---

# Zapier Integration

## What You Will Build

You will create a Zapier webhook that receives FormKiQ document webhook events and writes new document IDs into a Google Sheet.

## Before You Begin

* You have installed FormKiQ; see the <a href="/docs/getting-started/quick-start">Quick Start</a>
* You have a Zapier account - [it's free to sign up](https://zapier.com/sign-up)
* You have a [Google Sheet](https://docs.google.com/spreadsheets) account
* Install either: cURL or your favorite API Client, like https://www.postman.com.

## Workflow Overview

1. Create a Google Sheet to receive webhook data.
2. Create a Zapier Catch Hook trigger.
3. Add a Google Sheets action.
4. Create a FormKiQ document with a webhook action.
5. Verify the Google Sheet receives the document event.

## Step 1: Review the Webhook Flow

When adding a document using the FormKiQ API, you can specify one or more actions to be perform after the document has been saved. One of the supported actions is calling a Webhook. In this tutorial we will build a Zapier Zap which will use the Webhook trigger and insert rows into a Google Sheet for documents added to FormKiQ.

## Step 2: Create Google Sheet

The first thing we need to do is create the Google Sheet that will store the list of created documents.

To start:

* Visit [sheet.new](https://sheet.new) to create your Google Sheet.
* Add columns *SiteId* and *DocumentId*

image::google-sheet-zapier.png[Zapier Google Sheet]

The Webhook contains the SiteId the document was created in, as well as the documentId assigned to the document. When we create the Zapier integration we will use these columns to map the Webhook payload to the Google Sheet.

Now that our Google Sheet is created, it's time to setup Zapier.

## Step 3: Create Zap

. To create a new Zap in Zapier,

* Visit https://zap.new
* Click `Webhooks by Zapier`
* Under `Event`, choose `Catch Hook`
* Click Continue

![Zapier Webhook Trigger](./img/zapier-trigger-webhook.png)

The FormKiQ Webhook request's body looks like:
```
{
  "documents":[{...}]
}
```

* Under `Set up Trigger`:
* Set the `Pick off a Child Key` as `documents`
* Click Continue

![Zapier Webhook Trigger](./img/zapier-setup-trigger.png)

Zapier will now display the Webhook URL that was created for your Zap. This is the URL you will use for your FormKiQ Webhook action.

![Zapier Webhook Url](./img/zapier-webhook-url.png)

* The last step is to send the webhook a sample of the expected request the FormKiQ Webhook will send. Using an API Client send the following request body to the `Zapier Webhool Url` using a POST request.

```
{
  "documents":[
     {
        "siteId":"default",
        "documentId":"52c0575f-427f-47e1-9028-3021ad2481cd12312321"
     }
  ]
}
```

## Step 4: Add the Google Sheet Action

* Next, click on the `Action` and select `Google Sheets`.

![Google Sheets Action](./img/google-sheets-action.png)

* Under `Event` select `Create Spreadsheet Row`. This will insert a new row in your Google Sheet for every document created.

* Click Continue and follow the prompts to configure Zapier to have access to the Google Sheet you created in the `Create Google Sheet` step.

![Zapier Setup Google Sheets](./img/zapier-setup-google-sheets.png)

* After your Google Sheet is configured, set the `SiteId` and `DocumentId` from the drop down as shown below. Then click Continue.

![Zapier Setup Google Sheets Action](./img/zapier-google-sheet-set-up-action.png)

The last step is to click the `Publish Zap` button. Once your Zap is published your Webhook is ready.

## Step 5: Create a FormKiQ Document with a Webhook Action

* Following the https://docs.formkiq.com/docs/latest/api/index.html#tag/Documents/operation/AddDocument[FormKiQ Add Document API], we can create a request to create a new document and send it to the FormKiQ API endpoint. For the request, we will use the `actions` section in the request to specify the Zapier Webhook URL we want to be called after the document is created.

```
{
  "path": "test.txt",
  "contentType": "text/plain",
  "isBase64": false,
  "content": "This is sample data",
  "actions": [
    {
      "type": "webhook",
      "parameters": {
        "url":"https://hooks.zapier.com/hooks/catch/.../"
      }
    }
  ]
}
```

* After sending the request to the FormKiQ API, check your Google Sheet and you should see the sheet has been updated with your newly added document.

![Zapier Webhook Successful](./img/zapier-webhook-success.png)

## Verify the Result

After sending the FormKiQ request, check the Google Sheet. A new row should appear with the `SiteId` and `DocumentId` values from the webhook payload.

## Clean Up

Turn off or delete the Zap if it was only created for testing. Delete the test spreadsheet rows and test document if they are no longer needed.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| Zapier does not receive sample data | The webhook URL was copied incorrectly or the request body is invalid. | Send the sample payload directly to the Zapier hook URL. |
| Google Sheet row is blank | Zap field mapping is incomplete. | Confirm `SiteId` and `DocumentId` are mapped from the webhook payload. |
| FormKiQ does not call Zapier | Webhook action URL or action type is incorrect. | Confirm the FormKiQ document request includes a valid `WEBHOOK` action URL. |

## Next Steps

- [Add Document Actions](/docs/how-tos/api-document-actions)
- [Documents API](/docs/tutorials/Documents/documents-api)
