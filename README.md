# FormKiQ documentation

This site uses Docusaurus 3 and the committed API reference. Use Node.js 24 and
npm, matching CI. `package-lock.json` is the dependency source of truth.

```bash
npm ci
npm start
```

## Validation

```bash
npm test
npm run build
npm run check:build
```

Pull requests run the same checks without AWS credentials. Broken internal links
and anchors fail the build. Scheduled external-link checks run separately because
network, authentication, and rate limits can affect third-party URLs.

## Releases and API reference

`config/release.cjs` pins both the documented FormKiQ release and the OpenAPI tag.
The install tables use its version. Deployment builds the committed API reference
without fetching unreleased changes. To update it deliberately:

```bash
npm ci
make api
npm run build
npm run check:build
```

Review and commit the generated changes with the release update. A normal deploy
never runs API regeneration.

### Adding release notes

Web and API/backend releases have independent versions. Publish each in its own
document under `docs/changelog`, retaining existing URLs. Use explicit page titles
such as `FormKiQ Web v4.3.8` or `FormKiQ v1.19.2 — API & Backend`.

Add an entry to `src/data/changelog.js` with its document ID, title, channel
(`web` or `backend`), summary, and release-note publication date (`YYYY-MM-DD`).
The landing page and sidebar use this list and sort dated entries newest first;
entries on the same date retain their order in the list. Add
`solutions: ['contract-management']` for Contract Management changes.
Historical entries without a recorded publication date remain in the archive.

Each web release should describe backend compatibility, upgrade notes, and known
issues. Document Business Solution changes under `Business Solutions` and the
solution name in the release that delivers them. Contract Management currently
shares the web version. Link to web notes from the backend release that bundles
that version; keep individual backend module versions in their existing sections.
Only state minimum backend versions or tested pairings when verified.


## URLs, redirects, and metadata

Hand-written pages require useful, page-specific descriptions. New tutorial slugs
use lowercase paths. Keep every replaced path in `config/redirects.json` and update
active links to the canonical URL. The maintained redirect plugin writes static
meta-refresh redirects; the finalizer adds absolute canonicals and `noindex`.
Redirects are production-only, so test them using `npm run serve` after a build.
The homepage renders the Overview content on the server with the docs URL canonical.

## Assets

```bash
npm run audit:assets -- reports/image-assets.md
```

The report identifies candidates and duplicates; it is not permission to delete
public URLs. Original PNGs remain available while the diagrams use optimized WebP
copies. Marketplace version files and configuration are retained until their
external consumers can be verified. SVG and PNG social card sources are in
`static/img/formkiq-social-card.*`.

## Deployment

The main-branch workflow validates with `make`, then runs `make publish` using the configured `S3_BUCKET` and
`DISTRIBUTION_ID` secrets. It validates the site, uploads it under the `docs/` S3
prefix, preserves extensionless URL aliases, prunes stale owned objects, and
invalidates CloudFront. Marketplace artifacts and prior fingerprinted assets are excluded from deletion.

CloudFront activation is intentionally separate. See [hosting instructions](hosting/README.md)
for the tested viewer-request function, IAM scope, caching, and rollout checks.
