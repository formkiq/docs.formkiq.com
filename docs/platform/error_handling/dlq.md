---
sidebar_position: 1
---

# Dead-Letter Queue (DLQ)

![SQS Dead Letter Queue](./img/dlq-dead-letter-queue.png)

FormKiQ uses a message-driven architecture where communication between different components of a system occurs through asynchronous message passing. By decoupling components and using asynchronous communication, message-driven architectures are inherently more resilient to failures. If one component fails or becomes overloaded, it doesn't necessarily impact the entire system, as messages can be queued and processed later. 

[Amazon Simple Queue Service (SQS) Dead Letter Queues (DLQs)](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) are a feature provided by AWS SQS to help manage messages that cannot be processed successfully by consumers. In a message-driven architecture, where different components communicate via message queues, DLQs play a crucial role in handling messages that fail processing for various reasons such as processing errors, or exceeding processing rate limits.

FormKiQ has a single DLQ that provides a centralized location for managing and analyzing messages that couldn't be processed successfully. These messages then can be investigate the reasons behind message failures by examining the contents of the DLQ and then if the message is valid sent to be reprocessed.

## Dead-Letter Queue Alerts

Amazon CloudWatch Alarms are a feature provided by AWS CloudWatch, a monitoring and observability service offered by Amazon Web Services (AWS). CloudWatch Alarms allow you to set up notifications and trigger automated actions based on predefined thresholds or conditions related to metrics collected by CloudWatch. 

FormKiQ installs a CloudWatch Alarm that can notify you when a message cannot be processed and is put into the DLQ.

![CloudWatch DLQ Alert](./img/dlq-alerts.png)

### Subscribe to DLQ

The DLQ alert is connected to [Amazon Simple Notification Service](https://aws.amazon.com/sns/). This allows you to subscribe an email address to the alerts so you can be notified via email if there are any messages that cannot be processed.

To subscribe:

Visit the [Amazon Simple Notification Service console](https://console.aws.amazon.com/sns/v3/home) and find the SNS DLQ topic.

![SNS DLQ Topic](./img/dlq-sns-topic.png)

Select the topic and under the `Subscriptions` tab, click the `Create Subscription` button.

![SNS DLQ Topic](./img/dlq-sns-subscribe-list.png)

Ensure the correct Topic ARN is selected. Select `Email` from the Protocol dropdown and enter your email address under the `Endpoint` and click the `Create subscription` button.

![SNS DLQ Topic](./img/dlq-sns-subscribe.png)

You will then receive an email similar to the one below. You'll need to click the link to verify your subscription. Once that is done, you'll receive an email everytime a message fails to be processed.

```
You have chosen to subscribe to the topic:
arn:aws:sns:us-east-2:1111111111:FormKiQ-DLQ-dev-Alert

To confirm this subscription, click or visit the link below (If this was in error no action is necessary):
Confirm subscription
```

## Reprocess Messages (Redrive)

When a message fails to be processed, it can be sent back to its original queue for reprocessing. First fine the dead letter queue for your FormKiQ installation.

![SQS Dead Letter Queue](./img/dlq-dead-letter-queue.png)

To start the Redrive process click the `Start DLQ redrive`.

![CloudWatch DLQ Alert](./img/dlq-redrive.png)

The default Redrive configuration should be fine. Click the `Poll for messages` button. This will will list the messages in the DLQ.

![CloudWatch DLQ Alert](./img/dlq-redrive-message-poll.png)

Once you have your list of messages, you can:

* Click on the message to see the contents

* Select and Delete any invalid messages or messages you do not want to process

* Send the messages back to their original queue for reprocessing

To send the messages back to their original queue:

* Select the message(s)

* Click the `DLQ redrive` button

The messages will be then sent back to the original queue and reprocessed again.

:::note
If the messages fail to process again, they will end up back in the DLQ.
:::