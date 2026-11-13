import React from 'react';
import Link from '@docusaurus/Link';

export default function ArchitectureTextView() {
  return (
    <>
      <h3>Platform architecture in text</h3>
      <p>
        FormKiQ v1.19.2 runs in your AWS account. AWS CloudFormation provisions
        the infrastructure, and Amazon CloudWatch provides monitoring and logs.
        The FormKiQ Console is served through Amazon CloudFront and Amazon S3.
        The Console, other applications, SDKs, FormKiQ CLI, and AWS workloads
        access the platform through the FormKiQ API.
      </p>

      <h4>API access and document processing</h4>
      <ol>
        <li>
          <strong>Authenticate through Amazon API Gateway.</strong> Callers use
          a JWT endpoint with Amazon Cognito by default, an IAM endpoint with
          AWS Signature Version 4, or an API key endpoint supporting custom claims.
          All three invoke the same FormKiQ API Lambda.
        </li>
        <li>
          <strong>Authorize the operation.</strong> The API Lambda checks site
          access and operation permissions, with Open Policy Agent (OPA) policy
          checks when enabled.
        </li>
        <li>
          <strong>Store content and metadata.</strong> Amazon S3 stores document
          content. Amazon DynamoDB stores metadata, JSON attributes, and operational
          state. The API coordinates access to these stores and publishes document
          or action notifications through Amazon SNS.
        </li>
        <li>
          <strong>Handle object events.</strong> S3 object events trigger FormKiQ
          event handlers. Lambda functions and staging or update queues support
          ingestion and document-state updates. The handlers also publish events
          to SNS.
        </li>
        <li>
          <strong>Process document actions.</strong> An SNS action subscription
          sends work to an Amazon SQS queue. The action Lambda processes that work
          and updates document state in DynamoDB.
        </li>
        <li>
          <strong>Handle processing failures.</strong> Staging, update, and action
          work that exhausts its configured queue retries is sent to the SQS
          dead-letter queue for investigation and recovery.
        </li>
      </ol>

      <h4>Configured capabilities</h4>
      <ul>
        <li>
          <strong>Amazon EventBridge:</strong> document actions can send events
          to EventBridge. The commercial platform also supports audit-event routing.
        </li>
        <li>
          <strong>Processing modules:</strong> configured features and modules
          support OCR, AI processing, antivirus scanning, document generation,
          e-signatures, workflows, and reviews.
        </li>
        <li>
          <strong>OpenSearch or Typesense:</strong> DynamoDB streams feed an
          indexing Lambda that updates the configured search engine. This indexing
          path is separate from the document-action queue.
        </li>
      </ul>
      <p>
        The diagram's orange connectors identify configured capabilities;
        availability depends on the deployment, edition, and installed modules.
        This is a logical API view. See <Link to="/docs/platform/document_storage">
          Document Storage
        </Link> for file-transfer details and <Link to="/docs/platform/security">
          Security
        </Link> for access-control configuration.
      </p>
    </>
  );
}
