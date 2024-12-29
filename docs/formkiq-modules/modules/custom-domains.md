---
sidebar_position: 1
---

# Custom Domains

## Overview

The Custom Domains module enables you to use your own domain names for FormKiQ console and API endpoints, replacing the default AWS domains with your branded URLs. This Enterprise Add-On Module leverages AWS services including Route 53 and Certificate Manager to provide secure, customized access points.

## Default vs Custom Domains

| Component | Default Domain | Custom Domain Example |
|-----------|---------------|----------------------|
| CloudFront Console | xxxxxx.cloudfront.net | console.yourdomain.com |
| API Gateway | xxxxxx.execute-api.region.amazonaws.com | api.yourdomain.com |

## Prerequisites

- SSL certificates configured in AWS Certificate Manager
- Console certificate must be in us-east-1 region (CloudFront requirement)
- Appropriate DNS access for domain configuration

## Configuration Parameters

### Domain Configuration

| Parameter | Description | Example |
|-----------|-------------|----------|
| ConsoleDomain | FormKiQ Console URL | console.yourdomain.com |
| HttpApiDomain | HTTP API endpoint | api.yourdomain.com |
| IamApiDomain | IAM API endpoint | iamapi.yourdomain.com |
| KeyApiDomain | Key API endpoint | keyapi.yourdomain.com |
| AuthApiDomain | Auth API endpoint | auth.yourdomain.com |

### Certificate Configuration

| Parameter | Description | Required Region |
|-----------|-------------|----------------|
| ConsoleCertificateArn | Console SSL certificate ARN | us-east-1 |
| HttpCertificateArn | HTTP API certificate ARN | Any |
| IamCertificateArn | IAM API certificate ARN | Any |
| KeyCertificateArn | Key API certificate ARN | Any |
| AuthCertificateArn | Auth API certificate ARN | Any |

### Optional Configuration

| Parameter | Description | 
|-----------|-------------|
| HostedZoneId | Route 53 Hosted Zone ID for automatic DNS record creation |

## Implementation Steps

### 1. Deploy Custom Domains

1. Prepare SSL certificates in AWS Certificate Manager
2. Configure domain parameters
3. Deploy CloudFormation template
4. Note the stack name for FormKiQ integration

### 2. Connect to FormKiQ

1. Open CloudFormation console
2. Select your FormKiQ installation
3. Click "Update"
4. Choose "Use existing template"
5. Set `CertificateStackName` to your Custom Domains stack name
6. Complete the stack update

## Use Cases

### Internal Usage
- Replace AWS domains with branded URLs
- Improve URL readability for internal users
- Maintain consistent branding

### External Access
- Professional branded endpoints
- Enhanced security with SSL
- Simplified API access

## AWS Services Used

- Amazon Route 53 for DNS management
- AWS Certificate Manager for SSL certificates
- Amazon CloudFront for console delivery
- Amazon API Gateway for API endpoints

:::note Important
Console certificates must be in the us-east-1 region due to CloudFront requirements
:::