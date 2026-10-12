import React from "react";

import "@vscode/codicons/dist/codicon.css";

import { Allotment } from "allotment";
import { Document } from "./documents";
import styles from "./editor.module.css";
import { EditorGroupContainer } from "./editor-group-container";

const WATERMARK = [
  { label: "Show All Commands", keys: ["⇧", "⌘", "P"] },
  { label: "Go to File", keys: ["⌘", "P"] },
  { label: "Find in Files", keys: ["⇧", "⌘", "F"] },
  { label: "Toggle Terminal", keys: ["⌃", "`"] },
];

export type EditorProps = {
  activeIndex: number;
  /** Minimum width of each editor group */
  minSize: number;
  documents: Document[];
  onActiveIndexChange: (index: number) => void;
  onDocumentsChange: (documents: Document[]) => void;
};

export const Editor = ({
  activeIndex,
  minSize,
  documents,
  onActiveIndexChange,
  onDocumentsChange,
}: EditorProps) => {
  return (
    <div className={styles.content}>
      {documents.length > 0 ? (
        <Allotment>
          {documents.map((document, index) => (
            <Allotment.Pane key={index} minSize={minSize}>
              <EditorGroupContainer
                active={index === activeIndex}
                document={document}
                onActivate={() => onActiveIndexChange(index)}
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
            </Allotment.Pane>
          ))}
        </Allotment>
      ) : (
        <div className={styles.watermark}>
          <dl className={styles.watermarkBox}>
            {WATERMARK.map(({ label, keys }) => (
              <div key={label} className={styles.entry}>
                <dt>{label}</dt>
                <dd>
                  {keys.map((key) => (
                    <kbd key={key} className={styles.key}>
                      {key}
                    </kbd>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
};
