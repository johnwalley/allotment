import classNames from "classnames";

import styles from "./editor-group-container.module.css";

export type EditorGroupContainerProps = {
  document: { title: string; icon: string };
  onClose: () => void;
  onSplitEditor: () => void;
};

export const EditorGroupContainer = ({
  document,
  onClose,
  onSplitEditor,
}: EditorGroupContainerProps) => {
  return (
    <div className={styles.editorGroupContainer}>
      <div className={styles.title}>
        <div className={styles.tabList}>
          <div
            className={classNames(
              styles.iconLabel,
              document.icon === "ts"
                ? styles.typescriptReactFileIcon
                : styles.cssLangFileIcon
            )}
          >
            <div className={styles.iconLabelContainer}>
              <a className={styles.labelName}>{document.title}</a>
            </div>
          </div>
          <div className={styles.tabActions}>
            <a
              className={classNames(
                "codicon codicon-close",
                styles.actionLabel
              )}
              role="button"
              title="Close (⌘W)"
              onClick={onClose}
            />
            <a
              className={classNames(
                "codicon codicon-split-horizontal",
                styles.actionLabel
              )}
              role="button"
              title="Split Editor Right (⌘\)
[⌥] Split Editor Down"
              onClick={onSplitEditor}
            />
          </div>
        </div>
        <div className={styles.editorActions}></div>
      </div>
      <div className={styles.editorContainer}></div>
    </div>
  );
};
