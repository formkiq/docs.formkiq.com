---
sidebar_position: 1
title: Overview
description: FormKiQ is an API-first document management platform that deploys into your own AWS account. Learn what it does, how it is deployed, and where to start.
---

import ArchitectureDiagram from '@site/src/components/ArchitectureDiagram';
import DeploymentArchitectureDiagram from '@site/src/components/DeploymentArchitectureDiagram';

# Overview

FormKiQ is an API-first document management platform that deploys into your own [Amazon Web Services](https://aws.amazon.com) account. Use it as a turnkey document management system, or as a secure and scalable document layer behind your own applications.

Document management is at the core of most organizations, with numerous documents that need to be stored, tracked, managed and organized. FormKiQ is designed to be flexible, customizable and cost-effective, so you can add those capabilities without building document infrastructure from scratch.

Common use cases include document workflows in regulated industries such as healthcare, financial services, and the public sector, where teams need control over data residency, access permissions, audit trails, and retention. See [Compliance, Data Residency, and Data Sovereignty](/docs/platform/compliance-data-residency-and-data-sovereignty) and the [Regulated Production Deployment Checklist](/docs/platform/regulated-production-deployment-checklist) for guidance on configuring and operating these deployments.

FormKiQ also suits companies seeking more control over their document infrastructure. Deploying in your own AWS account lets you choose regions, manage access and encryption keys, and set backup and retention policies. For example, companies serving customers in the European Union can choose an EU AWS region for primary document storage and assess where backups, replicas, and external integrations process data as part of their residency and sovereignty planning.

:::tip New to FormKiQ?
Read [Choosing FormKiQ](/docs/category/choosing-formkiq) to see whether it fits your use case, or go straight to the [Quick Start (AWS)](/docs/getting-started/quick-start) to install it.
:::

## Key Features

- **API-first and headless.** Every capability is available through the [FormKiQ API](/docs/category/formkiq-api), with SDKs for [Python](/docs/tutorials/using-python-client-sdk), [TypeScript](/docs/tutorials/using-typescript-client-sdk) and [Java](/docs/tutorials/using-java-client-sdk), and a [CLI](/docs/formkiq-modules/modules/formkiq-cli). The web UI is separate from the backend, so you can integrate with web applications, mobile apps and backend services. The React-based [FormKiQ Web (Document Console)](/docs/platform/document_console) is included and serves as a reference implementation.
- **Runs in your AWS account.** Primary document content and metadata are stored in your AWS account. Configured external integrations may process or store data elsewhere. See [Security](/docs/platform/security).
- **Serverless and scalable.** FormKiQ is built on serverless AWS services, so it scales from the smallest team to the largest corporation and you only pay for what you use. See [AWS Cost Planning](/docs/platform/costs).
- **Structured metadata.** Organize documents with [attributes](/docs/features/attributes), [schemas](/docs/features/schemas), and [entities](/docs/features/entities).
- **Search and OCR.** Find documents with [search](/docs/features/search) and extract text with [OCR](/docs/features/ocr).
- **Automation.** Route and process documents with [workflows](/docs/features/workflows), [rulesets](/docs/features/rulesets), and [mappings](/docs/features/mappings).
- **Add-on modules.** Extend the platform with [antivirus scanning](/docs/formkiq-modules/modules/anti-malware-antivirus), [document generation](/docs/formkiq-modules/modules/document-generation), [e-signature](/docs/formkiq-modules/modules/e-signature), [single sign-on](/docs/formkiq-modules/modules/single-sign-on-and-custom-jwt-authorizer), and more.
- **Business Solutions.** Work with purpose-built experiences in FormKiQ Web, including [Contract Management](/docs/business-solutions/contract-management) for agreements, reviews, signing, and lifecycle activity. Availability depends on your licensed offering and configuration.

Feature availability depends on your edition and installed modules. See [Core Concepts & Features](/docs/category/features) and [Modules & Commercial Offerings](/docs/category/formkiq-modules) for the full list.

## Deployment

FormKiQ deploys into your AWS account using [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) templates, giving you full control of your documents. Because the infrastructure is defined as code, deployments are repeatable, and changes can be tracked and rolled back if necessary.

See the [installation links](/docs/getting-started/quick-start#installation-links) for the supported AWS regions.

<DeploymentArchitectureDiagram />

## Architecture

<ArchitectureDiagram />

See the [Platform Overview](/docs/platform/overview) for the request flows, optional components, and diagram sources.

## Licensing

FormKiQ is an open core product. The core document management functionality, [FormKiQ Core](https://github.com/formkiq/formkiq-core), is available under an open source license. Additional document management functionality, add-on modules, professional services, and onboarding and operational support are available with the FormKiQ Essentials, Advanced, and Enterprise offerings. See [Modules & Commercial Offerings](/docs/category/formkiq-modules) or [formkiq.com](https://formkiq.com) for details.

## Support

For installation support, feedback, or updates:

- Join the [FormKiQ Slack Community](https://join.slack.com/t/formkiqcommunity/shared_invite/zt-2ki1i21w1-9ZYagvhY7ex1pH5Cyg2O3g).
- Report bugs and request features through [GitHub Issues](https://github.com/formkiq/formkiq-core/issues).

:::note
Commercially licensed FormKiQ offerings have additional support options, including the [FormKiQ Support Portal](https://formkiq.freshdesk.com/support/home), Zoom sessions, and a private Slack channel.
:::

## Where to Go Next

- [Choosing FormKiQ](/docs/category/choosing-formkiq): decide whether FormKiQ fits your use case.
- [Quick Start (AWS)](/docs/getting-started/quick-start): install FormKiQ into your AWS account.
- [API Walkthrough](/docs/getting-started/api-walkthrough): make your first API calls.
- [Platform Overview](/docs/platform/overview): understand the request flows and components.
- [Tutorials](/docs/category/tutorials): follow step-by-step examples.
