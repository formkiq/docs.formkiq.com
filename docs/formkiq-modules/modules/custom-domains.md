---
sidebar_position: 1
---

# Custom Domains

✅ Customize your FormKiQ API and Console URLs with your domain

Custom Domains is a FormKiQ Enterprise Add-On Module (for the FormKiQ Core Headless Document Management System) that enables custom domains support for FormKiQ console, and API endpoints. 

FormKiQ out of the box uses the AWS default domains for the https://aws.amazon.com/cloudfront[Amazon CloudFront] (XXXXXXX.cloudfront.net.) and https://aws.amazon.com/api-gateway[Amazon API Gateway] (https://XXXXXXX.execute-api.region.amazonaws.com)

The module uses https://aws.amazon.com/route53[Amazon Route 53] and https://aws.amazon.com/certificate-manager[AWS Certificate Manager] to create domains and auto-renewing SSL certificates. Then adds the certificates and configures the domains to API Gateway and the FormKiQ console.

By deploying this template, you can set up custom domains secured with SSL for various FormKiQ APIs and the FormKiQ Console.

## Use Cases
 
* If you would like to share the FormKiQ API or FormKiQ Console internally to users, and would prefer that one of your domains or subdomains be used instead of the less-readable CloudFront and API Gateway domains

* If you are exposing any FormKiQ URLs externally and would prefer that external users remain unaware that you use AWS for your document management

## Using Custom Domains Template

The CloudFormation template requires that certificates / domain are already setup in AWS Certificate Manager.

The template requires the following parameters to be defined:

### Domain Names
- **ConsoleDomain:** The domain name for the FormKiQ Console (e.g., `console.yourdomain.com`).
- **HttpApiDomain:** The domain name for the FormKiQ HTTP API (e.g., `api.yourdomain.com`).
- **IamApiDomain:** The domain name for the FormKiQ IAM API (e.g., `iamapi.yourdomain.com`).
- **KeyApiDomain:** The domain name for the FormKiQ Key API (e.g., `keyapi.yourdomain.com`).
- **AuthApiDomain:** The domain name for the FormKiQ Auth API (e.g., `auth.yourdomain.com`).

### SSL Certificates
- **ConsoleCertificateArn:** The ARN of the ACM certificate for the FormKiQ Console.
- **HttpCertificateArn:** The ARN of the ACM certificate for the FormKiQ HTTP API.
- **IamCertificateArn:** The ARN of the ACM certificate for the FormKiQ IAM API.
- **KeyCertificateArn:** The ARN of the ACM certificate for the FormKiQ Key API.
- **AuthCertificateArn:** The ARN of the ACM certificate for the FormKiQ Auth API.

:::note
The ACM certificate for the FormKiQ Console must be in the us-east-1 region due to Amazon CloudFront requirements
:::

### Optional Parameters
- **HostedZoneId:** (Optional) The Route 53 Hosted Zone ID where the A records will be added. This parameter is used if you want the template to automatically create DNS records in Route 53.

## Connect to FormKiQ

Once the custom domains template is created, you then need to connect it to your FormKiQ installations.

* Select your FormKiQ installation from the CloudFormation console.

* Click the **Update** button

* Select **Use existing template**

* Under the **CertificateStackName** parameter, enter the name of the Custom Domain Template stack name.

Once the stack is updated, the certificates will be automatically attached to the FormKiQ APIs and console.