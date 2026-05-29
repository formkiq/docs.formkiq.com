---
sidebar_position: 4
title: Multi-Tenant and Multi-Instance Deployments
---

# Multi-Tenant and Multi-Instance Deployments

## Overview

FormKiQ supports multiple ways to separate documents, users, and operational responsibility. The right model depends on how much isolation you need for security, compliance, cost tracking, data residency, and administration.

The two most common patterns are:

- **Multi-tenant deployment**: One FormKiQ deployment contains multiple sites. Each site acts as a tenant boundary inside the same stack.
- **Multi-instance deployment**: Separate FormKiQ deployments are created for different customers, business units, environments, AWS accounts, or AWS regions.

FormKiQ Core supports multi-tenant deployments using sites. Essentials, Advanced, and Enterprise add more flexible role and site management options through Defined Sites.

## Key Terms

| Term | Meaning |
| --- | --- |
| Deployment | A FormKiQ CloudFormation stack and its supporting AWS resources. |
| Instance | A separate FormKiQ deployment. In practice, this usually means a separate stack, and sometimes a separate AWS account or region. |
| Site | A FormKiQ document partition identified by `siteId`. A site is the tenant boundary inside one deployment. |
| Tenant | A business, department, customer, or user group represented by a FormKiQ site. |
| Group | An identity-provider group, such as an Amazon Cognito group, used to assign site access. |
| Automatic Sites | A mode where FormKiQ creates or maps sites from identity-provider group names. |
| Defined Sites | A mode where sites are created explicitly and group permissions are assigned through the API. |

By default, FormKiQ creates a `default` site during deployment. Documents are stored in the `default` site unless another `siteId` is specified or inferred from the authenticated user's permissions.

## Decision Guide

Use this table to choose between sites in one deployment and separate FormKiQ instances.

| Requirement | Use multi-tenant sites | Use separate instances |
| --- | --- | --- |
| Separate departments in one organization | Usually best fit | Use only if departments need strict infrastructure isolation. |
| External customer tenants | Good for shared-platform SaaS-style models | Better when customers require separate AWS accounts, regions, billing, or operational boundaries. |
| Different AWS regions for residency | Not enough by itself | Best fit. Deploy one instance per required region. |
| Different AWS accounts or billing boundaries | Not enough by itself | Best fit. Deploy one instance per account or billing boundary. |
| Different compliance programs or audit scopes | Good for light separation | Better when audits require environment-level isolation. |
| Lower AWS operating cost | Usually lower cost | Higher cost because each instance runs its own resources. |
| Lower operational overhead | Usually simpler | More operational overhead because each instance must be deployed, updated, monitored, and backed up. |
| Strongest blast-radius isolation | Shared stack and shared service limits | Best fit. Failures, permissions, and quotas can be isolated per instance. |
| Custom configuration per tenant | Limited by shared deployment settings | Best fit when tenants need different modules, regions, domains, encryption, or operational policies. |

In short: use **sites** when tenants can safely share one FormKiQ deployment, and use **separate instances** when infrastructure, region, compliance, billing, or operational isolation matters more than shared administration.

## Multi-Tenant Sites in One Deployment

In a multi-tenant FormKiQ deployment, each tenant is represented by a `siteId`. Site-level permissions determine which users and systems can access documents in each site.

This pattern works well for:

- Departments inside one organization
- Internal teams with separate document repositories
- Customer workspaces in a shared platform
- Personal document spaces
- Development or testing scenarios where strict infrastructure isolation is not required

Multi-tenant sites share the same FormKiQ deployment, AWS account, AWS region, API endpoints, and core platform configuration. They can still have separate users, groups, permissions, documents, metadata, and workflows.

For the full security model, see [Security](/docs/platform/security).

## Automatic Sites

Automatic Sites is the default FormKiQ site model. In this mode, FormKiQ creates or maps sites based on Amazon Cognito groups or roles from another identity provider.

The group name determines the site and permission level.

| Group name | Result |
| --- | --- |
| `default` | Read, write, and delete access to the `default` site. |
| `marketing` | Read, write, and delete access to the `marketing` site. |
| `marketing_read` | Read-only access to the `marketing` site. |
| `marketing_govern` | Read, write, delete, and govern access to the `marketing` site. |
| `Admins` | Administrator access across all sites. |
| `authentication_only` | User can authenticate but has no site access. |

### Creating a New Tenant

The simplest way to create a new tenant is to create a group in the user pool. This can be done through the FormKiQ Console, FormKiQ API, or Amazon Cognito.

For example:

1. Create a Cognito group named `marketing`.
2. Add users to the `marketing` group.
3. Those users can access documents in the `marketing` site.

To give users read-only access, create a group named `marketing_read` and add users to that group.

