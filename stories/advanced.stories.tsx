import "@vscode/codicons/dist/codicon.css";

import { Meta, Story } from "@storybook/react";
import { useState } from "react";

import { Allotment } from "../src";
import styles from "./advanced.stories.module.css";
import { App, Document, DOCUMENTS } from "./components";

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
  secondarySideBar,
}) => {
  const [editorVisible, setEditorVisible] = useState(true);
  const [panelVisible, setPanelVisible] = useState(true);
  const [activity, setActivity] = useState(0);
  const [openEditors, setOpenEditors] = useState<Document[]>(DOCUMENTS);

  return (
    <div className={styles.container}>
      <App
        activity={activity}
        activityBar={activityBar}
        editorVisible={editorVisible}
        panelVisible={panelVisible}
        openEditors={openEditors}
        primarySideBar={primarySideBar}
        primarySideBarPosition={primarySideBarPosition}
        secondarySideBar={secondarySideBar}
        onActivityChanged={setActivity}
        onEditorVisibleChanged={setEditorVisible}
        onOpenEditorsChanged={setOpenEditors}
        onPanelVisibleChanged={setPanelVisible}
      />
    </div>
  );
};

VisualStudioCode.args = {
  activityBar: true,
  primarySideBar: true,
  primarySideBarPosition: "left",
  secondarySideBar: true,
};
