---
title: Contract Management
description: Manage agreements, reviews, signing, obligations, and lifecycle activity in the Contract Management Business Solution for FormKiQ Web.
---

# Contract Management

Contract Management is a Business Solution delivered through FormKiQ Web. It provides a dedicated agreement workspace for business owners, reviewers, and administrators, backed by FormKiQ document storage, metadata, access controls, and APIs.

Availability and enabled features depend on your licensed offering, installed services, workspace configuration, and permissions.

## Work with agreements in the browser

Use the agreement register to find and open accessible agreements, review their metadata and lifecycle status, and work with related documents. **My Agreements** provides a view of accessible agreements whose primary document was created by the signed-in user. **Tasks** brings together assigned reviews, requested changes, signature requests, and renewal reviews.

Within an agreement, teams can work with configured capabilities such as:

- Agreement details, document revisions, and related records
- Reviews, reviewer assignments, decisions, and comments
- E-signature preparation, recipient routing, and signing status
- Lifecycle transitions, milestones, obligations, and reminders
- Audit activity, retention, and legal hold

Visible actions depend on the agreement's state, the user's permissions, and the features enabled for that workspace.

## Typical agreement workflow

1. **Capture the agreement.** Upload or generate the document, select the appropriate agreement type, and complete its details. AI-assisted ingestion can help extract information when configured.
2. **Coordinate review.** Assign reviewers, collect decisions and comments, and respond to requested changes. Task views help participants find the work assigned to them.
3. **Prepare and track signing.** When E-Signature is enabled, prepare recipients and signing order, send the envelope, and follow its status from the agreement.
4. **Manage the lifecycle.** Use the configured lifecycle actions to move the agreement forward. The web application coordinates related reviews, signing state, reminders, and linked agreements, with confirmations for affected work.
5. **Follow ongoing work.** Review activity and track configured obligations, milestones, renewal reviews, and reminders.

Stages and available transitions are configured for the organization. The solution does not impose one universal approval or signing process.

## Reviews and lifecycle changes in Web v4.3.8

Web v4.3.8 adds previewed, audited lifecycle transitions and cancellation of an entire review by an authorized assigned reviewer. Cancellation requires a reason and confirmation, closes the review's pending work, and returns the agreement to its saved pre-review state. Workflow configuration controls which reviewers can use this action.

Lifecycle coordination records completed steps so interrupted operations can be retried. Changes across multiple records are not a single atomic backend transaction. Read the [Web v4.3.8 release notes](/docs/changelog/v4.3.8#business-solutions) before upgrading an existing workspace.

## Configuration and supporting services

Administrators configure agreement types, lifecycle behavior, workflows, access, and enabled features for each workspace. Contract Management uses the existing FormKiQ identity and permissions model; enabling a web action does not grant access to the underlying records.

For implementation details, see:

- [FormKiQ Web (FormKiQ Web)](/docs/platform/document_console) for hosting, login, and deployment configuration
- [Commercial installation](/docs/formkiq-modules/installation/formkiq) for licensed deployment and onboarding
- [Workflows](/docs/features/workflows), [entities](/docs/features/entities), and [schemas](/docs/features/schemas) for the supporting process and data models
- [E-Signature](/docs/formkiq-modules/modules/e-signature) and [Document Generation](/docs/formkiq-modules/modules/document-generation) for configured document services
- [Security](/docs/platform/security) for identity and access controls

## Releases and compatibility

Contract Management web changes are documented under **Business Solutions → Contract Management** in the web release that delivers them. The solution currently shares the web application's version; its API and backend dependencies are recorded separately in the release notes.

Use the **Business Solutions** filter in the [changelog](/docs/category/changelog) to find relevant web and backend changes.
