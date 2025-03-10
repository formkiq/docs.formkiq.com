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
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],
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
      // @ts-ignore
      items: require("./docs/api-reference/sidebar.ts")
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
