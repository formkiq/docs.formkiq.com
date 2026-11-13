import React, {useEffect, useId, useState} from 'react';
import Link from '@docusaurus/Link';
import releases from '@site/src/data/changelog';
import styles from './styles.module.css';

const filters = [
  {value: 'all', label: 'All'},
  {value: 'web', label: 'Web'},
  {value: 'backend', label: 'API & Backend'},
  {value: 'solutions', label: 'Business Solutions'},
];

function ReleaseList({entries}) {
  return (
    <ol className={styles.entries}>
      {entries.map(release => (
        <li key={release.docId}>
          <Link className={styles.card} to={`/docs/${release.docId}`}>
            <h3>{release.title}</h3>
            <p className={styles.meta}>
              {release.channelLabel || (release.channel === 'web' ? 'Web' : 'API & Backend')}
              {release.solutions?.length > 0 && ' · Business Solutions · Contract Management'}
            </p>
            {release.date && (
              <p className={styles.date}>
                Notes published{' '}
                <time dateTime={release.date}>
                  {new Date(`${release.date}T00:00:00Z`).toLocaleDateString('en', {
                    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
                  })}
                </time>
              </p>
            )}
            <p>{release.summary}</p>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export default function Changelog() {
  const [filter, setFilter] = useState('all');
  const [interactive, setInteractive] = useState(false);
  const resultsId = useId();
  useEffect(() => setInteractive(true), []);

  const visible = releases.filter(release => (
    filter === 'all'
    || release.channel === filter
    || (filter === 'solutions' && release.solutions?.length > 0)
  ));
  const dated = visible.filter(release => release.date);
  const archived = visible.filter(release => !release.date);

  return (
    <>
      <div
        className={styles.filters}
        role="group"
        aria-label="Filter release notes"
        hidden={!interactive}>
        {filters.map(({value, label}) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            aria-controls={resultsId}
            className={styles.filter}
            onClick={() => setFilter(value)}>
            {label}
          </button>
        ))}
      </div>
      <p role="status" aria-live="polite" aria-atomic="true">
        {visible.length} {visible.length === 1 ? 'release entry' : 'release entries'}
        {' · '}{filters.find(({value}) => value === filter).label}
      </p>
      <div id={resultsId}>
        {dated.length > 0 && (
          <section aria-labelledby={`${resultsId}-timeline`}>
            <h2 id={`${resultsId}-timeline`}>Release timeline</h2>
            <ReleaseList entries={dated} />
          </section>
        )}
        {archived.length > 0 && (
          <section aria-labelledby={`${resultsId}-archive`}>
            <h2 id={`${resultsId}-archive`}>Earlier release notes</h2>
            <ReleaseList entries={archived} />
          </section>
        )}
        {visible.length === 0 && <p>No release notes in this category yet.</p>}
      </div>
    </>
  );
}
