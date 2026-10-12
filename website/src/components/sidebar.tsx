import React, { useState } from "react";

import clsx from "clsx";

import { Allotment, LayoutPriority } from "allotment";
import { Document, SYMBOL_COLORS } from "./documents";
import { FileIcon } from "./file-icon";
import { Pane } from "./pane";
import styles from "./sidebar.module.css";

const HEADER_HEIGHT = 22;

export type SidebarProps = {
  activity: number;
  title: string;
  documents: Document[];
  activeDocument: Document | undefined;
  onOpen: (document: Document) => void;
};

export const Sidebar = ({
  activity,
  title,
  documents,
  activeDocument,
  onOpen,
}: SidebarProps) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.title}>
        <h2 className={styles.titleLabel}>{title}</h2>
        <a
          className="codicon codicon-ellipsis action-label"
          role="button"
          title="Views and More Actions..."
        ></a>
      </div>
      <div className={styles.content}>
        {activity === 0 ? (
          <Explorer
            documents={documents}
            activeDocument={activeDocument}
            onOpen={onOpen}
          />
        ) : (
          <PlaceholderView activity={activity} />
        )}
      </div>
    </div>
  );
};

type ExplorerProps = Pick<
  SidebarProps,
  "documents" | "activeDocument" | "onOpen"
>;

const Explorer = ({ documents, activeDocument, onOpen }: ExplorerProps) => {
  // VS Code starts with the workspace folder open and the other views collapsed
  const [folderExpanded, setFolderExpanded] = useState(true);
  const [outlineExpanded, setOutlineExpanded] = useState(false);
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const [srcExpanded, setSrcExpanded] = useState(true);

  // A collapsed view shrinks to its header, which Allotment does by fixing the
  // pane's minimum and maximum size
  const sizes = (expanded: boolean, minSize: number) =>
    expanded
      ? { minSize, maxSize: Infinity }
      : { minSize: HEADER_HEIGHT, maxSize: HEADER_HEIGHT };

  const srcFiles = documents.filter((document) => document.folder === "src");
  const rootFiles = documents.filter((document) => !document.folder);

  const fileRow = (document: Document, depth: number) => (
    <TreeRow
      key={document.title}
      depth={depth}
      selected={document === activeDocument}
      onClick={() => onOpen(document)}
    >
      <FileIcon icon={document.icon} />
      <span className={styles.label}>{document.title}</span>
    </TreeRow>
  );

  return (
    <Allotment vertical proportionalLayout={false}>
      <Allotment.Pane
        key="folder"
        priority={LayoutPriority.High}
        {...sizes(folderExpanded, 66)}
      >
        <Pane
          first
          expanded={folderExpanded}
          title="my-app"
          actions={[
            { icon: "new-file", title: "New File..." },
            { icon: "new-folder", title: "New Folder..." },
            { icon: "refresh", title: "Refresh Explorer" },
            { icon: "collapse-all", title: "Collapse Folders in Explorer" },
          ]}
          onToggle={() => setFolderExpanded(!folderExpanded)}
        >
          <div className={styles.list}>
            <TreeRow depth={0} onClick={() => setSrcExpanded(!srcExpanded)}>
              <span
                className={clsx(
                  "codicon",
                  srcExpanded
                    ? "codicon-chevron-down"
                    : "codicon-chevron-right",
                  styles.twistie,
                )}
              />
              <span className={styles.label}>src</span>
            </TreeRow>
            {srcExpanded && srcFiles.map((document) => fileRow(document, 1))}
            {rootFiles.map((document) => fileRow(document, 0))}
          </div>
        </Pane>
      </Allotment.Pane>
      <Allotment.Pane key="outline" {...sizes(outlineExpanded, 88)}>
        <Pane
          expanded={outlineExpanded}
          title="Outline"
          actions={[
            { icon: "collapse-all", title: "Collapse All" },
            { icon: "ellipsis", title: "More Actions..." },
          ]}
          onToggle={() => setOutlineExpanded(!outlineExpanded)}
        >
          {activeDocument && activeDocument.outline.length > 0 ? (
            <div className={styles.list}>
              {activeDocument.outline.map((symbol) => (
                <TreeRow key={symbol.name} depth={symbol.depth ?? 0}>
                  <span
                    className={clsx(
                      "codicon",
                      `codicon-symbol-${symbol.kind}`,
                      styles.symbolIcon,
                    )}
                    style={{ color: SYMBOL_COLORS[symbol.kind] }}
                  />
                  <span className={styles.label}>{symbol.name}</span>
                </TreeRow>
              ))}
            </div>
          ) : (
            <p className={styles.message}>
              {activeDocument
                ? `No symbols found in document '${activeDocument.title}'`
                : "There are no editors open that can provide outline information."}
            </p>
          )}
        </Pane>
      </Allotment.Pane>
      <Allotment.Pane key="timeline" {...sizes(timelineExpanded, 66)}>
        <Pane
          expanded={timelineExpanded}
          title="Timeline"
          actions={[
            { icon: "pin", title: "Pin the Current Timeline" },
            { icon: "refresh", title: "Refresh" },
            { icon: "filter", title: "Filter Timeline" },
          ]}
          onToggle={() => setTimelineExpanded(!timelineExpanded)}
        >
          <p className={styles.message}>
            The active editor cannot provide timeline information.
          </p>
        </Pane>
      </Allotment.Pane>
    </Allotment>
  );
};

type TreeRowProps = {
  children: React.ReactNode;
  depth: number;
  selected?: boolean;
  onClick?: () => void;
};

const TreeRow = ({ children, depth, selected, onClick }: TreeRowProps) => (
  <div
    className={clsx(styles.listRow, { [styles.selected]: selected })}
    // Every level is indented by 8px, after room for the twistie
    style={{ paddingLeft: 20 + depth * 8 }}
    onClick={onClick}
  >
    {children}
  </div>
);

// The other activities only get enough of their real view to be recognisable
const PlaceholderView = ({ activity }: { activity: number }) => {
  switch (activity) {
    case 1:
      return (
        <div className={styles.view}>
          <div className={styles.input}>
            <span className={styles.placeholder}>Search</span>
            <span className="codicon codicon-case-sensitive" />
            <span className="codicon codicon-whole-word" />
            <span className="codicon codicon-regex" />
          </div>
        </div>
      );
    case 2:
      return (
        <div className={styles.view}>
          <div className={styles.input}>
            <span className={styles.placeholder}>
              Message (⌘Enter to commit on "main")
            </span>
          </div>
          <div className={styles.button}>
            <span className="codicon codicon-check" /> Commit
          </div>
        </div>
      );
    case 3:
      return (
        <div className={styles.view}>
          <div className={styles.button}>Run and Debug</div>
          <p className={styles.viewMessage}>
            To customize Run and Debug, create a launch.json file.
          </p>
        </div>
      );
    default:
      return (
        <div className={styles.view}>
          <div className={styles.input}>
            <span className={styles.placeholder}>
              Search Extensions in Marketplace
            </span>
            <span className="codicon codicon-filter" />
          </div>
        </div>
      );
  }
};
