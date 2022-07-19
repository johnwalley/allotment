import React from "react";

import { Allotment, LayoutPriority } from "../../../src";
import { ActivityBar } from "../activity-bar";
import { AuxiliaryBar } from "../auxiliary-bar";
import { Editor } from "../editor";
import { Panel } from "../panel";
import { Sidebar } from "../sidebar";

export interface Document {
  title: string;
  icon: string;
}

export const ACTIVITIES = [
  "Explorer",
  "Search",
  "Source Control",
  "Run and Debug",
  "Extensions",
];

export const DOCUMENTS = [
  { title: "allotment.tsx", icon: "ts" },
  { title: "allotment.module.css", icon: "css" },
];

export type AppProps = {
  activity: number;
  activityBar: boolean;
  editorVisible: boolean;
  openEditors: Document[];
  panelVisible: boolean;
  primarySideBar: boolean;
  primarySideBarPosition: "left" | "right";
  secondarySideBar: boolean;
  onActivityChanged: (activity: number) => void;
  onEditorVisibleChanged: (visible: boolean) => void;
  onOpenEditorsChanged: (documents: Document[]) => void;
  onPanelVisibleChanged: (visible: boolean) => void;
};

export const App = ({
  activity,
  activityBar,
  editorVisible,
  openEditors,
  panelVisible,
  primarySideBar,
  primarySideBarPosition,
  secondarySideBar,
  onActivityChanged,
  onEditorVisibleChanged,
  onOpenEditorsChanged,
  onPanelVisibleChanged,
}: AppProps) => {
  const auxiliarySidebar = (
    <Allotment.Pane
      key="auxiliarySidebar"
      minSize={170}
      priority={LayoutPriority.Low}
      preferredSize={300}
      visible={secondarySideBar}
      snap
    >
      <AuxiliaryBar />
    </Allotment.Pane>
  );

  const sidebar = (
    <Allotment.Pane
      key="sidebar"
      minSize={170}
      priority={LayoutPriority.Low}
      preferredSize={300}
      visible={primarySideBar}
      snap
    >
      <Sidebar
        title={ACTIVITIES[activity]}
        documents={DOCUMENTS}
        openEditors={openEditors}
        onOpenEditorsChange={(openEditor) => {
          onOpenEditorsChanged(openEditor);
        }}
      />
    </Allotment.Pane>
  );

  return (
    <Allotment proportionalLayout={false}>
      <Allotment.Pane
        key="activityBar"
        minSize={48}
        maxSize={48}
        visible={activityBar}
      >
        <ActivityBar
          checked={activity}
          items={[
            "files",
            "search",
            "source-control",
            "debug-alt",
            "extensions",
          ]}
          onClick={(index) => {
            onActivityChanged(index);
          }}
        />
      </Allotment.Pane>
      {primarySideBarPosition === "left" ? sidebar : auxiliarySidebar}
      <Allotment.Pane
        key="content"
        minSize={300}
        priority={LayoutPriority.High}
      >
        <Allotment
          vertical
          snap
          onVisibleChange={(index, value) => {
            if (index === 0) {
              onEditorVisibleChanged(value);
            } else if (index === 1) {
              onPanelVisibleChanged(value);
            }
          }}
        >
          <Allotment.Pane key="editor" minSize={70} visible={editorVisible}>
            <Editor
              documents={openEditors}
              onDocumentsChange={(documents) => {
                onOpenEditorsChanged(documents);
              }}
            />
          </Allotment.Pane>
          <Allotment.Pane
            key="terminal"
            minSize={78}
            preferredSize="40%"
            visible={panelVisible}
          >
            <Panel
              maximized={!editorVisible}
              onClose={() => {
                onEditorVisibleChanged(true);
                onPanelVisibleChanged(false);
              }}
              onMaximize={() => {
                onEditorVisibleChanged(false);
                onPanelVisibleChanged(true);
              }}
              onMinimize={() => {
                onEditorVisibleChanged(true);
                onPanelVisibleChanged(true);
              }}
            />
          </Allotment.Pane>
        </Allotment>
      </Allotment.Pane>
      {primarySideBarPosition === "right" ? sidebar : auxiliarySidebar}
    </Allotment>
  );
};
