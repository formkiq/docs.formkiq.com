---
sidebar_position: 7
---

# Updates, Upgrades, and Rollbacks

## Overview

This page is an operations runbook for updating FormKiQ deployments, upgrading modules, and planning rollback or recovery if an update does not behave as expected.

Most FormKiQ updates are performed through AWS CloudFormation stack updates. CloudFormation can automatically roll back failed infrastructure updates, but rollback planning should not stop there. A stack rollback does not automatically undo document writes, DynamoDB changes, S3 object changes, OpenSearch index changes, user actions, or external integration side effects that occurred after the update started.

:::warning
Treat production updates as operational changes. Confirm backups, stack state, parameters, module dependencies, and verification steps before starting.
:::

## Release Notifications

Stay informed about FormKiQ updates and security patches through the following channels.

### GitHub Notifications

Watch the [FormKiQ Core repository](https://github.com/formkiq/formkiq-core) for releases:

1. Open the repository on GitHub.
2. Select **Watch**.
3. Choose **Custom**.
4. Enable **Releases**.

Release RSS feed:

```text
https://github.com/formkiq/formkiq-core/releases.atom
```

### Community Channels

- [FormKiQ Slack Community](https://join.slack.com/t/formkiqcommunity/shared_invite/zt-2ki1i21w1-9ZYagvhY7ex1pH5Cyg2O3g)
- [FormKiQ release and security mailing list](https://formkiq.com/updates#mailing-list)

For production environments, subscribe to release notifications so security or compatibility updates are not missed.

## Update Types

Different update types carry different risk and rollback considerations.

| Update type | Typical change | Rollback considerations |
| --- | --- | --- |
| FormKiQ Core version update | Replace the FormKiQ CloudFormation template with a newer release template. | Infrastructure can roll back, but data and index changes may need separate recovery planning. |
| Parameter-only update | Change stack parameters while keeping the same template. | Preserve all current parameters that should not change. Review parameter defaults carefully. |
| Optional VPC attachment | Update FormKiQ parameters to connect to a VPC stack. | Network, subnet, and security group mistakes can affect access to services. |
| Commercial module update | Install or update a module template or module-related FormKiQ parameters. | Module dependencies and downstream services may need separate validation. |
| Search backend update | Change OpenSearch, Typesense, or full-text search configuration. | May require snapshots, reindexing, or search-specific recovery. |
| Rollback to previous version | Reapply a previous template or parameter set. | Confirm whether the previous version is compatible with current data and module state. |

For the optional VPC attachment workflow, see [Quick Start: Attach the VPC Stack to FormKiQ](/docs/getting-started/quick-start#update-formkiq).

## Pre-Upgrade Planning

### Version Assessment

Before updating, identify the current and target versions.

| Check | How |
| --- | --- |
| Current API version | Call [`GET /version`](/docs/api-reference/get-version). |
| Current stack template | Review the CloudFormation stack template and parameters. |
| Current stack outputs | Export or save CloudFormation outputs such as API URLs and console URLs. |
| Target version | Review the [Changelog](/docs/category/changelog) and release notes. |
| Module versions | Review installed module templates, parameters, and module documentation. |

:::note
FormKiQ 1.x endpoints may be deprecated over time, but removals are generally expected for a future major version such as FormKiQ 2.x. Review release notes for the target version before upgrading.
:::

### CloudFormation Preflight

Confirm the stack is healthy before starting:

- The root stack is not in `ROLLBACK_FAILED`, `UPDATE_ROLLBACK_FAILED`, or another failed terminal state.
- Nested stacks are complete and healthy.
- No CloudFormation update is already in progress.
- Stack drift has been reviewed if your organization changes AWS resources outside CloudFormation.
- Existing parameters and outputs have been recorded.
- IAM capabilities required by the update are understood.
- AWS service quotas are sufficient for any new resources.
- Region support is confirmed for any new or optional services.

Useful AWS CLI checks:

```bash
aws cloudformation describe-stacks \
  --stack-name your-formkiq-stack
```

```bash
aws cloudformation detect-stack-drift \
  --stack-name your-formkiq-stack
```

```bash
aws cloudformation describe-stack-events \
  --stack-name your-formkiq-stack \
  --max-items 20
```

For event inspection during failed deployments, see [CloudFormation Troubleshooting](/docs/getting-started/cloudformation-troubleshooting/).

### Backup and Recovery Checkpoint

For production environments, confirm recovery posture before upgrading.

| Area | Check |
| --- | --- |
| DynamoDB | Confirm Point-in-Time Recovery is enabled for FormKiQ tables that require recovery. |
| S3 | Confirm versioning, retention, and lifecycle settings match recovery requirements. |
| OpenSearch | Confirm snapshots are configured if enhanced full-text search is installed. |
| Configuration | Export current CloudFormation template, parameters, outputs, and module settings. |
| External systems | Confirm webhooks, EventBridge consumers, identity providers, and downstream integrations can tolerate the update window. |
| Test restore | For high-risk updates, test restore or rollback procedures in a non-production environment. |

For broader recovery planning, see [Backup and Recovery](/docs/platform/backup_and_recovery).

Export the current template for reference:

```bash
aws cloudformation get-template \
  --stack-name your-formkiq-stack \
  --query TemplateBody \
  --output json > formkiq-template-before-upgrade.json
```

Export stack parameters and outputs:

```bash
aws cloudformation describe-stacks \
  --stack-name your-formkiq-stack \
  --query "Stacks[0].{Parameters:Parameters,Outputs:Outputs}" \
  --output json > formkiq-stack-state-before-upgrade.json
```

### Testing Strategy

Use a non-production environment for significant updates whenever possible.

Test at least:

- Console login
- JWT, IAM, or API key authentication paths used by your integrations
- Document create, upload, download, update, and delete behavior
- Search and full-text search if enabled
- OCR, IDP, rulesets, workflows, mappings, and webhooks if enabled
- OpenSearch, Typesense, antivirus, or commercial modules if installed
- Custom integrations and downstream event consumers
- Permission and compliance controls that are business-critical

## Upgrade Methods

### CloudFormation Stack Update

Use CloudFormation stack update for most FormKiQ updates.

1. Open the CloudFormation console.
2. Select the root FormKiQ stack.
3. Choose **Update**.
4. Choose whether to replace the template or reuse the current template.
5. Review every parameter. Preserve existing values unless the release notes or your change plan requires a change.
6. Review IAM capability acknowledgements.
7. Review the change set if available.
8. Start the update.
9. Monitor root and nested stack events until the update completes.

:::warning
Do not rely on CloudFormation defaults when updating an existing production stack. Preserve current parameter values intentionally, especially for authentication, VPC, domain, module, encryption, and environment settings.
:::

### Parameter-Only Update

Use a parameter-only update when the template version is not changing.

Examples:

- Connecting FormKiQ to an optional VPC stack
- Updating a domain or module-related parameter
- Changing a supported configuration parameter

For parameter-only updates, choose **Use current template** in CloudFormation and update only the intended parameters.

### Template Replacement Update

Use a template replacement update when moving to a newer FormKiQ release template.

The following CLI command is an example only. Real deployments may require additional parameters, previous values, capabilities, tags, stack policies, or module-specific settings.

```bash
aws cloudformation update-stack \
  --stack-name your-formkiq-stack \
  --template-url https://example.com/path/to/formkiq.yaml \
  --parameters file://parameters.json \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM
```

Where possible, generate or review a change set before executing the update.

```bash
aws cloudformation create-change-set \
  --stack-name your-formkiq-stack \
  --change-set-name formkiq-upgrade-review \
  --template-url https://example.com/path/to/formkiq.yaml \
  --parameters file://parameters.json \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --change-set-type UPDATE
```

Then inspect the change set before execution:

```bash
aws cloudformation describe-change-set \
  --stack-name your-formkiq-stack \
  --change-set-name formkiq-upgrade-review
```

### Module-Specific Updates

Commercial modules and optional search backends may have separate templates, parameters, and operational checks.

Review module documentation before updating:

- [Modules & Commercial Offerings](/docs/category/formkiq-modules)
- [OpenSearch Serverless Installation](/docs/formkiq-modules/installation/opensearch-serverless)
- [OpenSearch Managed Installation](/docs/formkiq-modules/installation/opensearch-managed)
- [Enhanced Fulltext Document Search](/docs/formkiq-modules/modules/enhanced-fulltext-document-search)
- [Enhanced Document OCR and Classification](/docs/formkiq-modules/modules/enhanced-document-ocr-and-classification)

For OpenSearch-backed search, consider snapshots and reindexing plans before making changes.

## Post-Upgrade Verification

Deploying and testing in non-production first is the best way to reduce production risk. After any production update, verify the deployment before considering the update complete.

### System Verification

| Area | Verify |
| --- | --- |
| CloudFormation | Root and nested stacks are `UPDATE_COMPLETE` or otherwise expected. |
| Stack outputs | API URLs, console URL, Cognito details, and module outputs are present. |
| Version | [`GET /version`](/docs/api-reference/get-version) returns the expected version and environment. |
| Console | FormKiQ Console loads and administrator login works. |
| Authentication | JWT, IAM, API key, SSO, or custom authorizer paths used by your environment still work. |
| Documents | Create, upload, download, update, and delete a test document. |
| Storage | S3 uploads and downloads work through presigned URLs. |
| Search | Attribute search and full-text search work where enabled. |
| OCR and IDP | OCR, IDP, mappings, and classification actions complete where enabled. |
| Rules and workflows | Rulesets route expected documents and workflows progress through actions or queues. |
| Integrations | Webhooks, EventBridge, document gateways, or external consumers receive expected events. |
| Monitoring | CloudWatch alarms, dashboards, and logs are normal. |

### Functional Smoke Test

At minimum, run a smoke test that covers:

1. Login or authenticate with the method used by production users.
2. Create a small document.
3. Upload a larger document through a presigned S3 URL.
4. Retrieve document metadata.
5. Download document content.
6. Search for the document by tag or attribute.
7. Confirm expected logs and metrics are healthy.

If optional modules are installed, include a smoke test for each module that supports a critical workflow.

## Rollback Procedures

Rollback strategy depends on when the issue is found and what changed.

| Scenario | Recommended response |
| --- | --- |
| Stack update fails before completion | Let CloudFormation roll back automatically when possible. Inspect root and nested stack events. |
| Stack is in `UPDATE_ROLLBACK_FAILED` | Follow AWS CloudFormation recovery steps before retrying the update. Do not start unrelated changes. |
| Update completes but application behavior is broken | Decide whether to reapply the previous template, apply a fix-forward patch, or disable the affected feature. |
| Data was changed after update | Use data recovery procedures such as DynamoDB PITR, S3 versioning, document versioning, or application-level correction. |
| Search index is wrong or stale | Restore from OpenSearch snapshot if needed, or reindex affected documents. |
| External integration side effects occurred | Coordinate with the downstream system. CloudFormation rollback will not undo external side effects. |

### CloudFormation Rollback

If an update fails during deployment, CloudFormation normally attempts rollback automatically. If a deployment completes successfully but you need to return to a previous template, perform a stack update using the previous template and parameter set.

Example:

```bash
aws cloudformation update-stack \
  --stack-name your-formkiq-stack \
  --template-body file://formkiq-template-before-upgrade.json \
  --parameters file://parameters-before-upgrade.json \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM
```

If you are only reversing a parameter change and the template should remain the same, use the current template and restore the previous parameter values.

### Data Recovery

If data issues are discovered after an upgrade, do not assume a stack rollback is enough.

Review the affected data area:

- DynamoDB metadata and configuration: use Point-in-Time Recovery where appropriate.
- S3 document content: use S3 versioning or retention controls where configured.
- OpenSearch indexes: use snapshots or reindexing where appropriate.
- Document versions: use document versioning features where enabled.
- External systems: apply integration-specific reconciliation.

For detailed procedures, see [Backup and Recovery](/docs/platform/backup_and_recovery).

### Search Index Recovery

Search backends may need their own recovery path.

- Use OpenSearch snapshots if the index needs to be restored.
- Reindex affected documents if metadata, mappings, schemas, or full-text configuration changed.
- Confirm full-text actions complete successfully after recovery.

Related API operations:

- [Add OpenSearch Snapshot](/docs/api-reference/add-open-search-snapshot)
- [Get OpenSearch Snapshots](/docs/api-reference/get-open-search-snapshots)
- [Restore OpenSearch Snapshot](/docs/api-reference/add-open-search-restore-snapshot)
- [Reindex Document](/docs/api-reference/add-reindex-document)

## Troubleshooting Common Issues

### CloudFormation Update Failed

Start with CloudFormation events on the root stack and nested stacks.

```bash
aws cloudformation describe-stack-events \
  --stack-name your-formkiq-stack \
  --max-items 50
```

Common causes include:

- Missing IAM capability acknowledgement
- Service quota limits
- Region service availability
- VPC, subnet, or security group configuration
- Parameter values that changed unintentionally
- Stack drift or manually modified resources

For detailed CloudFormation troubleshooting, see [CloudFormation Troubleshooting](/docs/getting-started/cloudformation-troubleshooting/).

### API Gateway Errors

If API endpoints fail after an update:

1. Confirm the API URL from CloudFormation outputs.
2. Confirm the correct authentication method is being used.
3. Check API Gateway and Lambda logs in CloudWatch.
4. Review recent stack events for API Gateway or Lambda changes.

### Lambda Function Failures

For Lambda execution issues:

1. Identify the failing endpoint or action.
2. Check the related Lambda logs in CloudWatch.
3. Confirm environment variables and IAM roles were updated correctly.
4. Check memory, timeout, throttling, and downstream service errors.

### Search or OCR Issues

If search, OCR, IDP, or document actions fail:

- Confirm required modules are installed and healthy.
- Check document action status.
- Review OpenSearch or Typesense health where applicable.
- Confirm OCR or full-text action parameters are still valid.
- Reindex affected documents if metadata or index configuration changed.

### Authentication Issues

If users cannot log in or integrations receive `401` or `403` responses:

- Confirm the correct API URL is being used.
- Confirm Cognito, SSO, custom authorizer, IAM, or API key settings were preserved.
- Check CloudFormation outputs for changed URLs or identifiers.
- Review identity provider metadata if SSO settings changed.

## Maintenance Planning

### Scheduled Maintenance Windows

Plan a maintenance window for production updates when user impact is possible.

Communicate:

- Start and end time
- Expected service impact
- Who is responsible for validation
- Rollback decision deadline
- Support contact during the window

### Multi-Environment Strategy

For organizations with multiple environments, use a staged update flow:

1. Development
2. Staging or QA
3. Production

For multiple production instances, update sequentially when possible to reduce the impact of unexpected issues.

## Best Practices

- Read every release note between the current and target versions.
- Keep a copy of the current template, parameters, and outputs before updating.
- Test major updates outside production first.
- Preserve current parameter values intentionally.
- Use change sets for production template replacements when practical.
- Monitor root and nested stack events during the update.
- Run a documented smoke test after the update.
- Keep rollback and recovery owners available during the maintenance window.
- Update monitoring and alerts when new components are added.
- Prioritize security-related updates, but still follow backup and verification steps.

## Additional Resources

- [Changelog](/docs/category/changelog)
- [Quick Start: CloudFormation Troubleshooting](/docs/getting-started/cloudformation-troubleshooting/)
- [Backup and Recovery](/docs/platform/backup_and_recovery)
- [Status Monitoring and Alerting](/docs/how-tos/set-up-status-monitoring-and-alerting)
- [API Reference](/docs/category/formkiq-api)
- [AWS CloudFormation User Guide](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html)
