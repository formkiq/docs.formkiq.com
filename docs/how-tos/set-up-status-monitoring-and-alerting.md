---
sidebar_position: 10
---

# Set Up Status Monitoring and Alerting

This guide will show you how to set up comprehensive monitoring and alerting for your FormKiQ deployment to ensure high availability and quick response to any issues.

## What you'll need

* [AWS Command Line Interface (AWS CLI)](https://aws.amazon.com/cli)
* AWS CLI configured with appropriate permissions for CloudWatch and SNS
* Access to your FormKiQ deployment endpoint

## AWS Service Health Monitoring

### Configure AWS Health Dashboard Alerts

1. Navigate to the AWS Personal Health Dashboard
2. Set up SNS notifications for service health updates:
   * Create a new SNS topic for health alerts
   * Configure the topic to forward notifications to your preferred destination
   * Subscribe to alerts specifically for services that FormKiQ depends on

## Endpoint Monitoring

### Basic Health Check

You can verify FormKiQ's availability by making an HTTP GET request to the version endpoint:

```bash
curl -i https://<your-formkiq-endpoint>/version
```

The service should respond with:
* HTTP 200 status code
* JSON response containing version information

### Automated Health Checks

Set up automated monitoring using AWS CloudWatch Synthetics:

1. Create a new Canary:
   * Navigate to CloudWatch Synthetics in AWS Console
   * Click "Create Canary"
   * Choose "API Canary" blueprint
   * Configure the endpoint URL (your FormKiQ version endpoint)
   * Set the monitoring schedule (recommended: every 5 minutes)

2. Configure alerts:
   * Create a CloudWatch alarm based on Canary metrics
   * Set up an SNS topic for notifications
   * Define appropriate thresholds for failed checks

## Advanced Monitoring

### Custom Health Endpoint

Create a comprehensive health check endpoint to monitor critical dependencies:

1. Add a custom `/health` endpoint to your FormKiQ deployment
2. Configure the endpoint to check:
   * Database connectivity
   * S3 bucket access
   * Other essential services

### CloudWatch Metrics and Alarms

Set up detailed CloudWatch monitoring:

1. Forward FormKiQ logs to CloudWatch Logs:
   * Configure log groups for your FormKiQ deployment
   * Enable log streaming from your application

2. Create metric filters:
   * Filter for error patterns (e.g., 5XX responses)
   * Track timeouts and latency issues
   * Monitor authentication failures

3. Configure CloudWatch alarms:
   * Create alarms based on metric thresholds
   * Set appropriate evaluation periods
   * Link alarms to SNS notifications

## Best Practices

### Monitoring Frequency

* Run basic health checks every 5 minutes
* Configure more intensive checks (custom health endpoint) every 15-30 minutes
* Adjust frequency based on your specific needs and traffic patterns

### Alert Configuration

* Set up multiple notification channels:
   * Email distribution lists
   * Slack channels
   * Ticketing systems (e.g., JIRA, ServiceNow)
* Configure different severity levels for different types of alerts
* Include relevant troubleshooting information in alert messages

### Documentation

* Maintain updated runbooks for common issues
* Document alert thresholds and rationale
* Keep contact information current for escalation procedures

## Summary

Following this guide, you've set up a comprehensive monitoring solution for your FormKiQ deployment that includes:
* AWS service health monitoring
* Endpoint availability checks
* Custom health checks for dependencies
* Detailed metrics and alerting

This monitoring setup will help ensure high availability and quick response times to any issues that may arise.

If you have any questions, reach out to us on our [GitHub repository](https://github.com/formkiq/formkiq-core) or visit [FormKiQ's website](https://formkiq.com).