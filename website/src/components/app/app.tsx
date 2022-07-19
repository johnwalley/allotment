import "allotment/dist/style.css";

import { Allotment, LayoutPriority } from "allotment";
import React, { useState } from "react";

import { ActivityBar } from "../activity-bar";
import { AuxiliaryBar } from "../auxiliary-bar";
import { Editor } from "../editor";
import { Panel } from "../panel";
import { Sidebar } from "../sidebar";
import { Titlebar } from "../titlebar";
import styles from "./app.module.css";

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

export const App = () => {
  const [editorVisible, setEditorVisible] = useState(true);
  const [panelVisible, setPanelVisible] = useState(true);
  const [activity, setActivity] = useState(0);
  const [activityBar, setActivityBar] = useState(true);
  const [openEditors, setOpenEditors] = useState(DOCUMENTS);
  const [primarySideBar, setPrimarySideBar] = useState(true);
  const [primarySideBarPosition, setPrimarySideBarPosition] = useState<
    "left" | "right"
  >("left");
  const [secondarySideBar, setSecondarySideBar] = useState(false);

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
          setOpenEditors(openEditor);
        }}
      />
    </Allotment.Pane>
  );

  return (
    <Allotment vertical className={styles.app}>
      <Allotment.Pane minSize={28} maxSize={28}>
        <Titlebar
          showPanel={panelVisible}
          showPrimarySideBar={primarySideBar}
          showSecondarySideBar={secondarySideBar}
          onShowPanelChanged={setPanelVisible}
          onShowPrimarySideBarChanged={setPrimarySideBar}
          onShowSecondarySidebarChanged={setSecondarySideBar}
        />
      </Allotment.Pane>
      <Allotment.Pane>
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
                setActivity(index);
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
                  setEditorVisible(value);
                } else if (index === 1) {
                  setPanelVisible(value);
                }
              }}
            >
              <Allotment.Pane key="editor" minSize={70} visible={editorVisible}>
                <Editor
                  documents={openEditors}
                  onDocumentsChange={(documents) => {
                    setOpenEditors(documents);
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
                    setEditorVisible(true);
                    setPanelVisible(false);
                  }}
                  onMaximize={() => {
                    setEditorVisible(false);
                    setPanelVisible(true);
                  }}
                  onMinimize={() => {
                    setEditorVisible(true);
                    setPanelVisible(true);
                  }}
                />
              </Allotment.Pane>
            </Allotment>
          </Allotment.Pane>
          {primarySideBarPosition === "right" ? sidebar : auxiliarySidebar}
        </Allotment>
      </Allotment.Pane>
    </Allotment>
  );
};
