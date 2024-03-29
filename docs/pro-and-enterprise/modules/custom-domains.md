---
sidebar_position: 1
---

# Custom Domains

✅ Customize your FormKiQ API and Console URLs with your domain

Custom Domains is a FormKiQ Enterprise Add-On Module (for the FormKiQ Core Headless Document Management System) that enables custom domains support for FormKiQ console, and API endpoints. 

FormKiQ out of the box uses the AWS default domains for the https://aws.amazon.com/cloudfront[Amazon CloudFront] (XXXXXXX.cloudfront.net.) and https://aws.amazon.com/api-gateway[Amazon API Gateway] (https://XXXXXXX.execute-api.region.amazonaws.com)

The module uses https://aws.amazon.com/route53[Amazon Route 53] and https://aws.amazon.com/certificate-manager[AWS Certificate Manager] to create domains and auto-renewing SSL certificates. Then adds  the certificates and configures the domains to API Gateway and the FormKiQ console.

## Use Cases
 
* If you would like to share the FormKiQ API or FormKiQ Console internally to users, and would prefer that one of your domains or subdomains be used instead of the less-readable CloudFront and API Gateway domains
* If you are exposing any FormKiQ URLs externally and would prefer that external users remain unaware that you use AWS for your document management
