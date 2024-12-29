---
sidebar_position: 1
---

# Overview

FormKiQ is a **flexible document management platform** powered by AWS managed services and serverless technologies. It provides:

- **API-first architecture** for document operations
- **AWS Well-Architected** design principles
- **Cost-effective** serverless implementation
- **Scalable** document management capabilities

![FormKiQ Architecture](./img/formkiq_architecture.png)

## Core Capabilities

- Document storage and retrieval
- Metadata management with attributes
- Full-text search
- Document processing workflows
- Event-driven automation
- Multi-tenant support

## Architecture Principles

Built on the **AWS Well-Architected Framework**:

### Operational Excellence
- Infrastructure as Code (IaC) deployments
- Event-driven architecture
- Automated retry mechanisms

### Security
- Encryption in transit and at rest
- Multiple authentication models:
  - JWT tokens
  - AWS IAM
  - API keys
- Fine-grained access control

### Reliability
- Serverless scalability
- Loosely-coupled services
- Graceful degradation

### Performance
- Serverless technologies
- Managed AWS services
- Optimized data access patterns

### Cost Optimization
- Pay-per-use pricing
- Tiered storage options
- Lifecycle policies

### Sustainability
- Managed services
- Resource optimization
- Efficient processing

## Core Components

### Storage Layer

#### Amazon S3
***Primary document storage***
- Unlimited scalability
- Multiple storage tiers
- Built-in versioning
- Automated lifecycle management
- Server-side encryption

#### Amazon DynamoDB
***Metadata and index storage***
- Sub-millisecond performance
- Automatic scaling
- Point-in-time recovery
- Event streaming
- ACID transactions

### Processing Layer

#### AWS Lambda
***Serverless compute engine***
- Event-driven processing
- Automatic scaling
- Pay-per-execution
- Multiple runtime supports
- Integrated security

#### Amazon ECS (Fargate)
***Container orchestration***
- Long-running processes
- Custom runtime environments
- Automatic container management
- Resource isolation
- Managed updates

### API Layer

#### API Gateway
***Request management***
- Multiple authentication methods:
  - Cognito JWT
  - IAM
  - API keys
  - Custom JWT
- Request throttling
- Usage monitoring
- CloudWatch integration

### Event System

#### Document Events
Automated triggers for:
- Document creation
- Updates
- Deletions
- Custom processing

#### Amazon SNS
***Event distribution***
| Message Attribute | Values | Description |
|------------------|---------|-------------|
| `type` | create, delete, update | Document operation type |
| `siteId` | default, custom | Tenant identifier |

Features:
- Pub/sub messaging
- Multiple endpoints
- Delivery guarantees
- Filter policies

#### Amazon SQS
***Event processing***
- Reliable message delivery
- Dead-letter queues
- FIFO support
- Message retention
- Visibility timeout