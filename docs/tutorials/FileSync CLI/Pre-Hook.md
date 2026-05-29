---
sidebar_position: 10
---

# Pre-Hook Option

This tutorial shows how to use the `--pre-hook` option in the [FileSync CLI](/docs/formkiq-modules/modules/filesync-cli) to add document tags and actions while syncing documents to FormKiQ.

## What You Will Build

You will build a small Node.js web service that receives FileSync pre-hook requests and returns document-specific tags. You will then sync two sample files and have the CLI apply different tags based on the file path.

## Before You Begin

- Access to a FormKiQ Essentials, Advanced, or Enterprise installation.
- The [FileSync CLI](/docs/formkiq-modules/modules/filesync-cli) installed and configured.
- [Node.js](https://nodejs.org/en) installed.
- A terminal with access to run `fk` and `node`.

## Workflow Overview

1. Create a Node.js pre-hook web service.
2. Test the pre-hook endpoint directly.
3. Create two sample files.
4. Run FileSync with `--pre-hook`.
5. Verify the files and tags in FormKiQ.

## Step 1: Create the Pre-Hook Web Service

To create a Node.js web service that processes the given request and returns the specified payloads based on the filename, follow these steps:

### Initialize a Node.js Project

First, set up your Node.js project. In your terminal, run:

```bash
mkdir webservice
cd webservice
npm init -y
```

### Install Required Packages

You will need Express, a popular web framework for Node.js. Install it by running:

```bash
npm install express
```

### Create the Web Service

Create a new file named `index.js` and add the following code:

```javascript
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define the payloads
const payloads = {
  "./examples/example1.txt": {
    "tags": [
      {
        "key": "category",
        "value": "document"
      },
      {
        "key": "user",
        "values": ["100", "101"]
      }
    ],
    "actions": [
      {
        "type": "FULLTEXT"
      }
    ]
  },
  "./examples/example2.txt": {
    "tags": [
      {
        "key": "category",
        "value": "invoice"
      },
      {
        "key": "user",
        "values": ["200", "201"]
      }
    ],
    "actions": [
      {
        "type": "OCR"
      }
    ]
  }
};

// Endpoint to handle requests
app.post('/get-payload', (req, res) => {
  const filename = req.body.path;
  const payload = payloads[filename];

  if (payload) {
    res.json(payload);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

## Step 2: Run the Web Service

In your terminal, run the following command to start the server:

```bash
node index.js
```

You should see the message `Server is running on http://localhost:3000`.

## Step 3: Test the Web Service

You can use tools like `curl` or Postman to test your web service.

#### Using `curl`

For `example1.txt`:

```bash
curl -X POST http://localhost:3000/get-payload -H "Content-Type: application/json" -d '{"path":"./examples/example1.txt"}'
```

Expected response:

```json
{
  "tags": [
    {
      "key": "category",
      "value": "document"
    },
    {
      "key": "user",
      "values": ["100", "101"]
    }
  ],
  "actions": [
    {
      "type": "FULLTEXT"
    }
  ]
}
```

For `example2.txt`:

```bash
curl -X POST http://localhost:3000/get-payload -H "Content-Type: application/json" -d '{"path":"./examples/example2.txt"}'
```

Expected response:

```json
{
  "tags": [
    {
      "key": "category",
      "value": "invoice"
    },
    {
      "key": "user",
      "values": ["200", "201"]
    }
  ],
  "actions": [
    {
      "type": "OCR"
    }
  ]
}
```

If you request a non-existent file, like `example3.txt`:

```bash
curl -X POST http://localhost:3000/get-payload -H "Content-Type: application/json" -d '{"path":"example3.txt"}'
```

Expected response:

```json
{
  "error": "File not found"
}
```

## Step 4: Create Sample Files

Now create the sample files that FileSync will upload.

Create a directory named `examples`, then create `example1.txt` and `example2.txt`.

Create a new directory:
```
mkdir examples
```

Create two files in the `examples` directory.

**examples/example1.txt**

```
This is example1.txt
```

**examples/example2.txt**

```
This is example2.txt
```

## Step 5: Configure FileSync CLI

If the CLI is not already configured, configure it using the FormKiQ CloudFormation outputs:

```
fk --configure --access-key ACCESS_KEY \
               --secret-key ACCESS_SECRET \
               --region AWS_REGION \
               --iam-api-url IAM_API_URL \
               --documents-dynamodb-tablename DOCUMENTS_TABLE_NAME
```

## Step 6: Run FileSync CLI

We will now run the FileSync CLI to sync 2 sample files from the examples directory to FormKiQ.

```
fk --sync -d ./examples --pre-hook http://localhost:3000/get-payload -v
```

## Verify the Result

Open the FormKiQ console and confirm that `example1.txt` and `example2.txt` were uploaded. Check each document's tags and queued actions to confirm the pre-hook response was applied.

## Clean Up

Stop the Node.js service with `Ctrl+C`. Delete the sample documents from FormKiQ if you do not want to keep them.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| FileSync receives a 404 from the pre-hook | The file path in the request does not match the `payloads` map. | Log `req.body.path` and update the sample keys. |
| Documents upload without tags | The pre-hook URL is wrong or the service is not running. | Confirm `node index.js` is running and `--pre-hook` points to the correct URL. |
| Actions are not created | The returned action type or payload is invalid. | Use supported action types such as `FULLTEXT`, `OCR`, or `WEBHOOK`. |

## Next Steps

- [FileSync CLI](/docs/formkiq-modules/modules/filesync-cli)
- [Add Document Actions](/docs/how-tos/api-document-actions)
- [Add Document Tags](/docs/how-tos/api-add-document-tags)
