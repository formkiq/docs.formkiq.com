// Shared by the changelog landing page and sidebar. Dates refer to publication
// of the release notes. Older entries without a recorded date stay in the archive.
const releases = [
  {
    docId: 'changelog/v4.3.8',
    title: 'FormKiQ Web v4.3.8',
    channel: 'web',
    solutions: ['contract-management'],
    date: '2026-11-13',
    summary: 'Email previews, background uploads, multilingual interfaces, and Contract Management lifecycle and review improvements.',
  },
  {
    docId: 'changelog/v1.19.2',
    title: 'FormKiQ v1.19.2 — API & Backend',
    channel: 'backend',
    date: '2026-11-13',
    summary: 'Multi-attribute and JSON search, finer API permissions, governance improvements, and updated processing modules.',
  },
  ...[
    '1.19.1', '1.19.0', '1.18.2', '1.18.1', '1.18.0', '1.17.1',
    '1.17.0', '1.16.1', '1.16.0', '1.15.1', '1.15.0', '1.14.2',
    '1.14.1', '1.14.0', '1.13.1', '1.13.0',
  ].map(version => ({
    docId: `changelog/v${version}`,
    title: `FormKiQ v${version}`,
    channel: 'backend',
    channelLabel: 'FormKiQ',
    solutions: ['1.19.0', '1.19.1'].includes(version) ? ['contract-management'] : [],
    summary: 'API, backend, and module release notes.',
  })),
].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

module.exports = releases;
