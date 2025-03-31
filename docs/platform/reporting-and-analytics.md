---
sidebar_position: 8
---

# Reporting and Analytics

## Overview

FormKiQ's data architecture enables powerful reporting and analytics capabilities through integration with business intelligence tools like Amazon QuickSight and other analytics platforms. This documentation provides guidance on setting up reports, analyzing audit logs, monitoring user activity, and creating custom reporting integrations to gain valuable insights from your document management system.

:::note
FormKiQ stores document metadata in DynamoDB and stores document content in S3, providing multiple avenues for data analysis and reporting based on your specific needs.
:::

## Amazon QuickSight Integration

Amazon QuickSight is a cloud-native business intelligence service that integrates seamlessly with AWS services used by FormKiQ, enabling powerful visualization and analysis capabilities.

### Setting Up QuickSight with FormKiQ

To connect Amazon QuickSight to your FormKiQ data sources:

1. **Enable QuickSight Access to FormKiQ Resources**:
   - Configure QuickSight permissions to access your FormKiQ DynamoDB tables
   - Enable access to S3 buckets containing document content and audit logs
   - Set up appropriate IAM roles for QuickSight's service account

2. **Create Data Sources**:
   - Add DynamoDB tables as data sources (DocumentsTable, MetadataTable, etc.)
   - Import audit logs from CloudWatch Logs or S3
   - Configure direct query or SPICE ingestion based on data volume

3. **Configure Data Sets**:
   - Create calculated fields for common metrics
   - Set up appropriate join relationships between tables
   - Configure refresh schedules based on reporting needs

### Standard Report Templates

FormKiQ environments can benefit from these pre-defined QuickSight visualizations:

#### Document Analytics Dashboard

A comprehensive dashboard showing:
- Document volume trends over time
- Document type distribution
- Storage utilization metrics
- Processing queue analytics
- Tag and metadata usage statistics

#### User Activity Report

Monitor user engagement with:
- User-specific document access patterns
- Document creation, modification, and access trends
- Most active users and departments
- Search activity analysis
- API usage patterns by user or application

#### Compliance Monitoring Dashboard

Track compliance-related metrics including:
- Document retention compliance status
- Access permission audit results
- Required metadata completeness
- Workflow completion rates
- Potential policy violations

## Custom Report Configuration

### Data Export for Analysis

Before creating reports, you may need to export data from FormKiQ's DynamoDB tables for analysis:

1. **DynamoDB Export to S3**:
   - Use the DynamoDB export feature to create full or incremental exports to S3
   - Process these exports with tools like AWS Glue or Lambda
   - Create Athena tables over the exported data for SQL-based analysis

2. **Amazon DynamoDB Streams to Analytics**:
   - Configure DynamoDB Streams to capture table changes
   - Process streams with Lambda for real-time analytics
   - Store processed data in analytics-optimized formats

### DynamoDB Table Analysis

FormKiQ's DynamoDB tables provide rich metadata for custom reports. Since DynamoDB is NoSQL, you'll use DynamoDB-specific query patterns, using the Partition Key (PK), Sort Key (SK), and the Global Secondary Index Keys to filter and query.

See [FormKiQ DynamoDB Schema Documentation](/docs/platform/database_schema) for more information on how FormKiQ's metadata is organized.

### S3 Access Pattern Analysis

Monitor document access patterns using S3 access logs:

1. **Configure S3 Access Logging** for your FormKiQ document bucket
2. **Create an Athena table** for the access logs
3. **Design reports** to analyze access patterns, including:
   - Most frequently accessed documents
   - Time-based access patterns
   - User access distribution
   - Unusual access patterns

### Custom Visualization Techniques

Effective techniques for FormKiQ data visualization:

- **Heatmaps** for document activity concentration
- **Sankey diagrams** for document workflow progression
- **Geospatial maps** for user access locations
- **Correlation analysis** between metadata and document usage

## Audit Log Analysis

FormKiQ generates comprehensive audit logs that can be analyzed for security, compliance, and operational insights.

### CloudWatch Logs Integration

FormKiQ audit logs in CloudWatch can be analyzed through:

1. **CloudWatch Logs Insights**:
   ```
   fields @timestamp, @message
   | parse @message "*.eventName\":\"*\"" as prefix, eventName
   | filter eventName = "GetDocument"
   | parse @message "*.userIdentity.username\":\"*\"" as prefix, username
   | parse @message "*.resources.ARN\":\"*\"" as prefix, resourceARN
   | stats count(*) as accessCount by username, resourceARN
   | sort accessCount desc
   | limit 20
   ```

2. **CloudWatch Metrics and Alarms**:
   - Create metrics based on API call volume
   - Set alarms for unusual activity patterns
   - Monitor error rates and performance trends

### Audit Log Export to S3

For long-term analysis:

1. **Configure CloudWatch Logs to export** to an S3 bucket
2. **Create an AWS Glue crawler** to catalog the log data
3. **Query using Amazon Athena** for ad-hoc investigations
4. **Connect to QuickSight** for visualization

### Security Analysis Reporting

Key security metrics for monitoring:

- Failed authentication attempts
- Permission denied events
- Document access outside business hours
- Unusual volume of API requests
- Access from unexpected IP addresses

## User Activity Reporting

### User Behavior Analytics

FormKiQ's comprehensive logging enables user behavior analysis:

1. **Activity Timeline**:
   - Document the sequence of user actions
   - Identify patterns of document access and modification
   - Correlate activities across multiple documents

2. **Collaboration Analysis**:
   - Track document sharing patterns
   - Measure team engagement with shared documents
   - Identify collaboration bottlenecks

