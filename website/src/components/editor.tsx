import React from "react";

import "@vscode/codicons/dist/codicon.css";

import { Allotment } from "allotment";
import { Document } from "./app";
import styles from "./editor.module.css";
import { EditorGroupContainer } from "./editor-group-container";

export type EditorProps = {
  documents: Document[];
  onDocumentsChange: (documents: Document[]) => void;
};

export const Editor = ({ documents, onDocumentsChange }: EditorProps) => {
  return (
    <div className={styles.content}>
      <Allotment className={styles.allotment} minSize={110}>
        {documents.length > 0 ? (
          documents.map((document, index) => (
            <EditorGroupContainer
              key={index}
              document={document}
              onClose={() => {
                const newDocuments = [...documents];
                newDocuments.splice(index, 1);

                onDocumentsChange(newDocuments);
              }}
              onSplitEditor={() => {
                const newDocuments = [...documents];
                newDocuments.splice(index, 0, document);

                onDocumentsChange(newDocuments);
              }}
            />
          ))
        ) : (
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
        )}
      </Allotment>
    </div>
  );
};
