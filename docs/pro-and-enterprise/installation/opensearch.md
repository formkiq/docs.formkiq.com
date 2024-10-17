---
sidebar_position: 5
---

# OpenSearch

**A guide for deploying [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/) into your AWS account.**

## Prerequisites

Before you can install the OpenSearch module, you need to have installed FormKiQ Pro/Enterprise and the VPC. The installation links can be found below:

* [FormKiQ Pro/Enterprise](/docs/pro-and-enterprise/installation/formkiq)
* [VPC](/docs/getting-started/quick-start#create-vpc)

Before installation verify that the AWSServiceRoleForAmazonOpenSearchService has been enabled on your AWS Account. The easiest fix is to open up AWS CLI and run the following against your account once.

```
aws iam create-service-linked-role --aws-service-name opensearchservice.amazonaws.com
```

## CloudFormation

The FormKiQ installation process uses [AWS CloudFormation](https://docs.aws.amazon.com/cloudformation). AWS CloudFormation is a service that automates the process of creating and managing cloud resources. It allows you to easily install and update FormKiQ using a single url.

To install OpenSearch, select the same AWS region that FormKiQ is installed into:

| AWS Region    | Install Link |
| -------- | ------- |
| us-east-1 | https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new|
| us-east-2 | https://console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks/new|
| us-west-2 | https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new|
| ca-central-1 | https://console.aws.amazon.com/cloudformation/home?region=ca-central-1#/stacks/new|
| eu-central-1 | https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/new|
| eu-west-1 | https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new|
| eu-west-2 | https://console.aws.amazon.com/cloudformation/home?region=eu-west-2#/stacks/new|
| ap-south-1 | https://console.aws.amazon.com/cloudformation/home?region=ap-south-1#/stacks/new|
| ap-southeast-1 |https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-1#/stacks/new|
| ap-southeast-2 | https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-2#/stacks/new|
| ap-northeast-2 | https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-2#/stacks/new|
| sa-east-1 | https://console.aws.amazon.com/cloudformation/home?region=sa-east-1#/stacks/new|


## Installation

Clicking the installation link will bring you to the AWS Console Login (if you are not already logged in). Once you are logged in, you will be taken to the `CloudFormation Create Stack` page. 

### Create Stack

![CloudFormation Create Stack](./img/cf-opensearch-createstack.png)

On the "Create stack" page, enter the OpenSearch module installation S3 Url provided to you, or can be found on your Enterprise Github page.

Clicking the "Next" button will take you to the stack details page. On this page we can configure OpenSearch.

### Stack Name

![CloudFormation Stack Name](./img/cf-opensearch-create-stack-name.png)

The first thing you will need to set is the CloudFormation Stack Name. The Stack name can include letters (A-Z and a-z), numbers (0-9), and dashes (-). We recommended to use the naming convention `formkiq-enterprise-opensearch-<app_environment>`, ie: formkiq-enterprise-opensearch-prod, formkiq-enterprise-opensearch-dev, etc. The <app_environment> should match the <app_environment> name used during the FormKiQ installation.

### Parameters

The following are descriptions of the CloudFormation paramaters.

#### AppEnvironment

![OpenSearch AppEnvironment](./img/cf-opensearch-appenvironment.png)

The AppEnvironment is a unique Application Environment Identifier, IE dev/staging/prod

:::note
It MUST match the AppEnvironment set during the FormKiQ installation
:::

#### DataInstanceCount

![OpenSearch Data Instance Count](./img/cf-opensearch-datainstancecount.png)

The number of data nodes (instances) to use in the OpenSearch Service domain.

For a development instance, a value of "1" is suggested.

#### DataInstanceType

![OpenSearch Data Instance Type](./img/cf-opensearch-datainstancetype.png)

The instance type for your data nodes, such as m3.medium.search. For valid values, see [Supported instance types in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-instance-types.html).

For a development instance, a value of "t3.small.search" is suggested.

Allowed values: _any [supported instance types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-instance-types.html), e.g.,_ t3.medium.search

#### DataNodeVolumeSize

![OpenSearch Data Volume Size](./img/cf-opensearch-datanodevolumesize.png)

The size (in GiB) of the EBS volume for each data node. The minimum and maximum size of an EBS volume depends on the EBS volume type and the instance type to which it is attached.

For a development instance, a value of "10" GB is suggested.

#### DedicatedMasterCount

![OpenSearch Dedicated Master Count](./img/cf-opensearch-dedicatedmastercount.png)

The number of instances to use for the master node.

For a development instance, a value of "0" is suggested because a Master Node is not required for development.

#### DedicatedMasterEnabled

![OpenSearch Dedicated Master Count](./img/cf-opensearch-dedicatedmasterenabled.png)

Indicates whether to use a dedicated master node for the OpenSearch Service domain. A dedicated master node is a cluster node that performs cluster management tasks, but doesn't hold data or respond to data upload requests. Dedicated master nodes offload cluster management tasks to increase the stability of your search clusters. See Dedicated master nodes in Amazon OpenSearch Service.

For a development instance, a value of "false" is suggested because a Master Node is not required for development.

#### DedicatedMasterType

![OpenSearch Dedicated Master Count](./img/cf-opensearch-dedicatedmastertype.png)

The hardware configuration of the computer that hosts the dedicated master node, such as m3.medium.search. If you specify this property, you must specify true for the DedicatedMasterEnabled property. For valid values, see Supported instance types in Amazon OpenSearch Service.

For a development instance, a value of "t3.small.search" is suggested. NOTE: This value will not be used if DedicatedMasterEnabled is "false", but is required.

Allowed values: _any [supported instance types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-instance-types.html), e.g.,_ t3.medium.search

#### EBSVolumeType

![OpenSearch EBS Volume Type](./img/cf-opensearch-ebsvolumetype.png)

The EBS volume type to use with the OpenSearch Service domain. If you choose gp3, you must also specify values for Iops and Throughput. For more information about each type, see Amazon EBS volume types in the Amazon EC2 User Guide for Linux Instances.

For all instances, a value of "gp3" is suggested.

Allowed values: standard | gp2 | io1 | gp3

#### Name

![OpenSearch Name](./img/cf-opensearch-name.png)

A name for the OpenSearch Service domain. The name must have a minimum length of 3 and a maximum length of 28. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the domain name.

Suggested name format "formkiq-enterprise-<app_environment>"

#### OpenSearchVersion

![OpenSearch Version](./img/cf-opensearch-version.png)

The version of OpenSearch to use.

#### VpcStackName

![OpenSearch VpcStackName](./img/cf-opensearch-vpcstackname.png)

The name of the CloudFormation VPC stack name.

#### VpcSubnets

![OpenSearch Vpc Subnet](./img/cf-opensearch-vpcsubnets.png)

The subnet(s) to deploy OpenSearch nodes to. The number of subnets selected must be less than or equal to the number of data nodes deployed.

For a development instance, if only one data node is being deployed, only one subnet can be selected.

![OpenSearch Vpc Subnet List](./img/cf-opensearch-vpcsubnets-list.png)

OpenSearch nodes should ONLY be deployed to private subnets. The FormKiQ VPC Cloudformation template creates 3 private subnets.

#### ZoneAwarenessConfig

![OpenSearch EBS Volume Type](./img/cf-opensearch-zoneawarenessconfig.png)

Indicates whether to enable zone awareness for the OpenSearch Service domain. When you enable zone awareness, OpenSearch Service allocates the nodes and replica index shards that belong to a cluster across two Availability Zones (AZs) in the same region, to prevent data loss and minimize downtime in the event of node or data center failure. Don't enable zone awareness if your cluster has no replica index shards or is a single-node cluster. For more information, see [Configuring a multi-AZ domain in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-multiaz.html).

### Complete Installation

Keep selecting "Next" until you get to the last ?Submit Create Stack" page. Once you've checked the checkboxes, you can click "Submit" to begin the stack creation.

![Create CloudFormation Stack](./img/cf-create-stack-submit.png)

## Update FormKiQ

After the OpenSearch module is deployed, the name of OpenSearch Cloudformation stack must be connected to the FormKiQ installation.

![CloudFormation Update Stack](./img/cf-updatestack.png)

Select the FormKiQ CloudFormation stack and then click the "Update" button.

When updating the stack you will want to choose "Use current template".

![OpenSearch Stack Name](./img/cf-opensearch-stackname.png)

For the `OpenSearchStackName` parameter, set the value to the name of the OpenSearch stack name you created above.

Keep selecting "Next" until you get to the last "Submit Create Stack" page. Once you've checked the checkboxes, you can click "Submit" to begin the stack creation.

![Submit Create Stack](./img/cf-create-stack-submit.png)

Once the stack is updated, documents and metadata added to FormKiQ will be automatically synced with OpenSearch. (The only exception is document content, which must be explicitly specified for sync due to the higher amount of data storage required.)
