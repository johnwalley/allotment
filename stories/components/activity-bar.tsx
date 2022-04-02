import "@vscode/codicons/dist/codicon.css";

import classNames from "classnames";

import styles from "./activity-bar.module.css";

export type ActivityBarProps = {
  items: string[];
};

export const ActivityBar = ({ items }: ActivityBarProps) => {
  return (
    <div className={styles.activitybar}>
      <div className={styles.content}>
        <ul className={styles.actionsContainer}>
          {items.map((item) => (
            <li key={item} className={styles.actionItem}>
              <a
                className={classNames(
                  `codicon codicon-${item}`,
                  styles.actionLabel
                )}
              ></a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
