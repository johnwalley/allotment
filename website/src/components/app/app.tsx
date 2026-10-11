import "allotment/dist/style.css";

import { Allotment, LayoutPriority } from "allotment";
import React, { useState } from "react";

import { ActivityBar } from "../activity-bar";
import { AuxiliaryBar } from "../auxiliary-bar";
import { Editor } from "../editor";
import { Panel } from "../panel";
import { Sidebar } from "../sidebar";
import { Statusbar } from "../statusbar";
import { Titlebar } from "../titlebar";
import { DOCUMENTS, Document } from "../documents";
import styles from "./app.module.css";

export const ACTIVITIES = [
  { icon: "files", title: "Explorer" },
  { icon: "search", title: "Search" },
  { icon: "source-control", title: "Source Control" },
  { icon: "debug-alt", title: "Run and Debug" },
  { icon: "extensions", title: "Extensions" },
];

export const App = () => {
  const [editorVisible, setEditorVisible] = useState(true);
  const [panelVisible, setPanelVisible] = useState(true);
  const [activity, setActivity] = useState(0);
  const [activityBar, setActivityBar] = useState(true);
  const [openEditors, setOpenEditors] = useState(DOCUMENTS.slice(0, 2));
  const [activeEditor, setActiveEditor] = useState(0);
  const [primarySideBar, setPrimarySideBar] = useState(true);
  const [primarySideBarPosition, setPrimarySideBarPosition] = useState<
    "left" | "right"
  >("left");
  const [secondarySideBar, setSecondarySideBar] = useState(false);

  const activeIndex = Math.min(activeEditor, openEditors.length - 1);
  const activeDocument = openEditors[activeIndex];

  // Without tabs each editor group shows a single file, so opening a file
  // focuses the group already showing it or replaces the focused group's file
  const openDocument = (document: Document) => {
    const index = openEditors.indexOf(document);

    if (index !== -1) {
      setActiveEditor(index);
    } else if (openEditors.length === 0) {
      setOpenEditors([document]);
      setActiveEditor(0);
    } else {
      const newDocuments = [...openEditors];
      newDocuments[activeIndex] = document;

      setOpenEditors(newDocuments);
    }
  };

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
        activity={activity}
        title={ACTIVITIES[activity].title}
        documents={DOCUMENTS}
        activeDocument={activeDocument}
        onOpen={openDocument}
      />
    </Allotment.Pane>
  );

  return (
    <Allotment vertical className={styles.app}>
      <Allotment.Pane minSize={35} maxSize={35}>
        <Titlebar
          title="my-app"
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
              items={ACTIVITIES}
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
                  activeIndex={activeIndex}
                  documents={openEditors}
                  onActiveIndexChange={setActiveEditor}
                  onDocumentsChange={(documents) => {
                    setOpenEditors(documents);
                  }}
                />
              </Allotment.Pane>
              <Allotment.Pane
                key="terminal"
                minSize={78}
                preferredSize="35%"
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
      <Allotment.Pane minSize={22} maxSize={22}>
        <Statusbar languageName={activeDocument?.languageName} />
      </Allotment.Pane>
    </Allotment>
  );
};
