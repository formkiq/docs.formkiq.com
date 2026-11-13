import React from 'react';
import styles from './styles.module.css';

// Opens the full-size diagram in a new tab so it stays readable on small screens.
export default function ZoomLink({href, diagramLabel, className, children}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[styles.zoomLink, className].filter(Boolean).join(' ')}
      aria-label={
        diagramLabel
          ? `Open the full-size ${diagramLabel} diagram in a new tab`
          : undefined
      }>
      {children}
    </a>
  );
}
