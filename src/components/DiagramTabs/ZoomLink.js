import React from 'react';
import styles from './styles.module.css';

// Opens the full-size diagram in a new tab so it stays readable on small screens.
export default function ZoomLink({href, className, children}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[styles.zoomLink, className].filter(Boolean).join(' ')}
      aria-label="Open the full-size diagram in a new tab">
      {children}
    </a>
  );
}
