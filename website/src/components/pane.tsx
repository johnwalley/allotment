import React from "react";

import clsx from "clsx";

import styles from "./pane.module.css";

export type PaneProps = {
  actions?: { icon: string; title: string }[];
  children: React.ReactNode;
  expanded: boolean;
  first?: boolean;
  title: string;
  onToggle?: () => void;
};

export const Pane = ({
  actions = [],
  children,
  expanded,
  first = false,
  title,
  onToggle,
}: PaneProps) => {
  return (
    <div className={clsx(styles.pane, { [styles.first]: first })}>
      <div
        className={styles.paneHeader}
        role="button"
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <div
          className={clsx(
            styles.twistie,
            "codicon",
            expanded ? "codicon-chevron-down" : "codicon-chevron-right",
          )}
        ></div>
        <h3 className={styles.title}>{title}</h3>
        {expanded && (
          <div className={styles.actions}>
            {actions.map((action) => (
              <a
                key={action.icon}
                className={`codicon codicon-${action.icon} action-label`}
                role="button"
                title={action.title}
                onClick={(event) => event.stopPropagation()}
              />
            ))}
          </div>
        )}
      </div>
      {expanded && <div className={styles.paneBody}>{children}</div>}
    </div>
  );
};
