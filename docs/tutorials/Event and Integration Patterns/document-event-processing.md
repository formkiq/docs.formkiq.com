---
sidebar_position: 14
slug: /tutorials/event-and-integration-patterns/document-event-processing
description: Choose a maintained FormKiQ event-processing tutorial for EventBridge actions, Lambda callbacks, or an event-driven document pipeline.
---

# Document Event Processing

FormKiQ publishes document events through Amazon SNS and supports configured processing through document actions and Amazon EventBridge. Use one of the maintained tutorials below for current setup instructions.

## Choose an event-processing pattern

- [Build an Event-Driven Document Processing Pipeline](/docs/tutorials/event-and-integration-patterns/build-event-driven-document-processing-pipeline): route document action events through EventBridge to a Lambda handler, then verify processing and retries.
- [Integrate with Amazon EventBridge](/docs/tutorials/event-and-integration-patterns/integrate-with-amazon-eventbridge): run custom Python processing with IAM-authenticated callbacks to the FormKiQ API.
- [Ruleset Processing](/docs/tutorials/solution-patterns/ruleset): select processing actions using document metadata and configured rules.

## Existing SNS integrations

Existing SNS subscribers can continue to consume their configured document topic. Check the `SnsDocumentEventArn` CloudFormation output and the deployed event payload before changing a consumer. The [platform overview](/docs/platform/overview) explains the relationship between SNS notifications, SQS queues, document actions, and configured integrations.

The previous tutorial used a snapshot Java client and an obsolete Lambda runtime. Its sample project has been retired; use the maintained tutorials above when implementing a new integration.
