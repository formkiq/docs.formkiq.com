---
sidebar_position: 4
---

# Multi-Tenant vs Multi-Instance

FormKiQ Core supports usage as a multi-tenant application. This can be used for internal departments or teams, or for external clients. During deployment, a "default" SiteId is created; all documents are stored in that tenant by default.

To create another SiteId is as simple as adding a new [Cognito group to the user pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-user-groups.html).

Creating a Cognito Group with the same name as the SiteId but ending in "_read" will create a read-only group. The users in this group will have read-only access to documents within that SiteId.

See Tutorial <a href="/docs/tutorials/multitenant">Multi-Tenant Tutorial</a> for a walk through on how to use FormKiQ in a multi-tenant setup.

:::note
One possible use-case is to create a Cognito Group for each FormKiQ user (using their email address), which would create a SiteId for that user and a "My Documents" section in FormKiQ Document Console.
:::

Each API request has an optional "SiteId" parameter to specify which SiteId you would like to use.

:::note
This parameter is only needed if a user belongs to multiple SiteIds or if the user is in the "Admins" Group (full access) and wants to perform an operation in a SiteId other than "default". This allows groups such as external clients to access documents without requiring knowledge of their SiteId.
:::