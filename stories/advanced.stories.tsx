import "@vscode/codicons/dist/codicon.css";

import { Meta, Story } from "@storybook/react";
import { debounce } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Allotment,
  AllotmentHandle,
  AllotmentProps,
  setSashSize,
} from "../src";
import styles from "./advanced.stories.module.css";
import { ActivityBar } from "./components/activity-bar";
import { Editor } from "./components/editor";
import { Panel } from "./components/panel";
import { Sidebar } from "./components/sidebar";

const ACTIVITIES = [
  "Explorer",
  "Search",
  "Source Control",
  "Run and Debug",
  "Extensions",
];

export default {
  title: "Advanced",
  Component: Allotment,
  argTypes: {
    activityBar: {
      control: { type: "boolean" },
    },
    primarySideBar: {
      control: { type: "boolean" },
    },
    primarySideBarPosition: {
      options: ["left", "right"],
      control: { type: "radio" },
    },
  },
} as Meta;

export const VisualStudioCode: Story = ({
  activityBar,
  primarySideBar,
  primarySideBarPosition,
}) => {
  const [editorVisible, setEditorVisible] = useState(true);
  const [panelVisible, setPanelVisible] = useState(true);
  const [activity, setActivity] = useState(0);

  const sidebar = (
    <Allotment.Pane minSize={170} visible={primarySideBar} snap>
      <Sidebar title={ACTIVITIES[activity]} />
    </Allotment.Pane>
  );

  return (
    <div className={styles.container}>
      <Allotment>
        <Allotment.Pane minSize={48} maxSize={48} visible={activityBar}>
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
        {primarySideBarPosition === "left" && sidebar}
        <Allotment.Pane minSize={300}>
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
            <Allotment.Pane minSize={70} visible={editorVisible}>
              <Editor />
            </Allotment.Pane>
            <Allotment.Pane minSize={78} visible={panelVisible}>
              <Panel
                maximized={!editorVisible}
                onClose={() => {
                  console.log("close");
                  setEditorVisible(true);
                  setPanelVisible(false);
                }}
                onMaximize={() => {
                  console.log("maximize");

                  setEditorVisible(false);
                  setPanelVisible(true);
                }}
                onMinimize={() => {
                  console.log("minimize");

                  setEditorVisible(true);
                  setPanelVisible(true);
                }}
              />
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
        {primarySideBarPosition === "right" && sidebar}
      </Allotment>
    </div>
  );
};

VisualStudioCode.args = {
  activityBar: true,
  primarySideBar: true,
  primarySideBarPosition: "left",
};
