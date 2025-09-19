---
sidebar_position: 7
---

# Updates, Upgrades, and Rollbacks

## Overview

This document outlines the recommended procedures for updating FormKiQ to newer versions, or upgrading to enhanced FormKiQ offerings and add-ons. Regular updates ensure you benefit from the latest features, security enhancements, and performance improvements while maintaining system stability.

Because FormKiQ uses CloudFormation for deployments, the stack should rollback automatically if the deployment fails. In addition, you can rollback to previous versions of FormKiQ using the same method of updating your stack.

:::note
Before initiating any upgrade, always review the release notes for the target version to understand new features, breaking changes, and specific upgrade considerations. FormKiQ versions remain backwards-compatible with all previous versions with a major version, i.e., endpoints may be deprecated but will not be removed from FormKiQ 1.\*, but removals will likely occur once FormKiQ 2.\* becomes available.
:::

## Release Notifications

Stay informed about FormKiQ updates and security patches through these notification channels:

### GitHub Notifications

**Watch Repository for Releases** (Recommended)

1. Visit the [FormKiQ Core repository](https://github.com/formkiq/formkiq-core)
2. Click **"Watch"** → **"Custom"** → **"Releases"** 
3. Choose email or web notifications

**RSS Feed**
```
https://github.com/formkiq/formkiq-core/releases.atom
```

### Community Channels

**Slack Community**: [Join the FormKiQ Community](https://join.slack.com/t/formkiqcommunity/shared_invite/zt-2ki1i21w1-9ZYagvhY7ex1pH5Cyg2O3g) for real-time release discussions and support.

**Mailing List**: A low-volume mailing list for release and security notifications only. [Join here](https://formkiq.com/updates#mailing_list).

:::tip
For production environments, we recommend subscribing to GitHub notifications to ensure you don't miss critical security updates.
:::

## Pre-Upgrade Planning

### Version Assessment

1. **Identify Current Version**
   - Check your CloudFormation stack parameters
   - Verify through the FormKiQ Console version information
   - Confirm via API version endpoint

2. **Determine Target Version**
   - Review the [FormKiQ Release Notes and Changelog](/docs/category/changelog)
   - Assess if intermediate upgrades are required for major version changes
   - Evaluate new features against your requirements

### Environment Preparation

1. **System Status Check**
   - Verify all services are operating normally
   - Ensure no pending changes or deployments
   - Validate system resource availability

2. **Optional Backup Considerations**
   - FormKiQ already enables DynamoDB Point-in-Time Recovery and S3 versioning by default
   - Consider exporting key configuration settings for reference
   - Backup CloudFormation template for reference and rollback planning

```bash
# Export CloudFormation template (recommended)
aws cloudformation get-template \
  --stack-name your-formkiq-stack \
  --query TemplateBody \
  --output json > formkiq_pre_upgrade_$(date +%Y%m%d).json
```

3. **Documentation Review**
   - Read all release notes between current and target versions
   - Check for deprecation notices
   - Note any required configuration changes
   - Identify any changes to IAM permissions or resource requirements

### Testing Strategy

1. **Create Test Environment**
   - Deploy a replica of your production environment if possible
   - Use a subset of production data for testing
   - Match the production configuration

2. **Define Test Cases**
   - Include critical workflows
   - Test API endpoints for expected functionality
   - Verify custom integrations continue to work
   - Validate permission settings

## Upgrade Methods

### CloudFormation Stack Update

The recommended approach for upgrading FormKiQ is using CloudFormation stack updates:

1. **Prepare Parameters**
   - View the latest FormKiQ CloudFormation templates (within AWS Management Console or downloaded via CloudShell)
   - Note any new parameters or changed defaults
   - Prepare parameter values for your environment

2. **Initiate Update**
   - In AWS Console, navigate to CloudFormation
   - Select your FormKiQ stack
   - Choose "Update Stack"
   - Select "Replace current template"
   - Upload the new template or provide S3 URL
   - Review and update parameters as needed
   - Acknowledge IAM capability changes if required

:::note
if you are updating parameters only, or are working with a Beta Release of FormKiQ, you can use the same template rather than replace
:::

```bash
# Alternative: Update using AWS CLI
aws cloudformation update-stack \
  --stack-name your-formkiq-stack \
  --template-url https://s3.amazonaws.com/formkiq-releases/VERSION/formkiq.yaml \
  --parameters ParameterKey=AppEnvironment,ParameterValue=production \
               ParameterKey=AdminEmail,ParameterValue=admin@example.com \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM
```

3. **Monitor Deployment**
   - Track progress in the Events tab
   - Watch for any resource creation failures
   - Monitor service availability during update

## Post-Upgrade Verification

**While each version of FormKiQ is tested by the FormKiQ team before release, there are always edge cases that may not be easily detected by FormKiQ.**

For instance, in addition to the possibility of bugs being missed, while FormKiQ tests are run in each supported region, other regions may be missing AWS services or settings that could affect your deployment. In addition, some organizations employ special policies and configurations in their AWS accounts that may cause unexpected results.

Deploying and testing on a non-prod environment first is the best way to ensure that your end users are not negatively impacted by any updates.

### System Verification

1. **Infrastructure Check**
   - Verify all CloudFormation resources are in "CREATE_COMPLETE" or "UPDATE_COMPLETE" state
   - Confirm API Gateway endpoints are available
   - Check Lambda functions for proper configuration

2. **Functionality Testing**
   - Validate login and authentication
   - Test document upload/download
   - Verify search functionality
   - Test administrative functions
   - Check any custom integrations

3. **Performance Assessment**
   - Monitor response times
   - Check for any unusual error rates
   - Verify resource utilization is within expected ranges

### Troubleshooting Common Issues

#### API Gateway Errors

If experiencing endpoint connectivity issues:

1. Check CloudWatch Logs for API Gateway errors
2. Verify Lambda integration is properly configured
3. Ensure IAM permissions are correct
4. Check for any regional service issues

```bash
# View logs for an API Gateway stage
aws logs filter-log-events \
  --log-group-name "API-Gateway-Execution-Logs_abcdef123/prod" \
  --filter-pattern "Error"
```

#### Lambda Function Failures

For Lambda execution issues:

1. Check CloudWatch Logs for the specific Lambda function
2. Verify environment variables are set correctly
3. Ensure IAM execution role has necessary permissions
4. Check for memory or timeout constraints

```bash
# View logs for a Lambda function
aws logs filter-log-events \
  --log-group-name "/aws/lambda/formkiq-core-documents" \
  --start-time $(date -d '1 hour ago' +%s)000
```

#### DynamoDB Issues

For database-related problems:

1. Verify table throughput settings are appropriate
2. Check for throttling events
3. Ensure schema changes have been properly applied
4. Monitor for error patterns in application logs

## Rollback Procedures

If issues are encountered during or after upgrade:

### CloudFormation Rollback

For critical failures during deployment:

1. In CloudFormation console, select the stack
2. Choose "Update Stack"
3. Select "Use previous template"
4. Follow the wizard to restore the previous configuration

```bash
# Rollback using AWS CLI
aws cloudformation update-stack \
  --stack-name your-formkiq-stack \
  --use-previous-template \
  --parameters ParameterKey=AppEnvironment,UsePreviousValue=true \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM
```

### Data Recovery (if needed)

If data issues are discovered after upgrade:

1. Utilize DynamoDB Point-in-Time Recovery to restore tables to pre-upgrade state
2. Use S3 versioning to restore document versions if needed
3. Update application configuration if necessary

## Maintenance Planning

### Scheduled Maintenance Windows

1. **User Communication**
   - Notify users of planned maintenance window
   - Provide estimated downtime duration
   - Communicate expected service impacts

2. **Timing Considerations**
   - Perform upgrades during off-peak hours
   - Allocate sufficient time for testing and potential rollback
   - Consider regional user distribution when scheduling

### Multi-Environment Strategy

For organizations with multiple environments:

1. **Development → Staging → Production**
   - Always test upgrades in development first
   - Validate in staging environment with production-like data
   - Schedule production upgrade after successful staging verification

2. **Staggered Updates**
   - For organizations with multiple FormKiQ Prod instances, consider sequential updates to limit the "blast radius" of unexpected issues

## Best Practices

1. **Comprehensive Testing**
   - Test all critical business workflows before concluding the upgrade
   - Perform load testing if significant architectural changes are included
   - Validate API functionality across all integration points

2. **Documentation**
   - Document all configuration changes made during upgrade
   - Record version-specific notes and observations
   - Maintain a log of upgrade history
   - Document any issues encountered and their resolutions

3. **Monitoring Enhancement**
   - Set up specific monitoring for new features
   - Create alerts for new failure modes
   - Update dashboards to include new metrics

4. **Regular Update Cadence**
   - Establish a regular schedule for reviewing available updates
   - Balance staying current with system stability needs
   - Prioritize security-related updates

## Additional Resources

- [FormKiQ Release Notes and Changelog](/docs/category/changelog)
- [AWS CloudFormation Documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html)
- [FormKiQ API Documentation](/docs/category/formkiq-api)