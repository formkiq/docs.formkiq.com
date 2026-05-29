/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const openApiSidebar = require("./docs/api-reference/sidebar.ts");
const openApiSidebarItems = openApiSidebar.default || openApiSidebar;

const categoryIndex = (title, description, slug) => ({
  type: "generated-index",
  title,
  description,
  slug,
});

const sidebars = {
  tutorialSidebar: [
    {
      type: "doc",
      id: "overview",
      label: "Overview",
    },
    {
      type: "doc",
      id: "choosing-formkiq",
      label: "Choosing FormKiQ",
    },
    {
      type: "category",
      label: "Getting Started",
      link: {
        type: "doc",
        id: "getting-started/index",
      },
      items: [
        "getting-started/quick-start",
        "getting-started/api-walkthrough",
        "getting-started/quick-start-local",
        "getting-started/cloudformation-troubleshooting",
      ],
    },
    {
      type: "category",
      label: "Platform Architecture",
      link: {
        type: "doc",
        id: "category-pages/platform-architecture",
      },
      items: [
        "platform/platform-overview",
        "platform/document_storage",
        "platform/document_console",
        {
          type: "doc",
          id: "platform/costs",
          label: "Costs & AWS Usage",
        },
        "platform/database_schema",
        "platform/reporting-and-analytics",
      ],
    },
    {
      type: "category",
      label: "Security & Governance",
      link: {
        type: "doc",
        id: "category-pages/security-governance",
      },
      items: [
        "platform/security",
        "platform/compliance-data-residency-and-data-sovereignty",
        "platform/multi-tenant-vs-multi-instance",
      ],
    },
    {
      type: "category",
      label: "Core Concepts & Features",
      link: {
        type: "doc",
        id: "category-pages/core-concepts-features",
      },
      items: [
        "features/documents",
        "features/attributes",
        "features/entities",
        "features/locales",
        "features/mappings",
        "features/ocr",
        "features/rulesets",
        "features/schemas",
        "features/search",
        "features/workflows",
      ],
    },
    {
      type: "category",
      label: "Modules & Commercial Offerings",
      link: {
        type: "doc",
        id: "category-pages/modules-commercial-offerings",
      },
      items: [
        {
          type: "category",
          label: "Installation",
          link: categoryIndex(
            "Installation",
            "FormKiQ commercial offering and module installation notes.",
            "/category/installation"
          ),
          items: [
            "formkiq-modules/installation/formkiq",
            "formkiq-modules/installation/opensearch-serverless",
            "formkiq-modules/installation/opensearch-managed",
            "formkiq-modules/installation/opensearch",
          ],
        },
        {
          type: "category",
          label: "Modules",
          link: categoryIndex(
            "Modules",
            "FormKiQ commercial and add-on modules.",
            "/category/modules"
          ),
          items: [
            "formkiq-modules/modules/document-versioning",
            "formkiq-modules/modules/document-generation",
            "formkiq-modules/modules/enhanced-fulltext-document-search",
            "formkiq-modules/modules/enhanced-document-ocr-and-classification",
            "formkiq-modules/modules/anti-malware-antivirus",
            "formkiq-modules/modules/full-encryption",
            "formkiq-modules/modules/single-sign-on-and-custom-jwt-authorizer",
            "formkiq-modules/modules/open_policy_agent",
            "formkiq-modules/modules/filesync-cli",
            "formkiq-modules/modules/document-gateways",
            "formkiq-modules/modules/custom-domains",
            "formkiq-modules/modules/e-signature",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "SDKs & API Integration",
      collapsed: false,
      link: {
        type: "doc",
        id: "category-pages/sdk-api-integration",
      },
      items: [
        {
          type: "link",
          label: "API Reference",
          href: "/docs/category/formkiq-api",
        },
        {
          type: "doc",
          id: "tutorials/Python/using-python-client-sdk",
          label: "Python SDK",
        },
        {
          type: "doc",
          id: "tutorials/TypeScript/using-typescript-client-sdk",
          label: "TypeScript SDK",
        },
        "how-tos/jwt-authentication-token",
        "tutorials/using-a-server-side-proxy",
        "tutorials/formkiq-document-api-with-zapier",
      ],
    },
    {
      type: "category",
      label: "Tutorials",
      link: {
        type: "doc",
        id: "category-pages/tutorials",
      },
      items: [
        {
          type: "category",
          label: "Documents",
          link: categoryIndex(
            "Documents",
            "Tutorials for the FormKiQ Documents API.",
            "/category/documents"
          ),
          items: [
            "tutorials/Documents/documents-api",
            "tutorials/Documents/document-attributes-api",
            "tutorials/Documents/site-classification-schemas",
            "tutorials/Documents/soft-deletes",
          ],
        },
        {
          type: "category",
          label: "Entities",
          link: categoryIndex(
            "Entity Types / Entities",
            "Tutorials for FormKiQ entity types and entities.",
            "/category/entity-types--entities"
          ),
          items: ["tutorials/Entities/entity-api"],
        },
        {
          type: "category",
          label: "Identity Management",
          link: categoryIndex(
            "Identity Management",
            "Identity provider and SSO tutorials for FormKiQ.",
            "/category/identify-management"
          ),
          items: [
            "tutorials/Identity Management/microsoft-entra-id",
            "tutorials/Identity Management/okta",
            "tutorials/Identity Management/google-workspace",
            "tutorials/Identity Management/google-workload-identity-federation",
            "tutorials/Identity Management/cognito-saml-provider",
          ],
        },
        {
          type: "category",
          label: "OpenSearch",
          link: categoryIndex(
            "OpenSearch",
            "OpenSearch tutorials.",
            "/category/opensearch"
          ),
          items: ["tutorials/Opensearch/opensearch-ssh-tunnel"],
        },
        {
          type: "category",
          label: "FileSync CLI",
          link: categoryIndex(
            "FileSync CLI",
            "FileSync CLI import and migration tutorials.",
            "/category/filesync-cli"
          ),
          items: [
            "tutorials/FileSync CLI/fk-cli-import-csv-data-migration",
            "tutorials/FileSync CLI/dynamodb-data-migration",
            "tutorials/FileSync CLI/Pre-Hook",
          ],
        },
        "tutorials/document-event-processing",
        "tutorials/open-policy-agent",
        "tutorials/ruleset",
        "tutorials/multitenant",
      ],
    },
    {
      type: "category",
      label: "How-to Guides",
      link: {
        type: "doc",
        id: "category-pages/how-to-guides",
      },
      items: [
        "how-tos/api-add-documents",
        "how-tos/api-add-document-tags",
        "how-tos/api-document-search",
        "how-tos/api-document-actions",
        "how-tos/migration-core-to-enterprise",
      ],
    },
    {
      type: "category",
      label: "Operations",
      link: {
        type: "doc",
        id: "category-pages/operations",
      },
      items: [
        "platform/updates_upgrades_and_rollbacks",
        "platform/backup_and_recovery",
        "platform/migration-and-data-import",
        "how-tos/set-up-status-monitoring-and-alerting",
        {
          type: "category",
          label: "Error Handling",
          link: categoryIndex(
            "Error Handling",
            "Overview of FormKiQ platform error handling.",
            "/category/error-handling"
          ),
          items: ["platform/error_handling/dlq"],
        },
      ],
    },
    {
      type: "category",
      label: "Troubleshooting",
      link: {
        type: "doc",
        id: "category-pages/troubleshooting",
      },
      items: ["troubleshooting/internal-server-error"],
    },
    {
      type: "category",
      label: "Changelog",
      link: {
        type: "doc",
        id: "category-pages/changelog",
      },
      items: [
        "changelog/v1.18.2",
        "changelog/v1.18.1",
        "changelog/v1.18.0",
        "changelog/v1.17.1",
        "changelog/v1.17.0",
        "changelog/v1.16.1",
        "changelog/v1.16.0",
        "changelog/v1.15.1",
        "changelog/v1.15.0",
        "changelog/v1.14.2",
        "changelog/v1.14.1",
        "changelog/v1.14.0",
        "changelog/v1.13.1",
        "changelog/v1.13.0",
      ],
    },
  ],
  openApiSidebar: [
    {
      type: "category",
      label: "FormKiQ",
      link: {
        type: "generated-index",
        title: "FormKiQ API",
        description: "FormKiQ is an API-first and battle-tested document management platform. The FormKiQ Document API provides endpoints to enable document layer and document management functionality into your application, with a web-based document console available as an intuitive user interface.",
        slug: "/category/formkiq-api"
      },
      items: openApiSidebarItems
    }
  ]
  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

module.exports = sidebars;
