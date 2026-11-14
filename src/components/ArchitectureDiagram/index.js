import React from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import ThemedImage from '@theme/ThemedImage';
import DiagramTabs from '@site/src/components/DiagramTabs';
import ZoomLink from '@site/src/components/DiagramTabs/ZoomLink';
import lightDiagram from '@site/static/img/formkiq-architecture-technical-light-v1.19.2.webp';
import darkDiagram from '@site/static/img/formkiq-architecture-technical-dark-v1.19.2.webp';
import TextView from './TextView';

export default function ArchitectureDiagram() {
  const {colorMode} = useColorMode();
  const fullSize = colorMode === 'dark' ? darkDiagram : lightDiagram;

  return (
    <DiagramTabs
      label="FormKiQ platform architecture"
      diagram={
        <ZoomLink href={fullSize} diagramLabel="FormKiQ platform architecture">
          <ThemedImage
            alt="FormKiQ v1.19.2 architecture: API authentication and shared Lambda handler, S3 storage, DynamoDB metadata, SNS and SQS processing, and configured capabilities. Full description in the Text view."
            sources={{light: lightDiagram, dark: darkDiagram}}
            width={1536}
            height={1024}
            style={{width: '100%', height: 'auto'}}
          />
        </ZoomLink>
      }>
      <TextView />
    </DiagramTabs>
  );
}
