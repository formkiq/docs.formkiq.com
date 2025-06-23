---
sidebar_position: 4
---

# Multi-Tenant and Multi-Instance Deployments

FormKiQ Core supports multi-tenant deployments, allowing you to partition your document management system for different departments, teams, or external clients. By default, FormKiQ creates a "default" SiteId during deployment where all documents are stored unless specified otherwise.

## Creating New Tenants

The simplest way to create a new tenant is by adding a Cognito group to your user pool. This can be done via the FormKiQ API, FormKiQ Console, or directly in AWS Cognito. The group name becomes the SiteId for that tenant.

### Read-Only Access
To create a read-only tenant, append "_read" to the Cognito group name. For example, if your SiteId is "marketing", creating a Cognito group named "marketing_read" will give its users read-only access to documents within the "marketing" SiteId.

## Advanced RBAC Options
FormKiQ Essentials, Advanced, and Enterprise editions offer enhanced Role-Based Access Control (RBAC) through the "defined sites" feature:

- Create sites independently of Cognito groups
- Define groups with flexible permissions across sites
- Available permission levels: READ, WRITE, DELETE, GOVERN, and ADMIN
- **NOTE: Using Defined Sites access control requires an upgrade of the Cognito User Pool from "Lite" to "Essentials"**

By default, FormKiQ uses an "Automatic Sites" configuration. In this mode, FormKiQ's sites are created from Amazon Cognito Groups (or based on roles from a different Single Sign-On provider). This enables the JWT API to provide role-based access control, and allows for readonly users, users with read, write, and delete permissions, and a installation-wide admin permission that enables full access to all sites and functionality.

For more granular control, a "Defined Sites" configuration can be enabled, where sites are created independently of Cognito or other identity providers. This opens up the ability to create roles that can be assigned to multiple sites, with the additional permission options listed above.

### Enabling Defined Sites

Defined Sites can be enabled by updating your FormKiQ Essentials, Advanced, or Enterprise CloudFormation template. When updating existing stack, you will see a drop-down option to change from Automatic Sites to Defined Sites.

Once you have updated the CloudFormation stack, you will no longer have access to any sites that were based on Cognito groups, such as `default`.

You will need to create one or more new sites using an Admin user using the JWT API (such as the user created when the stack was first deployed) or through the IAM API, if you have set up access. ([Setting up IAM Authorization](/docs/platform/security#setting-up-iam-authorization))

At this time, the FormKiQ Document Console does not provide access to users without sites, so if you are using the Admin user via JWT, you will need to login using the API. ([Logging in for JWT Authentication](/docs/how-tos/jwt-authentication-token))

Once you have your authorization ready, you can create a new site using [`POST /sites`](/docs/api-reference/add-site)

:::note
When switching to Defined Sites, if you have documents already in automatic sites such as `default` you can simply create a FormKiQ site via `POST /sites` named `default`. This will restore access to the existing documents.
:::

## API Usage

Each API request accepts an optional `siteId` parameter to specify the target tenant. You only need to include this parameter when:
- A user belongs to multiple SiteIds
- An admin user (in the "Admins" Group) needs to access a SiteId other than "default"

This design allows external clients to access their documents without knowing their specific SiteId.

## Common Use Cases

### Personal Document Spaces
You can create individual document spaces by creating a Cognito Group for each user using their email address. This enables a "My Documents" section in FormKiQ Document Console where users can manage their personal documents.

### Department Segregation
Create separate tenants for different departments to maintain document isolation while allowing cross-department access when needed through appropriate group permissions.

For detailed implementation steps, see our [Multi-Tenant Tutorial](/docs/tutorials/multitenant).