For user and group setup steps, see [Role-Based Access Control](/docs/platform/security#role-based-access-control-rbac).

## Defined Sites

Defined Sites provide more explicit control over sites and permissions. Instead of deriving sites directly from identity-provider group names, you create sites through the API and assign group permissions to those sites.

Defined Sites are available in FormKiQ Essentials, Advanced, and Enterprise.

Defined Sites can be a better fit when:

- A group needs access to multiple sites.
- Site names should not be tied directly to identity-provider group names.
- Permissions need to be managed through the API.
- You need permission levels such as `READ`, `WRITE`, `DELETE`, `GOVERN`, and `ADMIN`.
- You want a clearer administrative model for larger deployments.

:::note
Using Defined Sites access control requires upgrading the Cognito user pool from Lite to Essentials.
:::

### Enabling Defined Sites

Defined Sites can be enabled by updating your FormKiQ Essentials, Advanced, or Enterprise CloudFormation stack. When updating the stack, change the site access configuration from Automatic Sites to Defined Sites.

:::caution
After switching to Defined Sites, users will no longer automatically have access to sites that were based only on Cognito group names, such as `default`. Create the required defined sites and permissions immediately after the switch.
:::

You can create one or more new sites using an administrator user through the JWT API or through the IAM API if IAM access has been configured. For IAM setup, see [Setting Up IAM Authorization](/docs/platform/security#setting-up-iam-authorization).

At this time, the FormKiQ Document Console does not provide access to users without sites. If the administrator user has no site after switching to Defined Sites, log in through the API. See [Logging in for JWT Authentication](/docs/how-tos/jwt-authentication-token).

Once authorization is ready, create a new site using [`POST /sites`](/docs/api-reference/add-site).

:::note
If you already have documents in an automatic site such as `default`, create a defined site named `default` using `POST /sites`. This restores access to the existing documents through the defined-site model.
:::

### Assigning Defined Site Permissions

Use `PUT /sites/:siteId/groups/:groupName/permissions` to assign permissions to a group for a site.

For example, to give the `employees` group read and write access to the `projects` site:

```http
PUT /sites/projects/groups/employees/permissions
```

```json
{
  "permissions": ["READ", "WRITE"]
}
```

For more details, see [Defined Site Permissions](/docs/platform/security#defined-site-permissions).

## Multi-Instance Deployment Patterns

A multi-instance deployment uses more than one FormKiQ stack. Each instance has its own AWS resources, configuration, APIs, storage, users, operational monitoring, and backup plan unless you intentionally integrate them.

### Separate AWS Accounts

Deploying separate instances into separate AWS accounts provides stronger administrative and billing isolation.

Use this pattern when:

- Different business units need separate billing or cost allocation.
- Production, staging, and development must be strongly separated.
- A customer or department requires its own AWS account boundary.
- IAM, CloudTrail, backup, or incident response controls must be managed separately.

### Separate AWS Regions

Deploying separate instances into separate AWS regions supports data residency and regional availability requirements.

Use this pattern when:

- Documents must remain in a specific country or region.
- Regional teams require separate operational control.
- Backups, logs, indexes, and exports must remain in-region.
- Cross-region data movement must be minimized or explicitly governed.

For residency planning, see [Compliance, Data Residency, and Data Sovereignty](/docs/platform/compliance-data-residency-and-data-sovereignty).

### Separate Customer or Environment Stacks

Some organizations deploy a separate FormKiQ stack for each customer, environment, or high-value workload.

Use this pattern when:

- Tenants need different FormKiQ modules or configuration.
- Tenants have different encryption, domain, backup, or integration requirements.
- A customer requires a dedicated environment.
- You want upgrades and maintenance windows to be controlled per tenant or workload.

## API Usage with `siteId`

Each API request can include an optional `siteId` parameter to specify the target site.

You usually need to include `siteId` when:

- A user belongs to multiple sites.
- An administrator in the `Admins` group needs to access a site other than `default`.
- A backend service needs to operate on a specific tenant.
- A test or integration should avoid relying on default site inference.

When a user has access to only one site, FormKiQ can often infer the site from that user's permissions. This allows external users to work with their documents without needing to know the internal `siteId`.

## Migration Notes: Automatic Sites to Defined Sites

Before switching from Automatic Sites to Defined Sites:

- List existing sites and group names.
- Identify documents currently stored in automatic sites such as `default`.
- Decide which defined sites must be created after the switch.
- Decide which groups should receive `READ`, `WRITE`, `DELETE`, `GOVERN`, or `ADMIN` permissions.
- Confirm administrator API access using JWT or IAM.
- Plan a short validation window after the CloudFormation update.

After switching:

1. Create the required sites with `POST /sites`.
2. Assign group permissions for each site.
3. Confirm administrator access.
4. Confirm normal user access.
5. Test document list, upload, download, search, and delete operations for each site.
6. Update integration configuration if any callers depend on specific `siteId` values.

## Common Use Cases

### Department Segregation

Create separate sites for departments such as `finance`, `legal`, `operations`, and `hr`. This keeps documents separated while allowing approved cross-department access through group permissions.

### Customer Workspaces

Create one site per customer when customers can share the same FormKiQ deployment and AWS region. Use separate instances instead when customers require dedicated infrastructure, region, account, encryption, backup, or compliance boundaries.

### Personal Document Spaces

Personal document spaces can be modeled with one site per user or one shared site with document attributes and permissions. Avoid using email addresses as long-term site identifiers unless your identity lifecycle process accounts for user renames, deleted accounts, and privacy requirements.

### Regional Data Boundaries

Use separate FormKiQ instances in separate AWS regions when documents must remain within specific regional boundaries. Use sites only for logical separation inside a region, not as a substitute for regional infrastructure isolation.

## Where to Go Next

- [Security](/docs/platform/security)
- [Compliance, Data Residency, and Data Sovereignty](/docs/platform/compliance-data-residency-and-data-sovereignty)
- [Document Console](/docs/platform/document_console)
- [API Walkthrough](/docs/getting-started/api-walkthrough)
- [Multi-Tenant Tutorial](/docs/tutorials/multitenant)
