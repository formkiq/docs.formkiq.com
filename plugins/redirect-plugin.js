// plugins/redirect-plugin.js
module.exports = function redirectPlugin(context, options) {
    return {
      name: 'redirect-plugin',
      async contentLoaded({content, actions}) {
        const {addRoute} = actions;
        
        addRoute({
          path: '/docs/platform/api_security',
          component: '@site/src/components/redirects/security',
          exact: true
        });

        addRoute({
          path: '/docs/category/api-reference',
          component: '@site/src/components/redirects/api-reference',
          exact: true
        });

        addRoute({
          path: '/docs/category/error-handling',
          component: '@site/src/components/redirects/error-handling',
          exact: true
        });

        addRoute({
          path: '/docs/platform/backup/',
          component: '@site/src/components/redirects/backup-and-recovery',
          exact: true
        });


        addRoute({
          path: '/docs/platform/backup/dynamodb',
          component: '@site/src/components/redirects/backup-and-recovery',
          exact: true
        });

        addRoute({
          path: '/docs/platform/backup/s3',
          component: '@site/src/components/redirects/backup-and-recovery',
          exact: true
        });

        addRoute({
          path: '/docs/pro-and-enterprise/modules/custom-domains',
          component: '@site/src/components/redirects/custom-domains',
          exact: true
        });
        addRoute({
          path: '/docs/add-on-modules/modules/custom-domains',
          component: '@site/src/components/redirects/custom-domains',
          exact: true
        });

        addRoute({
          path: '/docs/pro-and-enterprise/modules/anti-malware-antivirus',
          component: '@site/src/components/redirects/anti-malware-antivirus',
          exact: true
        });
        addRoute({
          path: '/docs/add-on-modules/modules/anti-malware-antivirus',
          component: '@site/src/components/redirects/anti-malware-antivirus',
          exact: true
        });

        addRoute({
          path: '/docs/pro-and-enterprise/modules/document-generation',
          component: '@site/src/components/redirects/document-generation',
          exact: true
        });
        addRoute({
          path: '/docs/add-on-modules/modules/document-generation',
          component: '@site/src/components/redirects/document-generation',
          exact: true
        });

        addRoute({
          path: '/docs/pro-and-enterprise/modules/document-versioning',
          component: '@site/src/components/redirects/document-versioning',
          exact: true
        });
        addRoute({
          path: '/docs/add-on-modules/modules/document-versioning',
          component: '@site/src/components/redirects/document-versioning',
          exact: true
        });

        addRoute({
          path: '/docs/add-on-modules/modules/e-signature',
          component: '@site/src/components/redirects/e-signature',
          exact: true
        });
        addRoute({
          path: '/docs/pro-and-enterprise/modules/e-signature',
          component: '@site/src/components/redirects/e-signature',
          exact: true
        });
        
        addRoute({
          path: '/docs/add-on-modules/modules/enhanced-document-ocr',
          component: '@site/src/components/redirects/enhanced-document-ocr-and-classification',
          exact: true
        });
        addRoute({
          path: '/docs/pro-and-enterprise/modules/enhanced-document-ocr',
          component: '@site/src/components/redirects/enhanced-document-ocr-and-classification',
          exact: true
        });
        addRoute({
          path: '/docs/formkiq-modules/modules/enhanced-document-ocr',
          component: '@site/src/components/redirects/enhanced-document-ocr-and-classification',
          exact: true
        });
        
        addRoute({
          path: '/docs/add-on-modules/modules/enhanced-fulltext-document-search',
          component: '@site/src/components/redirects/enhanced-fulltext-document-search',
          exact: true
        });
        addRoute({
          path: '/docs/pro-and-enterprise/modules/enhanced-fulltext-document-search',
          component: '@site/src/components/redirects/enhanced-fulltext-document-search',
          exact: true
        });
        
        addRoute({
          path: '/docs/add-on-modules/modules/filesync-cli',
          component: '@site/src/components/redirects/filesync-cli',
          exact: true
        });
        addRoute({
          path: '/docs/pro-and-enterprise/modules/filesync-cli',
          component: '@site/src/components/redirects/filesync-cli',
          exact: true
        });
        addRoute({
          path: '/docs/formkiq-modules/modules/filesync-cli',
          component: '@site/src/components/redirects/filesync-cli',
          exact: true
        });
        addRoute({
          path: '/docs/category/filesync-cli',
          component: '@site/src/components/redirects/formkiq-cli-category',
          exact: true
        });
        addRoute({
          path: '/docs/tutorials/FileSync CLI/Pre-Hook',
          component: '@site/src/components/redirects/formkiq-cli-pre-hook',
          exact: true
        });
        addRoute({
          path: '/docs/tutorials/FileSync%20CLI/Pre-Hook',
          component: '@site/src/components/redirects/formkiq-cli-pre-hook',
          exact: true
        });
        
        addRoute({
          path: '/docs/add-on-modules/modules/full-encryption',
          component: '@site/src/components/redirects/full-encryption',
          exact: true
        });
        addRoute({
          path: '/docs/pro-and-enterprise/modules/full-encryption',
          component: '@site/src/components/redirects/full-encryption',
          exact: true
        });
        
        addRoute({
          path: '/docs/add-on-modules/modules/onlyoffice-document-collaboration',
          component: '@site/src/components/redirects/onlyoffice-document-collaboration',
          exact: true
        });
        addRoute({
          path: '/docs/pro-and-enterprise/modules/onlyoffice-document-collaboration',
          component: '@site/src/components/redirects/onlyoffice-document-collaboration',
          exact: true
        });
        
        addRoute({
          path: '/docs/add-on-modules/modules/open_policy_agent',
          component: '@site/src/components/redirects/open-policy-agent',
          exact: true
        });
        addRoute({
          path: '/docs/pro-and-enterprise/modules/open_policy_agent',
          component: '@site/src/components/redirects/open-policy-agent',
          exact: true
        });
        
        addRoute({
          path: '/docs/add-on-modules/modules/rulesets',
          component: '@site/src/components/redirects/rulesets',
          exact: true
        });
        addRoute({
          path: '/docs/pro-and-enterprise/modules/rulesets',
          component: '@site/src/components/redirects/rulesets',
          exact: true
        });
        addRoute({
          path: '/docs/formkiq-modules/modules/rulesets',
          component: '@site/src/components/redirects/rulesets',
          exact: true
        });      
        
        addRoute({
          path: '/docs/add-on-modules/modules/single-sign-on-and-custom-jwt-authorizer',
          component: '@site/src/components/redirects/single-sign-on-and-custom-jwt-authorizer',
          exact: true
        });
        addRoute({
          path: '/docs/pro-and-enterprise/modules/single-sign-on-and-custom-jwt-authorizer',
          component: '@site/src/components/redirects/single-sign-on-and-custom-jwt-authorizer',
          exact: true
        });
        
        addRoute({
          path: '/docs/add-on-modules/modules/tag-schema',
          component: '@site/src/components/redirects/tag-schema',
          exact: true
        });
        addRoute({
          path: '/docs/pro-and-enterprise/modules/tag-schema',
          component: '@site/src/components/redirects/tag-schema',
          exact: true
        });
        addRoute({
          path: '/docs/formkiq-modules/modules/tag-schema',
          component: '@site/src/components/redirects/tag-schema',
          exact: true
        });
        addRoute({
          path: '/docs/tutorials/soft-deletes',
          component: '@site/src/components/redirects/soft-deletes',
          exact: true
        });
        addRoute({
          path: '/docs/tutorials/site-classification-schemas',
          component: '@site/src/components/redirects/site-classification-schemas',
          exact: true
        });
        addRoute({
          path: '/docs/tutorials/build-event-driven-document-processing-pipeline',
          component: '@site/src/components/redirects/event-driven-document-processing-pipeline',
          exact: true
        });
        addRoute({
          path: '/docs/tutorials/document-event-processing',
          component: '@site/src/components/redirects/document-event-processing',
          exact: true
        });
        addRoute({
          path: '/docs/tutorials/using-a-server-side-proxy',
          component: '@site/src/components/redirects/server-side-proxy',
          exact: true
        });
        addRoute({
          path: '/docs/tutorials/formkiq-document-api-with-zapier',
          component: '@site/src/components/redirects/zapier-integration',
          exact: true
        });
        addRoute({
          path: '/docs/tutorials/build-scalable-solutions-using-formkiq',
          component: '@site/src/components/redirects/scalable-solutions',
          exact: true
        });
        addRoute({
          path: '/docs/tutorials/build-document-review-approval-workflow',
          component: '@site/src/components/redirects/document-review-approval-workflow',
          exact: true
        });
        addRoute({
          path: '/docs/tutorials/build-ocr-searchable-archive',
          component: '@site/src/components/redirects/ocr-searchable-archive',
          exact: true
        });
        addRoute({
          path: '/docs/tutorials/open-policy-agent',
          component: '@site/src/components/redirects/tutorial-open-policy-agent',
          exact: true
        });
        addRoute({
          path: '/docs/tutorials/ruleset',
          component: '@site/src/components/redirects/tutorial-ruleset',
          exact: true
        });
        addRoute({
          path: '/docs/tutorials/multitenant',
          component: '@site/src/components/redirects/multitenant',
          exact: true
        });
      },
    };
  };
