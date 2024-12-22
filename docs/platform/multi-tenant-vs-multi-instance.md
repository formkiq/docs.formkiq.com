---
sidebar_position: 4
---

# Multi-Tenant and Multi-Instance Deployments

FormKiQ Core supports multi-tenant deployments, allowing you to partition your document management system for different departments, teams, or external clients. By default, FormKiQ creates a "default" SiteId during deployment where all documents are stored unless specified otherwise.

## Creating New Tenants

The simplest way to create a new tenant is by adding a Cognito group to your user pool. This can be done via the FormKiQ API, FormKiQ Console, or directly in AWS Cognito. The group name becomes the SiteId for that tenant.

### Read-Only Access
To create a read-only tenant, append "_read" to the Cognito group name. For example, if your SiteId is "marketing", creating a Cognito group named "marketing_read" will give its users read-only access to documents within the "marketing" SiteId.

### Advanced RBAC Options
FormKiQ Essentials, Advanced, and Enterprise editions offer enhanced Role-Based Access Control (RBAC) through the "defined sites" feature:

- Create sites independently of Cognito groups
- Define groups with flexible permissions across sites
- Available permission levels: READ, WRITE, DELETE, GOVERN, and ADMIN

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