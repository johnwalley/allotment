import classNames from "classnames";

import styles from "./panel.module.css";

export type PanelProps = {
  maximized: boolean;
  onClose: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
};

export const Panel = ({
  maximized,
  onClose,
  onMaximize,
  onMinimize,
}: PanelProps) => {
  return (
    <div className={styles.panel}>
      <div className={styles.title}>
        <div>
          <ul className={styles.actionsContainer}>
            <li className={classNames(styles.actionItem, "checked")}>
              <a className={styles.actionLabel}>Terminal</a>
            </li>
          </ul>
        </div>
        <div>
          <ul className={styles.actionsContainer}>
            <li>
              {maximized ? (
                <a
                  className={classNames(
                    "codicon codicon-chevron-down",
                    styles.actionlabel
                  )}
                  role="button"
                  title="Minimize Panel Size"
                  onClick={onMinimize}
                />
              ) : (
                <a
                  className={classNames(
                    "codicon codicon-chevron-up",
                    styles.actionlabel
                  )}
                  role="button"
                  title="Maximize Panel Size"
                  onClick={onMaximize}
                />
              )}
            </li>
            <li>
              <a
                className={classNames(
                  "codicon codicon-close",
                  styles.actionlabel
                )}
                role="button"
                title="Close Panel"
                onClick={onClose}
              ></a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.content}></div>
    </div>
  );
};
