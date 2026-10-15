import clsx from "clsx";
import React from "react";

import { CodeView } from "./code-view";
import { Document, SYMBOL_COLORS } from "./documents";
import { FileIcon } from "./file-icon";
import styles from "./editor-group-container.module.css";

export type EditorGroupContainerProps = {
  active: boolean;
  document: Document;
  onActivate: () => void;
  onClose: () => void;
  onSplitEditor: () => void;
};

export const EditorGroupContainer = ({
  active,
  document,
  onActivate,
  onClose,
  onSplitEditor,
}: EditorGroupContainerProps) => {
  const symbol = document.outline[0];

  return (
    <div className={styles.editorGroupContainer} onMouseDown={onActivate}>
      <div className={styles.title}>
        <div className={styles.tabsContainer}>
          <div className={clsx(styles.tab, { [styles.active]: active })}>
            <FileIcon icon={document.icon} />
            <span className={styles.tabLabel}>{document.title}</span>
            <a
              className="codicon codicon-close action-label"
              role="button"
              title="Close (⌘W)"
              onClick={onClose}
            />
          </div>
        </div>
        <div className={styles.editorActions}>
          <a
            className="codicon codicon-split-horizontal action-label"
            role="button"
            title="Split Editor Right (⌘\)"
            onClick={onSplitEditor}
          />
          <a
            className="codicon codicon-ellipsis action-label"
            role="button"
            title="More Actions..."
          />
        </div>
      </div>
      <div className={styles.breadcrumbs}>
        {document.folder && (
          <>
            <span>{document.folder}</span>
            <span className="codicon codicon-chevron-right" />
          </>
        )}
        <FileIcon icon={document.icon} />
        <span>{document.title}</span>
        {symbol && (
          <>
            <span className="codicon codicon-chevron-right" />
            <span
              className={`codicon codicon-symbol-${symbol.kind} ${styles.symbol}`}
              style={{ color: SYMBOL_COLORS[symbol.kind] }}
            />
            <span>{symbol.name}</span>
          </>
        )}
      </div>
      <div className={styles.editorContainer}>
        <CodeView document={document} />
      </div>
    </div>
  );
};
