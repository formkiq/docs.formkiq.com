---
sidebar_position: 2
---

# Quick Start (AWS)

**A quick start guide for deploying FormKiQ into your AWS account.**

![FormKiQ Architecture](./img/formkiq_architecture.png)

## Prerequisites

For this quickstart you will need access to an AWS account, preferably with administrator access. The FormKiQ installation will create a number of AWS services and using an account with administrator access will ensure you have the correct permissions.

If you do not have a AWS account, you can sign up for one at https://aws.amazon.com.

### AWS Lambda Concurrent Executions

Concurrent executions refer to the number of function invocations that are being handled simultaneously. Each time your Lambda function is invoked, a new instance of the function is created to handle the request. [AWS Lambda](https://aws.amazon.com/pm/lambda) imposes default concurrency limits to prevent misuse and manage resource allocation.

By default, AWS limits the number of concurrent executions for [Lambda](https://aws.amazon.com/pm/lambda) functions to **10** per AWS region. It is recommended that you request to have this increased to account default of **1000**.

#### Check Concurrent Executions

![Open CloudShell](./img/cloudshell.png)

Run **aws cli** command:

```
aws service-quotas get-service-quota --service-code lambda --quota-code L-B99A9384 --region <AWS_REGION>
```

Resulting **Value** shows the AWS Lambda Concurrent executions.

```
{
    "Quota": {
        "ServiceCode": "lambda",
        "ServiceName": "AWS Lambda",
        "QuotaCode": "L-B99A9384",
        "QuotaName": "Concurrent executions",
        "Value": 1000.0,
        "Unit": "None",
        ...
    }
}
```

:::note
This increase must be requested for each region FormKiQ will be deployed into.
:::

#### Request Concurrent Executions Increase

You can request this increase via the Service Quotas Dashboard:

| AWS Region    | Request Increase Link |
| -------- | ------- |
| us-east-1 | https://us-east-1.console.aws.amazon.com/servicequotas/home/services/lambda/quotas |
| us-east-2 | https://us-east-2.console.aws.amazon.com/servicequotas/home/services/lambda/quotas |
| us-west-2 | https://us-west-2.console.aws.amazon.com/servicequotas/home/services/lambda/quotas |
| ca-central-1 | https://ca-central-1.console.aws.amazon.com/servicequotas/home/services/lambda/quotas |
| eu-central-1 | https://eu-central-1.console.aws.amazon.com/servicequotas/home/services/lambda/quotas |
| eu-west-1 | https://eu-west-1.console.aws.amazon.com/servicequotas/home/services/lambda/quotas |
| eu-west-3 | https://eu-west-3.console.aws.amazon.com/servicequotas/home/services/lambda/quotas |
| ap-south-1 | https://ap-sout-1.console.aws.amazon.com/servicequotas/home/services/lambda/quotas |
| ap-southeast-1 | https://ap-southeast-1.console.aws.amazon.com/servicequotas/home/services/lambda/quotas |
| ap-southeast-2 | https://ap-southeast-2.console.aws.amazon.com/servicequotas/home/services/lambda/quotas |
| ap-northeast-2 | https://ap-northeast-2.console.aws.amazon.com/servicequotas/home/services/lambda/quotas |
| sa-east-1 | https://sa-east-1.console.aws.amazon.com/servicequotas/home/services/lambda/quotas |

For more information, please refer to this [AWS Tutorial on Requesting a Quota Increase](https://aws.amazon.com/getting-started/hands-on/request-service-quota-increase/).


### AWS Service Role For ECS

Before installation verify that the AWSServiceRoleForECS has been enabled on your AWS Account. 

![Open CloudShell](./img/cloudshell.png)

Run **aws cli** command:

```
aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com
```
:::note
You will receive a message such as `An error occurred (InvalidInput) when calling the CreateServiceLinkedRole operation: Service role name AWSServiceRoleForECS has been taken in this account, please try a different suffix.`

This means that this step has already been performed, either in CloudShell or by a previous FormKiQ installation process, so you do not need to take any further action.

If you attempted to run a FormKiQ installation before doing this step, the installation will likely have failed, but will likely have created this role, so you would receive this error message.

In either of these cases, you should now be able to install FormKiQ in your AWS Account.
:::


## Install FormKiQ

**For installation support, feedback, or updates, [please join our FormKiQ Slack Community](https://join.slack.com/t/formkiqcommunity/shared_invite/zt-2ki1i21w1-9ZYagvhY7ex1pH5Cyg2O3g)**

:::note
NOTE: Please ensure you've read the Prerequisites above and that AWSServiceRoleforECS has been enabled for your account.
:::

The FormKiQ installation process uses [AWS CloudFormation](https://docs.aws.amazon.com/cloudformation). AWS CloudFormation is a service that automates the process of creating and managing cloud resources. It allows you to easily install and update FormKiQ using a single url.

To install FormKiQ, select the installation link for the AWS region you want to deploy FormKiQ into below:

| AWS Region    | Install Link |
| -------- | ------- |
| us-east-1 | https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=formkiq-core-prod&templateURL=https://formkiq-core-distribution-us-east-1.s3.amazonaws.com/1.16.0/template.yaml|
| us-east-2 | https://console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks/new?stackName=formkiq-core-prod&templateURL=https://formkiq-core-distribution-us-east-2.s3.amazonaws.com/1.16.0/template.yaml|
| us-west-2 | https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=formkiq-core-prod&templateURL=https://formkiq-core-distribution-us-west-2.s3.amazonaws.com/1.16.0/template.yaml|
| ca-central-1 | https://console.aws.amazon.com/cloudformation/home?region=ca-central-1#/stacks/new?stackName=formkiq-core-prod&templateURL=https://formkiq-core-distribution-ca-central-1.s3.amazonaws.com/1.16.0/template.yaml|
| eu-central-1 | https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/new?stackName=formkiq-core-prod&templateURL=https://formkiq-core-distribution-eu-central-1.s3.amazonaws.com/1.16.0/template.yaml|
| eu-west-1 | https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=formkiq-core-prod&templateURL=https://formkiq-core-distribution-eu-west-1.s3.amazonaws.com/1.16.0/template.yaml|
| eu-west-3 | https://console.aws.amazon.com/cloudformation/home?region=eu-west-3#/stacks/new?stackName=formkiq-core-prod&templateURL=https://formkiq-core-distribution-eu-west-3.s3.amazonaws.com/1.16.0/template.yaml|
| ap-south-1 | https://console.aws.amazon.com/cloudformation/home?region=ap-south-1#/stacks/new?stackName=formkiq-core-prod&templateURL=https://formkiq-core-distribution-ap-south-1.s3.amazonaws.com/1.16.0/template.yaml|
| ap-southeast-1 | https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-1#/stacks/new?stackName=formkiq-core-prod&templateURL=https://formkiq-core-distribution-ap-southeast-1.s3.amazonaws.com/1.16.0/template.yaml|
| ap-southeast-2 | https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-2#/stacks/new?stackName=formkiq-core-prod&templateURL=https://formkiq-core-distribution-ap-southeast-2.s3.amazonaws.com/1.16.0/template.yaml|
| ap-northeast-2 | https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-2#/stacks/new?stackName=formkiq-core-prod&templateURL=https://formkiq-core-distribution-ap-northeast-2.s3.amazonaws.com/1.16.0/template.yaml|
| sa-east-1 | https://console.aws.amazon.com/cloudformation/home?region=sa-east-1#/stacks/new?stackName=formkiq-core-prod&templateURL=https://formkiq-core-distribution-sa-east-1.s3.amazonaws.com/1.16.0/template.yaml|

If the region you want to use is not listed, follow the [Install with SAM CLI](#install-with-sam-cli).

In addition to most AWS Regions, FormKiQ Core is also available to install using SAM CLI into the **AWS GovCloud (US) West** region; however, it is not currently available for **AWS GovCloud (US) East**.

FormKiQ Core does not currently support **AWS China** installations, mainly due to a mismatch in the AWS product versions available.

:::note
NOTE: For FormKiQ Pro and Enterprise users, you'll find a similar single click installation URL in your custom [GitHub](https://github.com) repository you were provided.
:::

## Create CloudFormation Stack

Clicking the installation link will bring you to the AWS Console Login if you are not already logged in. Once you are logged in, you will be taken to the `CloudFormation Create Stack` page. As you can see the Amazon S3 URL is automatically populated with the FormKiQ installation URL. This URL tells CloudFormation where it can find the CloudFormation yaml files that describes all the FormKiQ resources to create.

### Create Stack

![CloudFormation Create Stack](./img/cf-createstack.png)

Clicking the `Next` button will take you to the stack details page. On this page we can configure FormKiQ.

### Set Stack Name

![CloudFormation Stack Name](./img/cf-create-stack-name.png)

The first thing you will need to set is the CloudFormation Stack Name. The Stack name can include letters (A-Z and a-z), numbers (0-9), and dashes (-). We recommended to use the naming convention `formkiq-core-<app_environment>`, ie: formkiq-core-prod, formkiq-core-dev, etc. The `<app_environment>` allows you to differentiate between multiple installations of FormKiQ. This will give context to each FormKiQ installation and prevent accidentally deleting the wrong FormKiQ installation stack.

:::note
For production installations, we recommend using [AWS Organizations](https://aws.amazon.com/organizations) to create a separate account to run your production version of FormKiQ. AWS makes it easy to switch between accounts within an organization, and best practice is to keep your production environment in a separate account from any non-production resources. This not only helps with security, but also to help organize your costs. Ideally, you would have a new AWS account within your AWS organization for each environment (e.g., dev, test/qa, staging/pre-prod, and production).
:::

### Set Admin Email

![Set Admin Email](./img/cf-create-parameter-adminemail.png)

Set the admin email address. During the FormKiQ installation, this email address will be automatically set up with administrator access. An email will be sent to the address that provides a link to where the administrator password can be set.

:::note
Installations to AWS GovCloud (US) do not create an admin user. Instructions for creating an initial user [can be found here](/docs/platform/document_console#creating-the-initial-console-user).
:::

### Set App Environment

![Set App Environment](./img/cf-create-parameter-appenvironment.png)

AppEnvironment is a unique identifier for FormKiQ installations. The identifier should provider context to what kind of information is contained in the installation, IE: prod, staging, dev.

### Set Capacity Provider

![Set Capacity Provider](./img/cf-create-parameter-capacityprovider.png)

FormKiQ uses AWS Fargate service to run certain services. AWS Fargate supports using either FARGATE or FARGATE_SPOT capacity provider. While FARGATE_SPOT is much cheaper, we recommend that it be used only for development environments, with FARGATE being used for production environments.

### Enable Public Urls

![Set Enable Public Urls](./img/cf-create-parameter-enablepublic.png)

Whether to enable "/public" endpoints, defaults to false. Public endpoints allow external users to submit documents, such as through a web form. As with any publicly-available functionality, there is a risk of abuse if enabled.

:::note
You can always enable/disable your public endpoints at any time by updating your FormKiQ CloudFormation Stack and changing the value you've set.
:::

### Set Password Policy

![Set Password Policy](./img/cf-create-parameter-passwords.png)

FormKiQ uses [Amazon Cognito](https://aws.amazon.com/cognito) as the identity store for all users. Cognito support number of different password policies that you can configure.

### Configure Typesense

![Configure TypesenseApiKey](./img/cf-create-parameter-typesense.png)

Optional: API Key to access the [Typesense](https://typesense.org) server. Typesense is used to provide full text search support for document metadata. The API Key can be any random string of characters. To enable Typesense, the `VpcStackName` also needs to be set (see link:#vpc-cloudformation[VPC CloudFormation]).

:::note
Typesense is optional, since it requires a VPC to be created, which can add to your AWS usage costs. Without Typesense, you will only be able to search documents using tags and the document's created date.
:::

### Configure VPC

![Configure VPC](./img/cf-create-parameter-vpc-stackname.png)

The name of the CloudFormation VPC stack that can be created after the initial FormKiQ install, using the add-on <a href="/docs/getting-started/quick-start#create-vpc">CloudFormation template for VPC</a>.

**Some services require a VPC:**

- Tesseract (for OCR)
- Typesense (for full-text search)
- OpenSearch (part of the enhanced full-text search module available as an add-on for FormKiQ Pro/Enterprise)

**This VPC is only required if you are using any of these services; otherwise, this can remain empty.**

Keep selecting `Next` until you get to the last `Submit Create Stack` page. Once you've checked the checkboxes, you can click `Submit` to being the stack creation.

![Submit Create Stack](./img/cf-create-stack-submit.png)

The operation to create your new FormKiQ stack should take between fifteen and thirty minutes.

## Welcome Email

Once the FormKiQ CloudFormation installation has completed, an email will be sent to the email specified as the AdminEmail. This email will contain a link that will confirm the email address and allow the recipient to set a password for the administrator account.

:::note
Installations to AWS GovCloud (US) do not include a Welcome email by default, since the admin user needs to created manually. Instructions for creating an initial user [can be found here](/docs/platform/document_console#creating-the-initial-console-user).
:::

![Welcome to FormKiQ](./img/welcome-to-formkiq.png)

### Verify Email

Clicking the `Verify Email` link will allow you to set your administrator password.

### Set Admin Password

![Set Admin Password](./img/fk-console-setpassword.png)

### FormKiQ Console

Once your password is set you can now login to the FormKiQ Console.

:::note
Due to restrictions related to AWS GovCloud (US) and the lack of CloudFront availability, the FormKiQ Document Console is not installed as part of the deployment. Instead, you can deploy a docker image into GovCloud for internal or external access. [More information can be found here](/docs/platform/document_console#docker-image).
:::

![FormKiQ Console Login](./img/fk-console-login.png)

Once in the FormKiQ Console, you can start working with FormKiQ.

![FormKiQ Console Home](./img/fk-console-home.png)

:::note
Additional FormKiQ users can be created using [Amazon Cognito](https://aws.amazon.com/cognito). See [API Security](/docs/platform/api_security) for more information.
:::

## Create VPC

Certain FormKiQ features (currently Typesense and the OpenSearch add-on for FormKiQ Enterprise) require a VPC to be configured, and then the FormKiQ stack needs to be updated to use that VPC.

Below you'll find single-click installs links for creating a FormKiQ VPC.

Select the link below that is **in the same region as your FormKiQ installation**.

| AWS Region    | Install Link |
| -------- | ------- |
| us-east-1 | https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=formkiq-vpc&templateURL=https://formkiq-core-distribution-us-east-1.s3.amazonaws.com/1.16.0/vpc.yaml |
| us-east-2 | https://console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks/new?stackName=formkiq-vpc&templateURL=https://formkiq-core-distribution-us-east-2.s3.amazonaws.com/1.16.0/vpc.yaml |
| us-west-2 | https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=formkiq-vpc&templateURL=https://formkiq-core-distribution-us-west-2.s3.amazonaws.com/1.16.0/vpc.yaml |
| ca-central-1 | https://console.aws.amazon.com/cloudformation/home?region=ca-central-1#/stacks/new?stackName=formkiq-vpc&templateURL=https://formkiq-core-distribution-ca-central-1.s3.amazonaws.com/1.16.0/vpc.yaml |
| eu-central-1 | https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/new?stackName=formkiq-vpc&templateURL=https://formkiq-core-distribution-eu-central-1.s3.amazonaws.com/1.16.0/vpc.yaml |
| eu-west-1 | https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=formkiq-vpc&templateURL=https://formkiq-core-distribution-eu-west-1.s3.amazonaws.com/1.16.0/vpc.yaml |
| eu-west-3 | https://console.aws.amazon.com/cloudformation/home?region=eu-west-3#/stacks/new?stackName=formkiq-vpc&templateURL=https://formkiq-core-distribution-eu-west-3.s3.amazonaws.com/1.16.0/vpc.yaml |
| ap-south-1 | https://console.aws.amazon.com/cloudformation/home?region=ap-south-1#/stacks/new?stackName=formkiq-vpc&templateURL=https://formkiq-core-distribution-ap-south-1.s3.amazonaws.com/1.16.0/vpc.yaml |
| ap-southeast-1 | https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-1#/stacks/new?stackName=formkiq-vpc&templateURL=https://formkiq-core-distribution-ap-southeast-1.s3.amazonaws.com/1.16.0/vpc.yaml |
| ap-southeast-2 | https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-2#/stacks/new?stackName=formkiq-vpc&templateURL=https://formkiq-core-distribution-ap-southeast-2.s3.amazonaws.com/1.16.0/vpc.yaml |
| ap-northeast-2 | https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-2#/stacks/new?stackName=formkiq-vpc&templateURL=https://formkiq-core-distribution-ap-northeast-2.s3.amazonaws.com/1.16.0/vpc.yaml |
| sa-east-1 | https://console.aws.amazon.com/cloudformation/home?region=sa-east-1#/stacks/new?stackName=formkiq-vpc&templateURL=https://formkiq-core-distribution-sa-east-1.s3.amazonaws.com/1.16.0/vpc.yaml |

### Create Stack

After clicking one of the one-click VPC installation links and logging into your AWS account, you'll be brought to the CloudFormation Create Stack console. The `Amazon S3 URL` is populated with the FormKiQ VPC installation URL.

![CloudFormation Create Stack](./img/cf-createstack-vpc.png)

Click `Next` to continue to the configuration page.

### Set Stack Parameters

Stack Name will be needed for when you update the main FormKiQ stack.

![CloudFormation VPC Stack Name](./img/cf-create-parameters-vpc-stack-name.png)

EnableEnterpriseFeatures is for FormKiQ Pro/Enterprise; it must be set to true in order for FormKiQ Pro and Enterprise to be configured correctly for any add-ons or customizations. **It is not required for FormKiQ Core.**

![CloudFormation VPC Enable Enterprise Features](./img/cf-create-parameters-vpc-enable-enterprise-features.png)

When creating the VPC, you need to specify an IPv4 network range for the VPC, in CIDR notation. For example, 10.1.0.0/16.

NOTE: We recommend choosing a CIDR block that you know is not being used by any existing AWS resources in your AWS Organization. Ideally, each AWS account (one for each environment) is using its own CIDR range, e.g., 10.10.0.0/16 for dev, 10.20.0.0/16 for test/qa, etc.

The VPC is also configured with 3 public and 3 private subnets.

![CloudFormation VPC CIDR](./img/cf-create-parameters-cidr.png)

VpcLabel: you should also provide a label for the VPC. This will be visible in the AWS Management Console when viewing your VPCs, and will help identify this VPC in future.

![CloudFormation VPC Label](./img/cf-create-parameters-vpc-label.png)

## Update FormKiQ Stack

**This step is essential in order to enable access to Tesseract, Typesense or OpenSearch**

After creating the VPC stack, the main FormKiQ CloudFormation stack needs to be updated.

![CloudFormation Update Stack](./img/cf-updatestack.png)

Select the FormKiQ CloudFormation stack and then click the `Update` button.

When updating the stack you will want to choose `Use existing template`.

![Set VPC Stack Name](./img/cf-create-parameter-vpc-stackname.png)

For the `VpcStackName` parameter, set the value to the same value you used for the VPC stack you created above; in our example, it was `formkiq-vpc`.

Keep selecting `Next` until you get to the last `Submit Create Stack` page. Once you've checked the checkboxes, you can click `Submit` to being the stack creation.

![Submit Create Stack](./img/cf-create-stack-submit.png)

## Install with SAM CLI

FormKiQ Core was built using the [AWS Serverless Application Model (SAM)](https://aws.amazon.com/serverless/sam/) framework.

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for deploying serverless applications.

### Prerequisite

To use SAM CLI, you will need to install the following tools:

* AWS CLI - Install the AWS CLI (https://aws.amazon.com/cli/)
* SAM CLI - Install the SAM CLI (https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

### Get Latest Release

The latest version of FormKiQ Core can be found on the https://github.com/formkiq/formkiq-core/releases page on Github.

Download the file with the naming convention of: `formkiq-core-X.X.X.zip`

Once downloaded, unzip the file in its own directory.

```
INSTALL.md
LICENSE
template.yaml
...
```

### Sam deploy

To deploy FormKiQ Core, run the following command in the same folder as the `template.yaml` file.

```bash
sam deploy --guided --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND CAPABILITY_NAMED_IAM
```

The command will package and deploy your application to AWS, with a series of prompts:

| Argument | Description | Default Value |
| -------- | ------- | ------- |
| `Stack Name` | The name of the stack to deploy to CloudFormation. This should be unique to your account and region | formkiq-core-&lt;AppEnvironment&gt; |
| `AdminEmail` | Set the admin email address. During the FormKiQ installation, this email address will be automatically set up with administrator access. |
| `AppEnvironment` | AppEnvironment is a unique identifier for FormKiQ installations. The identifier should provider context to what kind of information is contained in the installation, IE: prod, staging, dev. | prod |
| `EnablePublicUrls` | Whether to enable "/public" endpoints. | false
| `PasswordMinimumLength` | Minimum Password Length | 8
| `PasswordRequireLowercase` | Whether Password requires a lowercase letter | false
| `PasswordRequireNumbers` | Whether Password requires a number | false
| `PasswordRequireSymbols` | Whether Password requires a symbol | false
| `PasswordRequireUppercase` | Whether Password requires a uppercase letter | false
| `VpcStackName` | Optional: The name of the FormKiQ VPC CloudFormation stack | null
| `TypesenseApiKey` | Optional: API Key to access the Typesense server | null
| `CapacityProvider` | Optional: CapacityProvider used by AWS Fargate service | FARGATE_SPOT


* **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual review. If set to no, the AWS SAM CLI will automatically deploy application changes.
* **Allow SAM CLI IAM role creation**: FormKiQ Core's AWS SAM templates create AWS IAM roles required for the AWS Lambda function(s) included to access AWS services. The permissions are passed in by the `sam deploy` command above. Set Value to 'Y'
* **Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the project, so that in the future you can just re-run `sam deploy` without parameters to deploy changes to your application.

Once you have set all of these options, SAM CLI will create a changeset and will display a list of all actions that will be performed as part of the changeset. If you have set "confirm changes before deploy" to "y", you will then be asked whether or nor to deploy this changeset. Choose "y" to complete the installation.

Once the FormKiQ Core stack has been deployed, you will be able to find your API Gateway Endpoint URL in the output values displayed after deployment.

### FormKiQ Console for AWS GovCloud (US)

Due to restrictions related to AWS GovCloud (US) and the lack of CloudFront availability, the FormKiQ Document Console is not installed as part of the deployment. Instead, you can deploy a docker image into GovCloud for internal or external access. [More information can be found here](/docs/platform/document_console#docker-image).

## API Walkthrough and Reference

To try out the API, try our [API Walkthrough](/docs/getting-started/api-walkthrough/). You can also check out the [FormKiQ API Reference](/docs/category/api-reference) for more endpoints you can try out.