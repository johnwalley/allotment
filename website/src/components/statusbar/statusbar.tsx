import React from "react";

import styles from "./statusbar.module.css";

export type StatusbarProps = {
  languageName?: string;
};

export const Statusbar = ({ languageName }: StatusbarProps) => {
  return (
    <div className={styles.statusbar}>
      <div className={styles.items}>
        <span className={styles.remote} title="Open a Remote Window">
          <span className="codicon codicon-remote" />
        </span>
        <span className={styles.item} title="my-app (Git) - main">
          <span className="codicon codicon-git-branch" /> main
        </span>
        <span className={styles.item} title="No Problems">
          <span className="codicon codicon-error" /> 0{" "}
          <span className="codicon codicon-warning" /> 0
        </span>
      </div>
      <div className={styles.items}>
        {languageName && (
          <>
            <span className={styles.optional}>Ln 1, Col 1</span>
            <span className={styles.optional}>Spaces: 2</span>
            <span className={styles.optional}>UTF-8</span>
            <span className={styles.optional}>LF</span>
            <span className={styles.item}>
              <span className="codicon codicon-bracket" /> {languageName}
            </span>
          </>
        )}
        <span className={styles.item} title="No Notifications">
          <span className="codicon codicon-bell" />
        </span>
      </div>
    </div>
  );
};