3. **Feature Adoption Tracking**:
   - Monitor usage of advanced FormKiQ features
   - Identify training opportunities based on feature underutilization
   - Measure feature adoption trends over time

### Department-Level Reporting

Create reports segmented by organizational structure:

1. **Configure schemas/classifications and metadata attributes** for departmental attribution
2. **Create QuickSight analyses** filtered by department
3. **Establish department-specific KPIs** for document management
4. **Set up automated distribution** of department-specific reports

## System Performance and Usage Statistics

### API Performance Monitoring

Track FormKiQ API performance metrics:

1. **Configure CloudWatch Metrics** for API Gateway and Lambda functions
2. **Set up dashboards** showing:
   - API latency trends
   - Error rates by endpoint
   - Request volume patterns
   - Cache hit ratios
   - Throttling incidents

### Storage Utilization Analysis

Monitor and forecast storage needs:

1. **S3 Bucket Analysis**:
   - Growth trends by document type
   - Storage class distribution
   - Cost optimization opportunities
   - Lifecycle policy effectiveness

2. **DynamoDB Capacity Analysis**:
   - Provisioned vs. consumed capacity
   - Read/write distribution
   - Hot partition detection
   - Scaling recommendation reports

### Workflow Performance Metrics

For FormKiQ environments with workflow capabilities:

1. **Process Completion Time**:
   - Average time per workflow stage
   - Bottleneck identification
   - SLA compliance reporting
   - Trend analysis over time

2. **Approval Process Analytics**:
   - Approval rates and patterns
   - Average approval time by approver
   - Rejection reason analysis
   - Parallel vs. sequential approval efficiency

## API for Custom Reporting Integration

### Data Export APIs

FormKiQ provides several API endpoints useful for custom reporting integrations:

1. **Documents List**:
   ```bash
   curl -X GET "https://{FORMKIQ_API_URL}/documents?limit=100" \
     -H "Authorization: {authorization}"
   ```

2. **Document Attributes**:
   ```bash
   curl -X GET "https://{FORMKIQ_API_URL}/documents/{documentId}/attributes" \
     -H "Authorization: {authorization}"
   ```

3. **Document Version**:
   ```bash
   curl -X GET "https://{FORMKIQ_API_URL}/documents/{documentId}/versions" \
     -H "Authorization: {authorization}"
   ```

### Building Custom ETL Processes

For advanced reporting solutions:

1. **AWS Lambda Functions** can:
   - Periodically extract FormKiQ data
   - Transform and enrich document metadata
   - Load into reporting databases or data warehouses

2. **AWS Glue Jobs** can:
   - Perform complex ETL operations
   - Join FormKiQ data with other enterprise data
   - Prepare data for specialized analytics

3. **AWS Step Functions** can:
   - Orchestrate multi-stage reporting workflows
   - Handle conditional processing logic
   - Manage error handling and retries

### Third-Party BI Tool Integration

FormKiQ data can be integrated with various BI platforms:

1. **Tableau** connection options:
   - Direct connection to Amazon Athena
   - Scheduled extracts from QuickSight
   - Custom API data connectors

2. **Power BI** integration:
   - AWS connector configuration
   - Direct Query vs. Import mode considerations
   - Refresh schedule optimization

3. **Looker** and other platforms:
   - Data modeling strategies
   - Connection pool management
   - Performance optimization techniques

## Implementation Best Practices

### Performance Considerations

For optimal reporting performance:

1. **Use selective querying** to minimize data transfer
2. **Create appropriate indexes** on frequently queried fields
3. **Implement caching strategies** for report data
4. **Schedule resource-intensive reports** during off-peak hours
5. **Use data aggregation** for large-volume analysis

### Security Recommendations

Maintain security in your reporting environment:

1. **Implement least-privilege access** for reporting tools
2. **Mask or encrypt sensitive information** in reports
3. **Audit report access and distribution**
4. **Use IAM roles for service account access**
5. **Implement VPC endpoints** for secure AWS service access

### Cost Optimization

Control costs while maintaining reporting capabilities:

1. **Monitor QuickSight SPICE usage**
2. **Optimize DynamoDB read capacity** for reporting queries
3. **Use S3 Intelligent-Tiering** for audit logs
4. **Implement TTL for temporary reporting data**
5. **Schedule and batch reporting jobs** to minimize API costs

## Advanced Reporting Scenarios

### Machine Learning Integration

Enhance reports with predictive capabilities:

1. **Amazon SageMaker integration** for:
   - Document classification predictions
   - Anomaly detection in usage patterns
   - Forecasting storage and usage needs

2. **Amazon Comprehend** for:
   - Entity extraction from document content
   - Sentiment analysis of document text
   - Key phrase extraction for document categorization

### Multi-Site Aggregation

For FormKiQ environments with multiple sites:

1. **Create cross-site data aggregation processes**
2. **Implement comparative site analytics**
3. **Establish global and local KPI hierarchies**
4. **Configure role-based access to multi-site reports**

### Event-Driven Reporting

Set up real-time reporting capabilities:

1. **Configure EventBridge rules** for FormKiQ events
2. **Trigger Lambda functions** for report updates
3. **Push notifications** for critical metrics
4. **Update dashboards in real-time** for active monitoring

:::note
FormKiQ's flexible architecture allows for continuous evolution of reporting capabilities. As your needs change, your reporting strategy can adapt to incorporate new data sources, visualization techniques, and analytical approaches.
:::

## Additional Resources

- [Amazon QuickSight Documentation](https://docs.aws.amazon.com/quicksight/)
- [AWS CloudWatch Logs Insights Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
- [FormKiQ API Documentation](/docs/category/formkiq-api)
- [DynamoDB Analytics Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-analytics.html)