import React from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import ThemedImage from '@theme/ThemedImage';
import DiagramTabs from '@site/src/components/DiagramTabs';
import ZoomLink from '@site/src/components/DiagramTabs/ZoomLink';
import lightDiagram from '@site/static/img/formkiq-deployment-technical-light-v1.19.2.webp';
import darkDiagram from '@site/static/img/formkiq-deployment-technical-dark-v1.19.2.webp';

export default function DeploymentArchitectureDiagram() {
  const {colorMode} = useColorMode();
  const fullSize = colorMode === 'dark' ? darkDiagram : lightDiagram;

  return (
    <DiagramTabs
      label="FormKiQ CloudFormation deployment"
      diagram={
        <ZoomLink
          href={fullSize}
          diagramLabel="FormKiQ CloudFormation deployment">
          <ThemedImage
            sources={{light: lightDiagram, dark: darkDiagram}}
            alt="FormKiQ v1.19.2 deployment: CloudFormation provisions API, storage, SNS and SQS, Lambda and Tesseract OCR, Console, identity, and operations resources, with configured search, processing, policy, and document capabilities. Full description in the Text view."
            width={1536}
            height={1024}
            style={{width: '100%', height: 'auto'}}
          />
        </ZoomLink>
      }>
      <h3>FormKiQ v1.19.2 deployment in text</h3>
      <p>
        AWS CloudFormation provisions FormKiQ v1.19.2 infrastructure in your AWS
        account using infrastructure-as-code templates and deployment parameters.
        Amazon CloudWatch provides monitoring. CloudFormation connects to two
        groups in the diagram:
      </p>
      <ul>
        <li>
          <strong>Provision resources:</strong> the gray connector (white in dark
          mode) leads to the core platform resources.
        </li>
        <li>
          <strong>Enable capabilities:</strong> the orange connector leads to
          capabilities enabled by the edition, installed modules, and
          configuration.
        </li>
      </ul>
      <p>
        This is a deployment overview. The connectors show provisioning and
        configuration relationships; runtime flows are shown in the platform
        architecture diagram.
      </p>
      <h4>Core platform</h4>
      <p>
        Resources are grouped by role, in the same row-by-row order as the
        diagram. Each group can span multiple CloudFormation templates and
        resources.
      </p>
      <ul>
        <li>
          <strong>API access:</strong> Amazon API Gateway exposes JWT, IAM with
          Signature Version 4, and API key endpoints backed by a shared FormKiQ
          API Lambda. Amazon Cognito provides the default JWT identity service.
        </li>
        <li>
          <strong>Processing:</strong> AWS Lambda runs object handlers and
          document actions. Core OCR uses a Lambda processor with Tesseract;
          enhanced OCR integrations are configured separately.
        </li>
        <li>
          <strong>Storage:</strong> Amazon S3 stores document content. Amazon
          DynamoDB stores metadata, JSON attributes, cache, sync, and operational
          state. DynamoDB streams support configured search indexing.
        </li>
        <li>
          <strong>Events + queues:</strong> Amazon SNS publishes document and
          action notifications. Amazon SQS queues support document actions and
          object updates, with a dead-letter queue for failed processing.
        </li>
        <li>
          <strong>Console + identity:</strong> Amazon CloudFront and Amazon S3
          deliver the Console web interface. Amazon Cognito manages user identity
          and authentication.
        </li>
        <li>
          <strong>Operations:</strong> Amazon CloudWatch provides logs and
          monitoring, AWS IAM roles and policies control service permissions,
          and AWS Systems Manager (SSM) Parameter Store holds deployment
          configuration and resource references.
        </li>
      </ul>
      <h4>Configured capabilities</h4>
      <p>Availability depends on the edition, installed modules, and configuration.</p>
      <ul>
        <li>
          <strong>Search:</strong> Typesense or OpenSearch provides search when
          configured. An indexing Lambda consumes DynamoDB streams to update
          the configured search engine.
        </li>
        <li>
          <strong>Processing integrations:</strong> Amazon Textract supports
          enhanced OCR, Amazon Bedrock supports AI processing, and Amazon
          Comprehend supports language analysis.
        </li>
        <li>
          <strong>Events + policy:</strong> Amazon EventBridge supports
          configured event routing, including commercial audit events. Open
          Policy Agent (OPA) adds API policy checks when enabled.
        </li>
        <li>
          <strong>Document modules:</strong> configured capabilities include
          antivirus scanning, document generation, e-signatures, workflows,
          and reviews.
        </li>
      </ul>
      <p>
        The orange connector covers configured resources and integrations; it
        does not imply that CloudFormation creates managed AI services themselves.
        Availability depends on the edition, installed modules, and deployment
        configuration.
      </p>
    </DiagramTabs>
  );
}
