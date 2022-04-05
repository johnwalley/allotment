import { useEffect } from "react";

import { Allotment } from "../../src";
import { Document, DOCUMENTS } from "../advanced.stories";
import { Pane } from "./pane";
import styles from "./sidebar.module.css";

export type SidebarProps = {
  title: string;
  documents: Document[];
  onDocumentsChange: (documents: Document[]) => void;
};

export const Sidebar = ({
  title,
  documents,
  onDocumentsChange,
}: SidebarProps) => {
  useEffect(() => {
    console.log("Mount");

    return () => {
      console.log("Unmount");
    };
  }, []);

  console.log(documents.length * 22);

  return (
    <div className={styles.sidebar}>
      <div className={styles.title}>
        <div className={styles.titleLabel}>
          <h2>{title}</h2>
        </div>
        <div className={styles.titleActions}>
          <div className={styles.actionsContainer}>
            <a className="codicon codicon-ellipsis"></a>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <Allotment vertical>
          <Allotment.Pane
            maxSize={documents.length * 22}
            minSize={documents.length * 22}
          >
            <Pane expanded title="Open Editors">
              <div className={styles.list}>
                {documents.map((document, index) => (
                  <div key={index} className={styles.listRow}>
                    <a
                      className="action-label codicon codicon-close"
                      role="button"
                      title="Close Editor (⌘W)"
                      onClick={() => {
                        console.log(`Close ${document.title}:${index}`);

                        const newDocuments = [...documents];
                        newDocuments.splice(index, 1);

                        onDocumentsChange(newDocuments);
                      }}
                    ></a>
                    <div className={styles.iconLabel}>
                      <div className={styles.iconLabelContainer}>
                        <span className={styles.iconNameContainer}>
                          <a className={styles.labeName}>{document.title}</a>
                        </span>
                        <span className={styles.iconDescriptionContainer}>
                          <span className={styles.labelDescription}>
                            stories/components
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Pane>
          </Allotment.Pane>
          <Pane expanded title="Allotment">
            <div className={styles.list}>
              {DOCUMENTS.map((document, index) => (
                <div key={index} className={styles.listRow}>
                  <a
                    className="action-label codicon codicon-close"
                    role="button"
                    title="Close Editor (⌘W)"
                    onClick={() => {
                      console.log(`Open ${document.title}:${index}`);

                      const newDocuments = [...documents];
                      newDocuments.push(document);

                      onDocumentsChange(newDocuments);
                    }}
                  ></a>
                  <div className={styles.iconLabel}>
                    <div className={styles.iconLabelContainer}>
                      <span className={styles.iconNameContainer}>
                        <a className={styles.labeName}>{document.title}</a>
                      </span>
                      <span className={styles.iconDescriptionContainer}>
                        <span className={styles.labelDescription}>
                          stories/components
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Pane>
        </Allotment>
      </div>
    </div>
  );
};
