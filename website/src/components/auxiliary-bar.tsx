import React from "react";

import styles from "./auxiliary-bar.module.css";

// The secondary side bar, which VS Code uses for chat by default
export const AuxiliaryBar = () => {
  return (
    <div className={styles.auxiliaryBar}>
      <div className={styles.title}>
        <h2 className={styles.titleLabel}>Chat</h2>
        <a
          className="codicon codicon-add action-label"
          role="button"
          title="New Chat (⌘N)"
        />
        <a
          className="codicon codicon-history action-label"
          role="button"
          title="Show Chats..."
        />
        <a
          className="codicon codicon-ellipsis action-label"
          role="button"
          title="Views and More Actions..."
        />
      </div>
      <div className={styles.welcome}>
        <span className="codicon codicon-chat-sparkle" />
        <p className={styles.heading}>Build with Agent</p>
        <p>AI responses may be inaccurate.</p>
      </div>
      <div className={styles.input}>
        <span className={styles.placeholder}>Describe what to build next</span>
        <div className={styles.toolbar}>
          <span className={styles.picker}>
            Agent <span className="codicon codicon-chevron-down" />
          </span>
          <span className={styles.picker}>
            Auto <span className="codicon codicon-chevron-down" />
          </span>
          <span className={`codicon codicon-send ${styles.send}`} />
        </div>
      </div>
    </div>
  );
};
