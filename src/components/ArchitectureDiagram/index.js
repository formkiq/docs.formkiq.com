import React from 'react';
import ThemedImage from '@theme/ThemedImage';
import DiagramTabs from '@site/src/components/DiagramTabs';
import lightDiagram from '@site/static/img/formkiq-architecture-technical-light-v1.19.2.png';
import darkDiagram from '@site/static/img/formkiq-architecture-technical-dark-v1.19.2.png';
import TextView from './TextView';

export default function ArchitectureDiagram() {
  return (
    <DiagramTabs
      label="FormKiQ platform architecture"
      diagram={
        <ThemedImage
          alt="FormKiQ v1.19.2 architecture: API authentication and shared Lambda handler, S3 storage, DynamoDB metadata, SNS and SQS processing, and configured capabilities. Full description in the Text view."
          sources={{light: lightDiagram, dark: darkDiagram}}
          width={1536}
          height={1024}
          style={{width: '100%', height: 'auto'}}
        />
      }>
      <TextView />
    </DiagramTabs>
  );
}
