---
sidebar_position: 2
---

# Google Workspace

This tutorial show you how to integrate [Google Workspace](https://workspace.google.com) as the identity management provider for your FormKiQ installation.

We will be:

* Configuring a Web and mobile apps in Google Workspace

* Adding an Identify Provider into [Amazon Cognito](https://aws.amazon.com/pm/cognito)

## What you’ll need

* Access to a FormKiQ Pro or FormKiQ Enterprise installation

* Administrative access to a Google Workspace

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

## Google Workspace

The next step is to create an Web and mobile apps in Google Workspace. This application will be connected to Amazon Cognito and will provide authentication for the users.

### Add Web and mobile apps

To configure the Web and mobile apps:

* Login into the Google Workspace and select the `Web and Mobile Apps` service

![Web and Mobile Apps](./img/google-workspace-web-and-mobile-apps.png)

* Select "Add App" from the menu and click `Add custom SAML app`

![Add Saml App](./img/google-workspace-add-saml-app.png)

### Single Sign-On configuration

Now configure the SAML application by entering an Application name, description and logo.

![App Details](./img/google-workspace-app-details.png)

Once the single sign-on is created, you will need to fill in the `ACS URL` and the `Entity ID`.

The ACS URL is: `Your Cognito Domain`/saml2/idpresponse, for example:
```
https://formkiq-enterprise-dev-1111111111111.auth.us-east-2.amazoncognito.com/saml2/idpresponse
```

The format of the Identifier (Entity ID) is:

```
urn:amazon:cognito:sp:<CognitoUserPoolId>

eg: urn:amazon:cognito:sp:us-east-2_MEhz4EzAZ
```

![Saml Configuration](./img/google-workspace-service-provider-details.png)

Setup the Primary email with the App attribute of

```
http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress
```

Under the group membership select all the Group google you want to be part of the access token and set the App attribute to be:

```
http://schemas.microsoft.com/ws/2008/06/identity/claims/groups
```

![SAML Service Attributes](./img/google-workspace-service-attributes.png)

The app is created but `User access` is OFF for everyone. Click the `User access` to enable. Once the `User access` is enabled, make sure to `Download Metadata`, this file will be needed when setting up the Identity Provider in Cognito.

![App created](./img/google-workspace-app-disabled.png)

![App created](./img/google-workspace-app-enabled.png)

## Amazon Cognito

Now, we will need to configure [Amazon Cognito](https://aws.amazon.com/pm/cognito) to connect to Google Workspace.

### Add Identity Provider 

We need to add [Google Workspace](https://workspace.google.com) as an Identify Provider in [Amazon Cognito](https://aws.amazon.com/pm/cognito).

Open the [AWS Console](https://aws.amazon.com/) and Launch the CloudShell service.

![CloudShell](./img/entra-id-cloud-shell.png)

Once the CloudShell command prompt opens, use the AWS CLI to add a custom attribute. This attribute will contain the group claims attribute.

```
aws cognito-idp add-custom-attributes \
--user-pool-id <CognitoUserPoolId> \
--custom-attributes Name=groups,AttributeDataType="String"
```

* Visit the Amazon Cognito console 
* Select the User Pool, and then the `Cognito Sign In Experience` tab
* Click the `Add identity provider`

![Cognito Sign In Experience](./img/cognito-sign-in-experience.png)

Select the `SAML` Identity provider.

![Cognito Add Provider](./img/cognito-add-provider.png)

Give the provider a name, such as **googleidp**.

![Cognito Setup Provider Name](./img/cognito-setup-provider-name.png)

Upload the Metadata document you downloaded from Google Workspace.

![Cognito Upload Metadata document](./img/cognito-upload-metadata-document.png)

Configure the SAML attributes. 

For the email attribute, set the SAML attribute to

```
http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress
```

For the custom:groups attribute, set the SAML attribute to

```
http://schemas.microsoft.com/ws/2008/06/identity/claims/groups
```

![Cognito SAML Attributes](./img/cognito-saml-attributes.png)

### Pre token generation

After a successful login, we need to modify the access token and add the user's Microsoft Entra Id groups into the token. FormKiQ comes with an function that does this automatically; we just need to configure it in the Amazon Cognito.

* Visit the Amazon Cognito console 
* Select the User Pool, and then the `User pool properties` tab
* Click `Add Lambda trigger`

![Cognito Lambda Trigger](./img/entra-id-cognito-pretoken.png)

Select `Authentication` and `Pre token generation trigger`

![Cognito Add Lambda Trigger](./img/entra-id-cognito-add-lambda-trigger.png)

FormKiQ deploys with a Lambda Trigger, if you search for "google".

![Cognito Lambda Trigger](./img/google-workspace-cognito-lambda-trigger.png)

Select the "GoogleWorkspace" trigger and click `Add Lambda trigger`.

![Cognito Lambda Trigger](./img/google-workspace-cognito-lambda-triggers.png)

### Cognito Hosted UI

Amazon Cognito Hosted UI provides a URL connection between Amazon Cognito and Microsoft Entra ID.

To configure Cognito Hosted UI, select the `App Integration` tab on the Cognito console.

![Cognito App Integration](./img/entra-id-cognito-app-integration.png)

Under the `Hosted UI` heading, select the `Edit` button to configure.

![Cognito Hosted UI](./img/entra-id-cognito-hosted-ui.png)

Set the `Console Url` as an allowed callback. This will allow the user to be redirected to the FormKiQ console after a successful login.

![Cognito Allowed Callbacks](./img/entra-id-cognito-hosted-ui-allowed-callback.png)

For the other properties:

* Choose Google as the `Identity provider`

* Set the OAuth grant type to `Authorization code grant`

* Set the OpenID Connect scopes to: OpenID, Email, Profile

![Cognito Hosted UI Config](./img/google-workspace-cognito-hosted-ui-config.png)

Once you save the configuration, you'll see the `View Hosted UI` button is now enabled. This is the link to login to FormKiQ. Make note of the url and you will need to add it to the FormKiQ CloudFormation stack.

![Cognito Hosted UI URL](./img/entra-id-cognito-hosted-ui-url.png)

Once you have the Cognito Hosted UI Url. Visit the CloudFormation console and select to **Update** your FormKiQ installation stack.

![CloudFormation Update Stack](./img/entra-id-cloudformation-update.png)

Set the Cognito Single Sign On Url to the value of the Cognito Hosted UI.

![CloudFormation Cognito Single Sign On Url](./img/entra-id-cognito-single-sign-on-url.png)

Once the stack is updated you will see the **Single Sign-On** login button that will allow you to login through your SSO provider.

![Console Single Cognito Single Sign On](./img/entra-id-console-single-sign-on.png)

## Summary

And there you have it! We have shown how easy it is to use Google Workspace as your authentication provider.

This is just the tip of the iceberg when it comes to working with the FormKiQ APIs.

If you have any questions, reach out to us on our https://github.com/formkiq/formkiq-core or https://formkiq.com.
