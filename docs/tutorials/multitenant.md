---
sidebar_position: 40
---

# Multi-Tenant Users

## What You Will Build

FormKiQ supports multi-tenant environments where you can set up multiple groups of users and provide each group of users access to their specific documents. This is done through a `siteId`. In this tutorial we are going to create two different siteIds, and then add both users and documents to each siteId.

You will create a new tenant site ID using Cognito groups, create a user, assign that user to the tenant, and verify that the user can add documents to that tenant.

## Before You Begin

- Access to a FormKiQ installation that uses Amazon Cognito.
- Administrative access to the Cognito User Pool.
- An email address for a test user.

## Workflow Overview

1. Create tenant Cognito groups.
2. Create a tenant user.
3. Add the user to the tenant group.
4. Have the user complete setup and sign in.
5. Upload a document as the tenant user.
6. Verify the document appears only in that tenant context.

## Step 1: Create Cognito Groups

To create a `SiteId`, start by visiting the [Amazon Cognito Console](https://console.aws.amazon.com/cognito) and select the `User pool name` matching your naming of your FormKiQ installation.

![Cognito User Pools](./img/cognito-user-pools.png)

Select the `Groups` tab and you'll see the Cognito groups that FormKiQ creates during installation. Each group is a `siteId` (except for the Admins) group.

![FormKiQ default Cognito Groups](./img/cognito-groups-default.png)

### Create Tenant

We are now going to create a siteId named `site1`. This involves creating two Cognito groups.

Select the `Create group` button. 

The first group will be called `site1`. This group will give users read/write access to documents in the `site1` siteId. 

Enter the Group name of `site1` and click `Create group` button.

![Cognito Group Site1](./img/cognito-group-site1.png)

The second group will be called `site1_read`. This group will give users read-only access to documents in the `site1` siteId. 

Enter the Group name of `site1_read` and click `Create group` button.

![Cognito Group Site1 Read](./img/cognito-group-site1-read.png)

Now you'll see the `site1` and `site1_read` Cognito groups listed in the Cognito User Pool.

![Cognito User Pools Site1](./img/cognito-user-pools-site1.png)

## Step 2: Create Cognito Users

The administrator created during the FormKiQ installation was placed in the `default` siteId. Now that the `site1` Cognito group has been created, we are now going to create a new user and add that user to the `site1` Cognito group. This means we will end up with two users, each in their own `siteId` group.

Click the `Create user` button to add a new user.

![Cognito Users Tab](./img/cognito-users-tab.png)

On the *Create User* page, 

* enter the `Email Address` of the user to create 
* select `Send an email invitation`
* click `Mark email address as verified`
* select `Generate a password`

Click the `Create user` button to finish creating the new user. The user receive an email at the specified email address, with a link to finalize setting up their account.

![Cognito Create User](./img/cognito-create-user.png)

You'll now see both the user you just created and the administration user listed.

![Cognito User List](./img/cognito-user-list.png)

Click your newly-created user and scroll down to the `User Group Membership`. At this point, the user does not belong to any groups/siteIds.

![User Group Membership](./img/user-group-membership.png)

Click `Add user to group` and select `site1`. Click the `Add` button.

![Add User to Group](./img/add-user-to-group.png)

The user is now a member of `site1`.

![Add User to Group](./img/user-group-site1.png)

Lastly, ask your newly-created user to check their inbox for the `Welcome to FormKiQ` email. They can click the link within the email to finalize their account; this link will open the FormKiQ Console and will allow the newly-created user to set a password for their account.

````
Welcome to FormKiQ

Your account has been created. *Click this link to finalize your account*.
`````

## Step 3: Add a New Document as the Site User

Once logged into the FormKiQ Console, the user can click `Add Documents` from the menu on the left side of the screen. They can drag and drop a file into the `Upload New` box. Once the document has been uploaded, it will be displayed in the *Documents Added* table.

![Add Document to Site1](./img/add-document-site1.png)

Clicking on `Recent Documents` from the left menu will display the newly-added document.

![Site 1 Documents](./img/site1-documents.png)

## Verify the Result

Throughout this tutorial, you have successfully created a new FormKiQ user in Cognito. The newly created user was attached to a new siteId and was able to successfully add a document to this newly created siteId.

Confirm that the document uploaded by the `site1` user appears in `site1` and does not appear in the default site for users who do not belong to `site1`.

## Clean Up

Remove the test user and tenant groups if they were only created for this tutorial.

## Troubleshooting

| Problem | Likely cause | What to check |
| --- | --- | --- |
| User cannot see tenant documents | User is not in the correct Cognito group. | Confirm membership in the `site1` group. |
| User has read-only access | User is only in the `_read` group. | Add the user to the write group for that site ID. |
| User invitation does not arrive | Email delivery or user pool settings issue. | Check Cognito user status and resend invitation if needed. |

## Next Steps

- [Multi-Tenant and Multi-Instance Deployments](/docs/platform/multi-tenant-vs-multi-instance)
- [Security](/docs/platform/security)
