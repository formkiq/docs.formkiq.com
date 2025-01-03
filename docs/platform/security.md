---
sidebar_position: 3
---

# Security

## Overview

FormKiQ is designed with a robust security framework to safeguard access to documents, prioritizing protection measures at every layer of its architecture. FormKiQ supports advanced access control mechanisms using Role-Based Access Control (RBAC) with [Amazon Cognito Groups](https://aws.amazon.com/cognito) and Attribute-Based Access Control (ABAC) through [Open Policy Agent (OPA)](https://www.openpolicyagent.org/). These features ensure users have appropriate access to documents based on their roles and specific attributes.

:::note
By default the `AdminEmail` configured during the installation process is setup as an administrator with full access
:::

## Data Security

FormKiQ implements comprehensive security through encryption, access controls, and authentication:

### Encryption in Transit
All data transmissions are encrypted using:
- TLS 1.2 or higher
- HTTPS-only endpoints
- API Gateway managed certificates

### Encryption at Rest
FormKiQ Essentials, Advanced, and Enterprise offerings use AWS-managed encryption services for:

- Document Storage (S3)
- Metadata Storage (DynamoDB)
- Search Index (OpenSearch, part of the Enhanced Full-Text Search Add-On Module)

## Role-Based Access Control (RBAC)

FormKiQ supports multi-tenancy environments by defining user group(s) and then linking these groups to the different FormKiQ site(s). Each user can be associated with one or more groups, reflecting their role or responsibilities within the platform. These groups, in turn, determine the user's access privileges across different sites within the platform.

The user's groups link to the FormKiQ's sites that the user will be granted access to; users can be in one or more groups, granting access to specific sites with specified roles.

| Group | Description
| -------- | ------- |
| Admins | Administrator group access |
| authentication_only | Authentication only group access |
| **site name** | Read/Write/Delete access to **site_name** |
| **site name**_read | Read access to site **site_name** |


FormKiQ comes with 4 groups by default. 

* **Admins** - Users in this group have full administrative privileges to all sites

* **authentication_only** - Users in this group can authenticate and receive a access token, but do not have access to any sites. Used mainly with the Document Sharing API to share specific folders / documents with a user

* **default** - The "default" FormKiQ site that is created on installation. Users in this group will have read/write/delete access to the "default" site.

* **default_read** - The "default" FormKiQ site that is created on installation. Users in this group will have read access to the "default" site.

Here is what the groups in [Amazon Cognito](https://aws.amazon.com/cognito) looks like by default.

![Security Roles Example](./img/security-roles-examples.png)

:::note
The Cognito User pool can be found by visiting the [Cognito Console](https://console.aws.amazon.com/cognito) page and searching for the `AppEnvironment` name you configured during installation.

![Cognito Home](./img/cognito-home.png)
:::

### Add Multi-Tenant Site

Creating a new Multi-Tenant Site is as easy as creating a new group and adding users to the group.

To add a new group:

* Open the FormKiQ Console as an Administrator
* Click on the **Groups** menu option under the **Administration** left menu
* Click **Create New Group** and enter the name of the group

![Console Add Group](./img/fk-console-add-group.png)

The site has now been created and you can add users to this group to give them access to the finance site.

### Add User to Site

To add a new user:

* Open the FormKiQ Console as an Administrator
* Click on the **Users** menu option under the **Administration** left menu
* Click **Create New User** and enter the name of the user

![Console Add User](./img/fk-console-add-user.png)

### Add User to Group

To add a user to a group:

* Open the FormKiQ Console as an Administrator
* Click on the **Groups** menu option under the **Administration** left menu
* Click the far right menu on the Group you want to add the user to and click Add Member

![Console Add User](./img/fk-console-add-group-add-members.png)

You can search for the user and add it to the group.

![Console Add User](./img/fk-console-add-group-add-member.png)

## Attribute-Based Access Control (ABAC)

Attribute-Based Access Control (ABAC) is a dynamic and flexible method of managing access permissions based on the evaluation of attributes related to the user, the resource, and the environment. Unlike Role-Based Access Control (RBAC), which assigns permissions based on predefined roles, ABAC uses policies that evaluate various attributes to determine access rights.

FormKiQ's ABAC is implemented using [Open Policy Agent (OPA)](https://www.openpolicyagent.org/). OPA is an open-source, general-purpose policy engine that allows for fine-grained access control based on user attributes and other contextual information. ABAC enables dynamic and context-aware access control policies.

### Evaluation Policies

[Open Policy Agent (OPA)](https://www.openpolicyagent.org/) evaluates the policies and returns decisions based on the evaluation. The evaluation outcomes in OPA are `allow`, `deny`, and `partial`.

#### Allow

The allow policy in OPA explicitly grants access to a document. This decision is made when the conditions specified in the policy are met. For example, a policy might allow access if a user has the appropriate role or attribute, or if the request is made during certain hours.

```
package example

default allow = false

allow {
    input.user.role == "admin"
}
```

#### Deny

The deny policy in OPA explicitly denies access to a resource. This decision is made when the conditions specified in the policy are met. Deny policies can be used to enforce restrictions that override any allow policies.

```
package example

default deny = false

deny {
    "guest" in input.user.roles
}
deny {
    "guest" in input.user.roles
    data.documents.documentType == "private"
}
```

#### Partial

OPA's partial evaluation feature allows for the computation of policy decisions based on the attributes attached to a document or resource. Partial evaluation generates a list of criteria that need to be met to gain access to the document or resource.

The OPA policy below restricts access to users in the "guest" role to documents whose `documentType` attribute is "public".

```
package example

default allow = false

allow {
    "guest" in input.user.roles
    data.documents.documentType == "public"
}
```

#### Partial Limitations

Due to OPA's partial evaluation flexibility there are some limitation to be aware of.

When using searching for documents using POST `/search`, if you are using multiple attributes criteria you will need to have an attribute `composite key` configured to enable DynamoDb to search for the criteria. Alternatively using POST `/searchFulltext` uses OpenSearch and does not have such limitation.

:::note
Attribute-Based Access Control (ABAC) is only supported when using [FormKiQ Advanced/Enterprise](https://www.formkiq.com/products/formkiq-advanced).
:::

## API Endpoints 

The FormKiQ API is built on top of [AWS API Gateway](https://aws.amazon.com/api-gateway/). API Gateway offers the flexibility to empowers customers to choose the most suitable authentication and authorization methods based on their specific application requirements. 

By default FormKiQ API supports 3 different types of authorization:

* JSON Web Token(JWT) Authorizers

* Amazon Identity and Access Management (IAM) authorization

* API Key authorization

![Authentication](./img/formkiq_authentication.png)

FormKiQ supports these different authorization mechanisms by deplying multiple copies of the API. This allows you to use the authentication mechanism that suits your needs.

The FormKiQ API URL(s) can be found in the CloudFormation outputs of your FormKiQ stack.

![CloudFormation Outputs API Urls](./img/cf-outputs-apiurls.png)

:::note
[FormKiQ Enterprise](https://www.formkiq.com/products/formkiq-enterprise) users have additional authentication options like Security Assertion Markup Language (SAML) or custom authentication mechanisms
:::

### JSON Web Token(JWT) Authorizers

JWT authentication, also known as [JSON Web Token](https://jwt.io/introduction) authentication, is a method used to verify the identity of users or systems accessing web applications or APIs. It is based on the use of digitally signed tokens containing encoded claims about the user's identity and permissions. 

By default, FormKiQ uses [Amazon Cognito](https://aws.amazon.com/cognito) as the JWT Issuer and authorization is handled through role-based access control assigned to each user.

The API that uses the JWT authentication can be found in the CloudFormation Outputs of the FormKiQ installation under the `HttpApiUrl` key.

![CloudFormation Outputs API Urls](./img/cf-outputs-apiurls.png)

### Amazon Identity and Access Management (IAM) authorization

[IAM Authentication](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-access-control-iam.html) allows customers to call the FormKiQ API by signing requests using [Signature Version 4](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_aws-signing.html) with AWS credentials. 

IAM Authentication is typically used for machine-to-machine authorization as there is no user information inside of the token.

The API that uses the IAM authentication can be found in the CloudFormation Outputs of the FormKiQ installation under the `IamApiUrl` key.

![CloudFormation Outputs API Urls](./img/cf-outputs-apiurls.png)

:::note
You need the IAM execute-api permission to be able to use IAM Authentication and all requests will be run with administration privileges.

**For more information on creating this IAM User, please [see the instructions in our API Walkthrough](/docs/getting-started/api-walkthrough/#aws-iam).**
:::

### API Key

FormKiQ allows for the generating of an API key that can be used to access the FormKiQ API for a particular `SiteId`.

The API key can be generated using the `POST /configuration/apiKeys` API endpoint using credentials with `administrator` privileges.

The API that uses the Key authentication can be found in the CloudFormation Outputs of the FormKiQ installation under the `KeyApiUrl` key.

![CloudFormation Outputs API Urls](./img/cf-outputs-apiurls.png)

:::note
Each API key is only valid for a particular SiteId.
:::
