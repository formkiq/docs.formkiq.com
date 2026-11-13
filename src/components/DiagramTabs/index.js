import React, {useEffect, useId, useRef, useState} from 'react';
import styles from './styles.module.css';

const views = [
  {value: 'diagram', label: 'Diagram'},
  {value: 'text', label: 'Text view'},
];

export default function DiagramTabs({label, diagram, children}) {
  const id = useId();
  const buttons = useRef([]);
  const [selected, setSelected] = useState('diagram');
  const [interactive, setInteractive] = useState(false);

  useEffect(() => setInteractive(true), []);

  function handleKeyDown(event, index) {
    const next = {
      ArrowLeft: (index + views.length - 1) % views.length,
      ArrowRight: (index + 1) % views.length,
      Home: 0,
      End: views.length - 1,
    }[event.key];

    if (next === undefined) return;
    event.preventDefault();
    setSelected(views[next].value);
    buttons.current[next]?.focus();
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.controls}
        role="tablist"
        aria-label={`${label} view`}
        aria-orientation="horizontal"
        hidden={!interactive}>
        {views.map(({value, label: tabLabel}, index) => (
          <button
            key={value}
            ref={(button) => { buttons.current[index] = button; }}
            type="button"
            role="tab"
            id={`${id}-${value}-tab`}
            aria-controls={`${id}-${value}-panel`}
            aria-selected={selected === value}
            tabIndex={selected === value ? 0 : -1}
            className={styles.tab}
            onClick={() => setSelected(value)}
            onKeyDown={(event) => handleKeyDown(event, index)}>
            {tabLabel}
          </button>
        ))}
      </div>
      {views.map(({value}) => (
        <section
          key={value}
          id={`${id}-${value}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-${value}-tab`}
          tabIndex={interactive ? 0 : undefined}
          className={styles.panel}
          hidden={interactive && selected !== value}>
          {value === 'diagram' ? diagram : children}
        </section>
      ))}
    </div>
  );
}
