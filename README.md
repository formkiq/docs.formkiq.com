# Website

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator. Node.js 20 or newer is required.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

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

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
