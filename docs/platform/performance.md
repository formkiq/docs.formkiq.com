---
sidebar_position: 8
---

# Performance

This page provides guidance on performance considerations for your applications, with a particular focus on AWS Lambda concurrency, DynamoDB throughput, and API Gateway limits.

## AWS Lambda Concurrency

AWS Lambda concurrency represents the number of instances of your function that are processing events at any given time. Understanding and managing concurrency helps optimize performance, control costs, and ensure your application scales properly under load.

### Types of Concurrency

- **Reserved Concurrency**: Sets a maximum limit for a specific function, ensuring it can always reach (but not exceed) that level of concurrency.
- **Provisioned Concurrency**: An option to pre-initialize a specified number of execution environments, eliminating cold starts for better performance.
- **Unreserved Concurrency**: The default option, where your function shares from the account's pool of available concurrency.

### Concurrency Limits

AWS Lambda often defaults to **10** concurrent executions per region, though this adjustable limit may be higher in some accounts. We recommend requesting an increase to **1000** before installation. This limit is shared across all Lambda functions in a specific Region within your account.

### Managing Throttling

When your function reaches its concurrency limit, additional invocations are throttled. Depending on the invocation type:

- **Synchronous invocations**: Return a throttling error (429 status code)
- **Asynchronous invocations**: Automatically retry with exponential backoff
- **Event source mappings**: Pause polling and retry with customizable behavior

### Provisioned Concurrency and Calculating Concurrency Needs

If you feel that processing time is being affected by startup time for Lambdas, you may want to consider setting up provisioned concurrency.

In order to determine what amount of provisioned concurrency is required, you can estimate function concurrency with this formula:

```
Concurrency = (average requests per second) × (average duration in seconds)
```

For example, if your function processes 100 requests per second with an average duration of 300ms (0.3 seconds), you'll need approximately 30 concurrent executions.

For detailed information on Lambda concurrency, see the [AWS Lambda Concurrency documentation](https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html).

### Best Practices

1. **Monitor function concurrency**: Use Amazon CloudWatch metrics to track concurrent executions and throttling.
2. **Set appropriate reserved concurrency**: Prevent a single function from consuming all available concurrency.
3. **Use provisioned concurrency for latency-sensitive applications**: Eliminate cold starts for critical functions.
4. **Implement backoff strategies**: When throttling occurs, implement exponential backoff in client-side retry logic.
5. **Request limit increases**: If you consistently need more than 1,000 concurrent executions, request a limit increase.

## DynamoDB Throughput Capacity

DynamoDB performance is based on throughput capacity, measured in Read Capacity Units (RCUs) and Write Capacity Units (WCUs). For production and/or high usage workloads, it can become important for your application's performance and cost management to configure the throughput capacity.

### Capacity Modes

DynamoDB offers two capacity modes:

1. **On-Demand Mode**: The default mode; it automatically scales to accommodate your workload with no capacity planning required (but typically at a higher usage cost per operation)
2. **Provisioned Mode**: You specify the read and write capacity requirements for your table, with optional auto-scaling

For development, it often makes sense to continue using On-Demand Mode, while for any environment that sees higher usage, generally production but sometimes non-production environments that see regular and consistent usage patterns, you may want to consider Provisioned Mode.

### Read Capacity Units (RCUs) and Write Capacity Units (WCUs)

When using Provisioned mode, you'll need to understand capacity units:

- **Read Capacity Units (RCUs)**:
  - One RCU represents one strongly consistent read per second for items up to 4KB
  - For eventually consistent reads, one RCU can perform two reads per second
  - Larger items require additional RCUs (e.g., an 8KB item needs 2 RCUs)

- **Write Capacity Units (WCUs)**:
  - One WCU represents one write per second for items up to 1KB
  - Larger items require additional WCUs (e.g., a 3KB item needs 3 WCUs)

### Best Practices

- **Starting out**: Begin with On-Demand mode for new applications or when usage patterns are unknown
- **Analyze before switching**: Before moving to Provisioned mode, collect at least two weeks of usage data to understand your traffic patterns
- **Cost optimization**: For workloads that consistently use more than 15-20% of provisioned capacity, Provisioned mode is often more cost-effective
- **Handling seasonality**: Consider using a combination - Provisioned mode for the base load and temporary switches to On-Demand mode during unpredictable peak periods
- **Monitor effectively**: Set up CloudWatch alarms for consumed capacity regardless of which mode you use
- **Handle throttling**: Implement exponential backoff retry strategies for any throttling scenarios

## API Gateway Limits

API Gateway enforces several limits that can affect the performance of your application.

### Throttling Limits

- Default account-level throttling: 10,000 requests per second (RPS)
- Default API-level throttling: 5,000 RPS
- Default stage-level throttling: Not set by default
- Default route-level throttling: Not set by default

These limits can be adjusted through service quotas. Consider implementing client-side throttling and retry logic to handle potential 429 (Too Many Requests) responses.

### Request/Response Size Limits

- Maximum payload size: 10MB
- Maximum integration timeout: 29 seconds
- Maximum request line and header size: 10,240 bytes

### Caching Considerations

As FormKiQ is often used for document processing and async processes, caching of API endpoints may not be an important initial consideration.

However, if there are specific endpoints within FormKiQ that are read often by your implementation, API Gateway offers caching capabilities that can significantly improve performance for read-heavy APIs:

- Cache TTL configurable from 0 to 3600 seconds
- Cache sizes range from 0.5GB to 237GB
- Caching can be enabled at the stage level, but configured on a per-method basis
- You can selectively enable caching for specific endpoints (e.g., just for GET methods)
- Cache keys can be customized based on request parameters, headers, or body content
- When enabled, the first request will still hit your backend, but subsequent identical requests within the TTL will return the cached response

To implement selective caching:
1. Enable caching at the stage level
2. Configure method-level caching settings for your individual GET operations
3. Specify appropriate cache key parameters to ensure proper cache hits

Keep in mind that API Gateway caching incurs additional costs but can significantly reduce backend load and improve response times.

For detailed information on API Gateway limits, see the [API Gateway Developer Guide](https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html).