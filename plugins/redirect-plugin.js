// plugins/redirect-plugin.js
module.exports = function redirectPlugin(context, options) {
    return {
      name: 'redirect-plugin',
      async contentLoaded({content, actions}) {
        const {addRoute} = actions;
        
        addRoute({
            path: '/docs/pro-and-enterprise/modules/custom-domains',
            component: '@site/src/components/redirects/custom-domains',
            exact: true
          });
          addRoute({
            path: '/docs/pro-and-enterprise/modules/anti-malware-antivirus',
            component: '@site/src/components/redirects/anti-malware-antivirus',
            exact: true
          });
          addRoute({
            path: '/docs/pro-and-enterprise/modules/document-generation',
            component: '@site/src/components/redirects/document-generation',
            exact: true
          });
          addRoute({
            path: '/docs/pro-and-enterprise/modules/document-versioning',
            component: '@site/src/components/redirects/document-versioning',
            exact: true
          });
          addRoute({
            path: '/docs/pro-and-enterprise/modules/e-signature',
            component: '@site/src/components/redirects/e-signature',
            exact: true
          });
          addRoute({
            path: '/docs/pro-and-enterprise/modules/enhanced-document-ocr',
            component: '@site/src/components/redirects/enhanced-document-ocr',
            exact: true
          });
          addRoute({
            path: '/docs/pro-and-enterprise/modules/enhanced-fulltext-document-search',
            component: '@site/src/components/redirects/enhanced-fulltext-document-search',
            exact: true
          });
          addRoute({
            path: '/docs/pro-and-enterprise/modules/filesync-cli',
            component: '@site/src/components/redirects/filesync-cli',
            exact: true
          });
          addRoute({
            path: '/docs/pro-and-enterprise/modules/full-encryption',
            component: '@site/src/components/redirects/full-encryption',
            exact: true
          });
          addRoute({
            path: '/docs/pro-and-enterprise/modules/onlyoffice-document-collaboration',
            component: '@site/src/components/redirects/onlyoffice-document-collaboration',
            exact: true
          });
          addRoute({
            path: '/docs/pro-and-enterprise/modules/open_policy_agent',
            component: '@site/src/components/redirects/open-policy-agent',
            exact: true
          });
          addRoute({
            path: '/docs/pro-and-enterprise/modules/rulesets',
            component: '@site/src/components/redirects/rulesets',
            exact: true
          });
          addRoute({
            path: '/docs/pro-and-enterprise/modules/single-sign-on-and-custom-jwt-authorizer',
            component: '@site/src/components/redirects/single-sign-on-and-custom-jwt-authorizer',
            exact: true
          });
          addRoute({
            path: '/docs/pro-and-enterprise/modules/tag-schema',
            component: '@site/src/components/redirects/tag-schema',
            exact: true
          });
      },
    };
  };