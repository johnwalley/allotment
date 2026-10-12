import React from "react";

import "@vscode/codicons/dist/codicon.css";

import clsx from "clsx";

import styles from "./activity-bar.module.css";

export type ActivityBarItem = {
  icon: string;
  title: string;
};

export type ActivityBarProps = {
  checked: number;
  items: ActivityBarItem[];
  onClick: (index: number) => void;
};

const GLOBAL_ITEMS: ActivityBarItem[] = [
  { icon: "account", title: "Accounts" },
  { icon: "settings-gear", title: "Manage" },
];

export const ActivityBar = ({ checked, items, onClick }: ActivityBarProps) => {
  return (
    <div className={styles.activitybar}>
      <ul className={styles.actionsContainer}>
        {items.map((item, index) => (
          <li
            key={item.icon}
            className={clsx(styles.actionItem, {
              [styles.checked]: index === checked,
            })}
          >
            <a
              className={clsx(
                `codicon codicon-${item.icon}`,
                styles.actionLabel,
              )}
              role="button"
              title={item.title}
              onClick={() => {
                onClick(index);
              }}
            ></a>
          </li>
        ))}
      </ul>
      <ul className={styles.actionsContainer}>
        {GLOBAL_ITEMS.map((item) => (
          <li key={item.icon} className={styles.actionItem}>
            <a
              className={clsx(
                `codicon codicon-${item.icon}`,
                styles.actionLabel,
              )}
              role="button"
              title={item.title}
            ></a>
          </li>
        ))}
      </ul>
    </div>
  );
};
