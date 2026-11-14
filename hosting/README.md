# Optional CloudFront routing

The docs PR does not change the existing CloudFront distribution. Static
meta-refresh redirects remain available without JavaScript, with destination
canonicals and `noindex,follow`. The deployment uploader retains extensionless
S3 objects so current hosting keeps working.

`npm run build:hosting` writes `build-hosting/viewer-request.js`. Its redirect map
comes from `config/redirects.json`, shared with the static redirect plugin.
Tests cover legacy paths, encoded spaces, repeated query parameters, real asset
URLs, and dotted release paths such as `/docs/changelog/v1.19.2`.

To activate later:

1. Review the distribution's cache behaviors, existing viewer-request functions,
   origin path, and deployment IAM permissions. Do not replace an unrelated
   viewer-request association.
2. Publish this function using the CloudFront JavaScript 2.0 runtime and associate
   it with the docs viewer-request behavior. Apply equivalent associations to any
   additional behaviors that serve docs routes.
3. Test 301 responses for old URLs with queries and browser fragments, canonical
   pages, dotted release URLs, static assets, and marketplace URLs. The URI rewrite
   does not change the selected origin or behavior; retain the existing S3 origin
   prefix. Ensure the cache policy permits HTML revalidation (minimum TTL zero).
4. After confirming the function is active across every applicable behavior,
   remove the compatibility alias uploads in `scripts/deploy-site.py` in a separate
   change. Keep the static redirect files as an origin fallback.

The uploader prunes only objects under the explicit deployment prefix (`docs/`),
preserving expected alias keys, prior fingerprinted `assets/` (for open browser
sessions), and the entire `marketplace/` subtree. It uses
`s3:ListBucket`, `s3:GetObject`, `s3:PutObject`, and `s3:DeleteObject` for that prefix.
Review that scope on the deployment role before merging. To inspect the proposed
deletions without publishing, run:

```bash
python3 scripts/deploy-site.py --bucket YOUR_BUCKET --prefix docs --dry-run
```

HTML and other mutable files revalidate; fingerprinted `assets/` files use a
one-year immutable cache policy. Marketplace uploads retain their existing URLs
and are never pruned because external deployments may consume them.
