import classNames from "classnames";
import { useEffect } from "react";

import { Allotment } from "../../src";
import { Document } from "../advanced.stories";
import { Pane } from "./pane";
import styles from "./sidebar.module.css";

export type SidebarProps = {
  title: string;
  documents: Document[];
  openEditors: Document[];
  onOpenEditorsChange: (documents: Document[]) => void;
};

export const Sidebar = ({
  title,
  documents,
  openEditors,
  onOpenEditorsChange,
}: SidebarProps) => {
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
            key="openEditors"
            maxSize={22 + openEditors.length * 22}
            minSize={22 + openEditors.length * 22}
          >
            <Pane expanded title="Open Editors">
              <div className={styles.list}>
                {openEditors.map((document, index) => (
                  <div key={index} className={styles.listRow}>
                    <a
                      className={classNames(
                        "codicon codicon-close",
                        styles.actionLabel
                      )}
                      role="button"
                      title="Close Editor (⌘W)"
                      onClick={() => {
                        console.log(`Close ${document.title}:${index}`);

                        const newDocuments = [...openEditors];
                        newDocuments.splice(index, 1);

                        onOpenEditorsChange(newDocuments);
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
          <Allotment.Pane minSize={142}>
            <Pane key="allotment" expanded title="Allotment">
              <div className={styles.list}>
                {documents.map((document, index) => (
                  <div key={index} className={styles.listRow}>
                    <div className={styles.iconLabel}>
                      <div className={styles.iconLabelContainer}>
                        <span className={styles.iconNameContainer}>
                          <a
                            className={styles.labeName}
                            onClick={() => {
                              console.log(`Open ${document.title}:${index}`);

                              const newDocuments = [...openEditors];
                              newDocuments.push(document);

                              onOpenEditorsChange(newDocuments);
                            }}
                          >
                            {document.title}
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Pane>
          </Allotment.Pane>
          <Allotment.Pane minSize={142}>
            <Pane key="outline" expanded title="Outline">
              <div className={styles.list}>
                {documents.map((document, index) => (
                  <div key={index} className={styles.listRow}>
                    <div className={styles.iconLabel}>
                      <div className={styles.iconLabelContainer}>
                        <span className={styles.iconNameContainer}>
                          <a
                            className={styles.labeName}
                            onClick={() => {
                              console.log(`Open ${document.title}:${index}`);

                              const newDocuments = [...openEditors];
                              newDocuments.push(document);

                              onOpenEditorsChange(newDocuments);
                            }}
                          >
                            {document.title}
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Pane>
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};
