import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Overview from '@site/docs/overview.md';

// Render the full overview on the server, with the existing docs URL canonical.
export default function Home() {
  return (
    <Layout title="FormKiQ Documentation" description="Deploy, integrate, and operate FormKiQ document management in your AWS account.">
      <Head><link rel="canonical" href="https://docs.formkiq.com/docs/overview" /></Head>
      <main className="container margin-vert--lg">
        <article className="markdown"><Overview /></article>
      </main>
    </Layout>
  );
}
