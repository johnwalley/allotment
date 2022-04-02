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
import { Sidebar } from "./components/side-bar";

export default {
  title: "Advanced",
  Component: Allotment,
} as Meta;

export const VisualStudioCode: Story = () => {
  const [editorVisible, setEditorVisible] = useState(true);
  const [panelVisible, setPanelVisible] = useState(true);

  console.log(editorVisible, panelVisible);

  return (
    <div className={styles.container}>
      <Allotment>
        <Allotment.Pane minSize={48} maxSize={48}>
          <ActivityBar
            items={[
              "files",
              "search",
              "source-control",
              "debug-alt",
              "extensions",
            ]}
          />
        </Allotment.Pane>
        <Allotment.Pane minSize={170} snap>
          <Sidebar />
        </Allotment.Pane>
        <Allotment.Pane minSize={300}>
          <Allotment vertical snap>
            <Allotment.Pane minSize={70} visible={editorVisible}>
              <Editor />
            </Allotment.Pane>
            <Allotment.Pane minSize={78} visible={panelVisible}>
              <Panel
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
              />
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};
