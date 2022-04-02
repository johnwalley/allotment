import classNames from "classnames";

import styles from "./panel.module.css";

export type PanelProps = {
  onClose: () => void;
  onMaximize: () => void;
};

export const Panel = ({ onClose, onMaximize }: PanelProps) => {
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
              <a
                className={classNames(
                  "codicon codicon-chevron-up",
                  styles.actionlabel
                )}
                role="button"
                title="Maximize Panel Size"
                onClick={onMaximize}
              ></a>
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
