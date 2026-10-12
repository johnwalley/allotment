import "allotment/dist/style.css";

import { Allotment, LayoutPriority } from "allotment";
import React, { useEffect, useState } from "react";

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

// Below this width the demo starts without the sidebar and shrinks its
// minimum sizes so that it fits on a phone
const NARROW_QUERY = "(max-width: 600px)";

const useNarrow = () => {
  const [narrow, setNarrow] = useState(
    () => window.matchMedia(NARROW_QUERY).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(NARROW_QUERY);
    const onChange = () => setNarrow(mediaQuery.matches);

    mediaQuery.addEventListener("change", onChange);

    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return narrow;
};

export const App = () => {
  const narrow = useNarrow();
  const [editorVisible, setEditorVisible] = useState(true);
  const [panelVisible, setPanelVisible] = useState(true);
  const [activity, setActivity] = useState(0);
  const [activityBar, setActivityBar] = useState(true);
  const [openEditors, setOpenEditors] = useState(DOCUMENTS.slice(0, 2));
  const [activeEditor, setActiveEditor] = useState(0);
  const [primarySideBar, setPrimarySideBar] = useState(!narrow);
  const [primarySideBarPosition, setPrimarySideBarPosition] = useState<
    "left" | "right"
  >("left");
  const [secondarySideBar, setSecondarySideBar] = useState(false);

  const sideBarMinSize = narrow ? 120 : 170;

  // There's only room for one side bar on a narrow screen
  const showPrimarySideBar = (visible: boolean) => {
    setPrimarySideBar(visible);

    if (visible && narrow) {
      setSecondarySideBar(false);
    }
  };

  const showSecondarySideBar = (visible: boolean) => {
    setSecondarySideBar(visible);

    if (visible && narrow) {
      setPrimarySideBar(false);
    }
  };

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
      minSize={sideBarMinSize}
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
      minSize={sideBarMinSize}
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
          onShowPrimarySideBarChanged={showPrimarySideBar}
          onShowSecondarySidebarChanged={showSecondarySideBar}
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
            minSize={narrow ? 120 : 300}
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
                  minSize={narrow ? 60 : 110}
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
