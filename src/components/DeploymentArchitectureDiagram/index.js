import React from 'react';
import DiagramTabs from '@site/src/components/DiagramTabs';
import diagram from '@site/docs/img/formkiq_cloudformation_architecture.png';

export default function DeploymentArchitectureDiagram() {
  return (
    <DiagramTabs
      label="FormKiQ CloudFormation deployment"
      diagram={
        <img
          src={diagram}
          alt="AWS CloudFormation provisions FormKiQ Core services and configured additional modules. Full description in the Text view."
          width={1221}
          height={765}
          style={{width: '100%', height: 'auto'}}
        />
      }>
      <h3>CloudFormation deployment in text</h3>
      <p>
        AWS CloudFormation provisions FormKiQ infrastructure in your AWS account
        using infrastructure-as-code templates. The diagram groups the services
        into the core platform and additional features or modules.
      </p>
      <h4>Core platform services</h4>
      <ul>
        <li>Amazon API Gateway exposes the document APIs.</li>
        <li>Amazon S3 stores document content and Console assets.</li>
        <li>Amazon DynamoDB stores document metadata and operational state.</li>
        <li>AWS Lambda runs API handlers and document processing.</li>
        <li>Amazon CloudFront delivers the Console web interface.</li>
        <li>Amazon Cognito provides the default user identity service.</li>
      </ul>
      <h4>Additional features and modules</h4>
      <p>
        Depending on the installed modules and configuration, processing and
        indexing can integrate with Amazon Textract for OCR, Amazon OpenSearch
        for search, Amazon Comprehend for language analysis, and Amazon Bedrock
        for AI processing. The illustration connects the core data and compute
        layer with these additional capabilities; it does not imply that every
        service is installed in every deployment.
      </p>
    </DiagramTabs>
  );
}
