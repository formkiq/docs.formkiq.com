// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import {themes as prismThemes} from 'prism-react-renderer';
// const lightCodeTheme = require('prism-react-renderer/themes/github');
// const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'FormKiQ',
  tagline: 'Build your perfect document management solution with the FormKiQ Platform',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.formkiq.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'FormKiQ', // Usually your GitHub org/user name.
  projectName: 'formkiq', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        gtag: {
          trackingID: 'G-TSEZN0FVNG',
          anonymizeIP: true,
        },
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/formkiq/docs.formkiq.com/tree/main/',
          // docLayoutComponent: "@theme/DocPage",
          // sidebarPath: require.resolve('./sidebars.js'),
          docRootComponent: "@theme/DocRoot",
          docItemComponent: "@theme/ApiItem", // Derived from docusaurus-theme-openapi
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true
        }
      },
      // Replace with your project's social card
      navbar: {
        title: 'FormKiQ Docs',
        logo: {
          alt: 'FormKiQ Docs',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Home',
            href: 'https://formkiq.com',
            logo: {
              alt: 'FormKiQ Docs',
             src: 'img/logo.png',
            }
          },
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {href: 'https://formkiq.com/blog', label: 'Blog', position: 'left'},
          {href: '/docs/category/formkiq-api', label: 'API Reference', position: 'left'},
          {
            href: 'https://github.com/formkiq/formkiq-core',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'How to Get Support',
            items: [
              {
                label: 'GitHub Issues - FormKiQ Core',
                to: 'https://github.com/formkiq/formkiq-core/issues',
              },
              {
                label: 'FormKiQ Slack Community',
                to: 'https://join.slack.com/t/formkiqcommunity/shared_invite/zt-2ki1i21w1-9ZYagvhY7ex1pH5Cyg2O3g',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} FormKiQ, Inc. Built with Docusaurus.`,
      },
      algolia: {
      // Algolia application ID, found in the Algolia dashboard
      appId: 'GGHVG096JW',

      // Public API key: it is safe to include it in your frontend
      apiKey: 'f5ed2fcbe2c7680eb8e92953a38d004e',

      // Index name to target, found in the Algolia dashboard
      indexName: 'docs',

      // Optional: if Algolia is powered by DocSearch
      contextualSearch: true,

      searchPagePath: 'search',

      // Optional: Specifies search parameters
      //searchParameters: {},
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),

    plugins: [
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "openapi",
        docsPluginId: "classic",
        config: {
          formkiq: {
            specPath: "https://raw.githubusercontent.com/formkiq/formkiq-core/master/docs/openapi/openapi-jwt.yaml",
            outputDir: "docs/api-reference",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag"
            }
          }
        }
      }
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
        {
          to: '/docs/add-on-modules/modules/custom-domains',
          from: '/docs/pro-and-enterprise/modules/custom-domains',
        }],
        createRedirects(existingPath) {
          console.log('Checking path:', existingPath);  // Add debug logging
          if (existingPath.includes('/pro-and-enterprise')) {
            const newPath = existingPath.replace('/add-on-modules', '/pro-and-enterprise');
            console.log('Creating redirect:', newPath);  // Add debug logging
            return [newPath];
          }
          return undefined;
        }
      },
    ]
  ],

  themes: ["docusaurus-theme-openapi-docs"]
};

export default config;
