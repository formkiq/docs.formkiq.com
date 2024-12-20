---
sidebar_position: 6
---

# Document Console


## Overview

The FormKiQ Document Console is an intuitive and user-friendly web application built using [React](https://react.dev), designed to serve as the frontend for efficiently managing your digital documents. This powerful tool offers a seamless and modern interface, making document management an effortless and organized process.

Key features of the FormKiQ Document Console include:

1. **User-Friendly Interface**: The application boasts a clean and user-friendly design, ensuring that users can navigate through their documents with ease.

2. **Document Organization**: The console provides a central hub for organizing and categorizing your documents. Users can easily create folders, assign tags, and maintain a structured hierarchy for their files.

3. **Document Upload**: Users can upload documents directly from their devices. This flexibility simplifies the process of populating the document repository.

4. **Document Preview**: The console allows users to preview documents without the need to download them. This feature can save time and provide a quick overview of the content.

5. **Document Search**: The search functionality enables users to find specific documents using keywords, tags, or other search parameters. This feature is particularly useful for those dealing with large document repositories.

6. **Security**: As with the FormKiQ Document API itself, the FormKiQ Document Console includes security measures to protect sensitive information. This can include user authentication, encryption, and access control to ensure that only authorized personnel can access certain documents.

7. **Configuration**: The console allows configuration settings to be updated, including document usage limits, OpenAI settings, and the creation of API Keys for the Document API.

8. **Customization**: The application may offer options for customizing the interface, such as choosing themes, layouts, or personalized settings to meet individual preferences.


## CloudFront / S3

The FormKiQ Document Console uses [AWS CloudFront](https://aws.amazon.com/cloudfront) and [Amazon S3](https://aws.amazon.com/s3/) to efficiently serve the console as a Single Page Application (SPA).

[AWS CloudFront](https://aws.amazon.com/cloudfront) is a content delivery network (CDN) service built for high performance, and security.

[Amazon S3](https://aws.amazon.com/s3/) is an object store that contains the console source files.

:::note
NOTE: In some specialized AWS regions, such as **AWS GovCloud (US) West**, the console is not available via CloudFront, and will need to be run as a Docker Image ([see below](/docs/platform/document_console#docker-image)).
:::

## Docker Image

The FormKiQ Document Console is also available as a [docker image](https://hub.docker.com/repository/docker/formkiq/document-console) that can be used when [AWS CloudFront](https://aws.amazon.com/cloudfront) is not available, as with deployments into **AWS GovCloud (US) West**.

To run the docker image collect the following CloudFormation outputs from your FormKiQ installation.

![Document Console CloudFormation Outputs](./img/document-console-cf-outputs.png)

| Environment Varaible    | Description |
| -------- | ------- |
| `HTTP_API_URL` | The URL for the API endpoint that uses Cognito authorization |
| `COGNITO_USER_POOL_ID` | The Cognito User Pool Id |
| `COGNITO_CLIENT_ID` | The Cognito Client Id |
| `COGNITO_API_URL` | The Cognito Login API endpoint |

### Docker Run Command

```
docker run -p 80:80 \
-e HTTP_API_URL=... \
-e COGNITO_USER_POOL_ID=... \
-e COGNITO_CLIENT_ID=... \
-e COGNITO_API_URL=... \ 
formkiq/document-console:VERSION
```

### Creating the Initial Console User

In some cases, such as when deploying FormKiQ to AWS GovCloud (US) West, no admin user is created automatically and the console is not automatically deployed.

While it's possible to use only AWS IAM authentication, or to create an API Key using IAM and then use key-based authentication, both JSON Web Token (JWT) authentication and the FormKiQ Document Console require at least one Amazon Cognito user to be created and for that user's password to be set.

To do this, you can [run the docker image](/docs/platform/document_console#docker-run-command), either locally or within a container running in AWS, such as an EC2 or Lambda.

You will also need to update the Welcome Email template, by updating an Environment Variable in the CognitoCustomMessage Lambda function.

**1. Find the Lambda function by filtering for "CognitoCustomMessage"**

![Searching for the CognitoCustomMessage Lambda](./img/document-console-lambda-search.png)

Once you've found it, click on the name of the function.

**2. Open the Environment Variables tab via the top-level "Configuration" tab**

![The Environment Variables tab for the CognitoCustomMessage Lambda](./img/document-console-custommessage-before.png)

**3. Update the REDIRECT_URI Environment Variable**

The value should be set to the base URL of your container running the Console docker image, such as `http://localhost` or an EC2 instance URL (if you are running the container on EC2).

![Setting the REDIRECT_URI Environment Variable for the CognitoCustomMessage Lambda](./img/document-console-custommessage-after.png)

**4. Create the Initial Amazon Cognito User**

You can find instructions on creating a user in the [API Security section](/docs/platform/api_security#add-user-to-site). Once you've created your user, the Welcome Email sent to that user should now provide a working link to allow the setting of the password.


## Customizations

The source code to the FormKiQ Document Console is available via its [GitHub page](https://github.com/formkiq/formkiq-document-console).
