import "@vscode/codicons/dist/codicon.css";

import classNames from "classnames";

import styles from "./activity-bar.module.css";

export type ActivityBarProps = {
  checked: number;
  items: string[];
  onClick: (index: number) => void;
};

export const ActivityBar = ({ checked, items, onClick }: ActivityBarProps) => {
  return (
    <div className={styles.activitybar}>
      <div className={styles.content}>
        <ul className={styles.actionsContainer}>
          {items.map((item, index) => (
            <li
              key={index}
              className={classNames(styles.actionItem, {
                [styles.checked]: index === checked,
              })}
            >
              <a
                className={classNames(
                  `codicon codicon-${item}`,
                  styles.actionLabel
                )}
                onClick={() => {
                  onClick(index);
                }}
              ></a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
