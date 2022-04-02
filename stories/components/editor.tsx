import "@vscode/codicons/dist/codicon.css";

import classNames from "classnames";

import styles from "./editor.module.css";

export type EditorProps = {};

export const Editor = ({}: EditorProps) => {
  return (
    <div className={styles.content}>
      <div className={styles.watermark}>
        <div className={styles.watermarkBox}>
          <dl>
            <dt>Show All Commands</dt>
            <dd>
              <div
                className="monaco-keybinding"
                title="Shift+Command+P"
                style={{ color: "rgb(204, 204, 204)" }}
              >
                <span
                  className="monaco-keybinding-key"
                  style={{
                    backgroundColor: "rgba(128, 128, 128, 0.17)",
                    borderColor:
                      "rgba(51, 51, 51, 0.6), rgba(51, 51, 51, 0.6) rgba(68, 68, 68, 0.6)",
                    boxShadow: "rgba(0, 0, 0, 0.36) 0px -1px 0px inset",
                  }}
                >
                  ⇧
                </span>
                <span
                  className="monaco-keybinding-key"
                  style={{
                    backgroundColor: "rgba(128, 128, 128, 0.17)",
                    borderColor:
                      "rgba(51, 51, 51, 0.6), rgba(51, 51, 51, 0.6) rgba(68, 68, 68, 0.6)",
                    boxShadow: "rgba(0, 0, 0, 0.36) 0px -1px 0px inset",
                  }}
                >
                  ⌘
                </span>
                <span
                  className="monaco-keybinding-key"
                  style={{
                    backgroundColor: "rgba(128, 128, 128, 0.17)",
                    borderColor:
                      "rgba(51, 51, 51, 0.6), rgba(51, 51, 51, 0.6) rgba(68, 68, 68, 0.6)",
                    boxShadow: "rgba(0, 0, 0, 0.36) 0px -1px 0px inset",
                  }}
                >
                  P
                </span>
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
};
