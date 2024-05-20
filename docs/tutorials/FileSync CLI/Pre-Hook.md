---
sidebar_position: 1
---

# Pre-Hook Option

This tutorial show you how to use the "--pre-hook" option in the [FileSync CLI](/docs/pro-and-enterprise/modules/filesync-cli) to add document metadata at the same time as syncing documents to FormKiQ.

We will be:

* Using the [FileSync CLI](/docs/pro-and-enterprise/modules/filesync-cli) to sync documents to FormKiQ and add document metadata at the same time

## What you’ll need

* Access to a FormKiQ Pro or FormKiQ Enterprise installation

* Installed and configured the [FileSync CLI](/docs/pro-and-enterprise/modules/filesync-cli)


## Pre-requisite

The tutorial uses [Node.js](https://nodejs.org/en) to create the webservice. 

* Download and install [Node.js](https://nodejs.org/en)

## Pre-Hook Webservice

To create a Node.js web service that processes the given request and returns the specified payloads based on the filename, follow these steps:

### Step 1: Initialize a Node.js Project

First, set up your Node.js project. In your terminal, run:

```bash
mkdir webservice
cd webservice
npm init -y
```

### Step 2: Install Required Packages

You will need Express, a popular web framework for Node.js. Install it by running:

```bash
npm install express
```

### Step 3: Create the Web Service

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
    "metadata": [
      {
        "key": "property",
        "value": "value1"
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
    "metadata": [
      {
        "key": "property",
        "value": "value2"
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

### Step 4: Run the Web Service

In your terminal, run the following command to start the server:

```bash
node index.js
```

You should see the message `Server is running on http://localhost:3000`.

### Step 5: Test the Web Service

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
  "metadata": [
    {
      "key": "property",
      "value": "value1"
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
  "metadata": [
    {
      "key": "property",
      "value": "value2"
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

## FileSync CLI

Now, we will:

* Create 2 sample example documents

* Configure the FileSync CLI

* Run the FileSync to sync the two documents and add metadata

### Create Sample Files

Create a directory **example** in the directory, create the following two files example1.txt and example2.txt.

Create a new directory:
```
mkdir example
```

Create 2 files in the `example` directory

**example/example1.txt**

```
This is example1.txt
```

**example/example2.txt**

```
This is example2.txt
```

### Configure FileSync CLI

Using the information from the  CloudFormation **Outputs** of the FileSync CLI and FormKiQ installation configure the CLI using the following command:

```
fk --configure --access-key ACCESS_KEY \
               --secret-key ACCESS_SECRET \
               --region AWS_REGION \
               --iam-api-url IAM_API_URL \
               --documents-dynamodb-tablename DOCUMENTS_TABLE_NAME
```

### Run FileSync CLI

We will now run the FileSync CLI to sync 2 sample files from the examples directory to FormKiQ.

```
fk --sync -d ./examples --pre-hook http://localhost:3000/get-payload -v
```

## Summary

And there you have it! We have shown how easy it is to use FileSync CLI with --pre-hook option to sync documents to FormKiQ with custom document metadata.

This is just the tip of the iceberg when it comes to working with the FormKiQ APIs.

If you have any questions, reach out to us on our https://github.com/formkiq/formkiq-core or https://formkiq.com.
