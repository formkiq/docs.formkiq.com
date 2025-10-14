// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'FormKiQ',
  tagline: 'Build your perfect document management solution with the FormKiQ Platform',
  favicon: 'img/favicon.ico',
  url: 'https://docs.formkiq.com',
  baseUrl: '/',
  organizationName: 'FormKiQ',
  projectName: 'formkiq',
  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'throw',
    }
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
          editUrl: 'https://github.com/formkiq/docs.formkiq.com/tree/main/',
          docRootComponent: "@theme/DocRoot",
          docItemComponent: "@theme/ApiItem",
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
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
        appId: 'GGHVG096JW',
        apiKey: 'f5ed2fcbe2c7680eb8e92953a38d004e',
        indexName: 'docs',
        contextualSearch: true,
        searchPagePath: 'search',
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
    require.resolve('./plugins/redirect-plugin.js')
  ],

  themes: ["docusaurus-theme-openapi-docs"]
};

export default config;