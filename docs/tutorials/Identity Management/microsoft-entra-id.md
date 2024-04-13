---
sidebar_position: 1
---

# Microsoft Entra ID

This tutorial show you how to integrate [Microsoft Entra ID](https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-id) (formerly known as "Microsoft Azure Active Directory") as the identity management provider for your FormKiQ installation.

We will be:

* Configuring a Enterprise application in Microsoft Entra ID

* Adding an Identify Provider into [Amazon Cognito](https://aws.amazon.com/pm/cognito)

* Mapping Microsoft Entra ID groups to Amazon Cognito groups

## What you’ll need

* Access to a FormKiQ Pro or FormKiQ Enterprise installation

* Administrative access to a Microsoft Entra ID service

* Administrative access to a FormKiQ Pro or FormKiQ Enterprise installation


## Pre-requisite

You will need these specific configuration values:

* CognitoUserPoolId

* Console URL

* Cognito domain

The CognitoUserPoolId and Console URL can be found in the `Outputs` tab of your FormKiQ [CloudFormation](https://console.aws.amazon.com/cloudformation) installation

![Cognito User Pool Id and Console Url](./img/entra-id-cf-outputs.png)

The Cognito domain can be found by clicking on the Cognito User Pool found on the [Cognito Console](https://console.aws.amazon.com/cognito/v2/idp/user-pools).

![Cognito Domain](./img/entra-id-cognito-domain.png)

## Microsoft Entra ID

The next step is to create an Enterprise application in Microsoft Entra ID. This application will be connected to Amazon Cognito and will provide authentication for the users.

### Add an Azure Enterprise Application

To configure the Enterprise Application:

* Login into the Azure Portal and open the `Microsoft Entra ID` service

* Select "Enterprise applications" from the left menu and click `New application`

* Select "Create your own application", and give your application a name, and then click `Create`

### Single Sign-On configuration

Now that the application is created, we will be configuring `Single sign-on` using `SAML`.

* Select `Single sign-on` from the menu and then choose the `SAML` single sign-on method

![Basic Saml Configuration](./img/entra-id-saml-method.png)

Once the single sign-on is created, you will need to fill in the `Identifier (Entity ID)` and the `Reply URL`.

![Basic Saml Configuration](./img/entra-id-saml-configuration.png)

The format of the Identifier (Entity ID) is:

```
urn:amazon:cognito:sp:<CognitoUserPoolId>

eg: urn:amazon:cognito:sp:us-east-2_MEhz4EzAZ
```

The Reply URL is: `Your Cognito Domain`/saml2/idpresponse, for example:
```
https://formkiq-enterprise-dev-1111111111111.auth.us-east-2.amazoncognito.com/saml2/idpresponse
```

### Group Claims

Next, we need to configure the Attributes & Claims for the SAML response. The default attributes will work well, but we will need to add a group claim so FormKiQ knows what access to provide each user.

![Saml Attributes & Claims](./img/entra-id-saml-attributes-claims.png)

* Click the `Edit` button

* Click the `Add a group claim`

![Saml Group Claims](./img/entra-id-saml-group-claims.png)

Here you can configure which groups will be returned with the SAML response.

* Select `Groups assigned to the application`

* Change the Source attribute to `Cloud-only group display names`

:::note
Depending on your Azure subscription level, **Cloud-only group display names** may not be available. If this is the case, see the section "Setup Group ID mapping"
:::

Under the SAML Certificates, make note of the **App Federation Metadata Url**, as that will be needed in the next step.

## Amazon Cognito

Now, we will need to configure [Amazon Cognito](https://aws.amazon.com/pm/cognito) to connect to [Microsoft Entra ID](https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-id).

### Add Identity Provider 

We need to add [Microsoft Entra ID](https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-id) as an Identify Provider in [Amazon Cognito](https://aws.amazon.com/pm/cognito).


Open the [AWS Console](https://aws.amazon.com/) and Launch the CloudShell service.

![CloudShell](./img/entra-id-cloud-shell.png)

Once the CloudShell command prompt opens, use the AWS CLI to add a custom attribute. This attribute will contain the group claims attribute.

```
aws cognito-idp add-custom-attributes \
--user-pool-id <CognitoUserPoolId> \
--custom-attributes Name=groups,AttributeDataType="String"
```

Once again, using the AWS CLI, create the SAML identify provider:

```
aws cognito-idp create-identity-provider \
--user-pool-id <CognitoUserPoolId> \
--provider-name=azureidp \
--provider-type SAML \
--provider-details MetadataURL=<App Federation Metadata Url> \
--attribute-mapping email=http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress,groups=http://schemas.microsoft.com/ws/2008/06/identity/claims/groups
```

### Pre token generation

After a successful login, we need to modify the access token and add the user's Microsoft Entra Id groups into the token. FormKiQ comes with an function that does this automatically; we just need to configure it in the Amazon Cognito.

* Visit the Amazon Cognito console 
* Select the User Pool, and then the `User pool properties` tab
* Click `Add Lambda trigger`

![Cognito Lambda Trigger](./img/entra-id-cognito-pretoken.png)

Select `Authentication` and `Pre token generation trigger`

![Cognito Add Lambda Trigger](./img/entra-id-cognito-add-lambda-trigger.png)

FormKiQ deploys with a Lambda Trigger, if you search for "azure".

![Cognito Lambda Trigger](./img/entra-id-cognito-lambda-trigger.png)

Select the "azure" trigger and click `Add Lambda trigger`.

![Cognito Lambda Trigger](./img/entra-id-cognito-lambda-triggers.png)

### Cognito Hosted UI

Amazon Cognito Hosted UI provides a URL connection between Amazon Cognito and Microsoft Entra ID.

To configure Cognito Hosted UI, select the `App Integration` tab on the Cognito console.

![Cognito App Integration](./img/entra-id-cognito-app-integration.png)

Under the `Hosted UI` heading, select the `Edit` button to configure.

![Cognito Hosted UI](./img/entra-id-cognito-hosted-ui.png)

Set the `Console Url` as an allowed callback. This will allow the user to be redirected to the FormKiQ console after a successful login.

![Cognito Allowed Callbacks](./img/entra-id-cognito-hosted-ui-allowed-callback.png)

For the other properties:

* Choose Azure as the `Identity provider`

* Set the OAuth grant type to `Authorization code grant`

* Set the OpenID Connect scopes to: OpenID, Email, Profile

![Cognito Hosted UI Config](./img/entra-id-cognito-hosted-ui-config.png)

Once you save the configuration, you'll see the `View Hosted UI` button is now enabled. This is the link to login to FormKiQ.

## Summary

And there you have it! We have shown how easy it is to use Microsoft Entra ID as your authentication provider.

This is just the tip of the iceberg when it comes to working with the FormKiQ APIs.

If you have any questions, reach out to us on our https://github.com/formkiq/formkiq-core or https://formkiq.com.
