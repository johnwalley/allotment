import clsx from "clsx";
import React from "react";

import styles from "./titlebar.module.css";

export type TitlebarProps = {
  title: string;
  showPanel: boolean;
  showPrimarySideBar: boolean;
  showSecondarySideBar: boolean;
  onShowPanelChanged: (visible: boolean) => void;
  onShowPrimarySideBarChanged: (visible: boolean) => void;
  onShowSecondarySidebarChanged: (visible: boolean) => void;
};

export const Titlebar = ({
  title,
  showPanel,
  showPrimarySideBar,
  showSecondarySideBar,
  onShowPanelChanged,
  onShowPrimarySideBarChanged,
  onShowSecondarySidebarChanged,
}: TitlebarProps) => {
  return (
    <div className={styles.titlebar}>
      <div className={styles.trafficLights} aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className={styles.center}>
        <div className={styles.navigation}>
          <a
            className="codicon codicon-arrow-left action-label"
            role="button"
            title="Go Back (⌃-)"
          />
        </div>
        <div className={styles.navigation}>
          <a
            className="codicon codicon-arrow-right action-label"
            role="button"
            title="Go Forward (⌃⇧-)"
          />
        </div>
        <div className={styles.commandCenter} title="Search my-app (⌘P)">
          <span className="codicon codicon-search" />
          <span className={styles.commandCenterLabel}>{title}</span>
        </div>
        <div className={styles.chat} title="Toggle Chat (⌃⌘I)">
          <span className="codicon codicon-copilot" />
          <span className="codicon codicon-chevron-down" />
        </div>
      </div>
      <div className={styles.layoutControls}>
        <a
          className={clsx(
            "codicon action-label",
            showPrimarySideBar
              ? "codicon-layout-sidebar-left"
              : "codicon-layout-sidebar-left-off",
          )}
          role="button"
          title="Toggle Primary Side Bar (⌘B)"
          onClick={() => onShowPrimarySideBarChanged(!showPrimarySideBar)}
        />
        <a
          className={clsx(
            "codicon action-label",
            showPanel ? "codicon-layout-panel" : "codicon-layout-panel-off",
          )}
          role="button"
          title="Toggle Panel (⌘J)"
          onClick={() => onShowPanelChanged(!showPanel)}
        />
        <a
          className={clsx(
            "codicon action-label",
            showSecondarySideBar
              ? "codicon-layout-sidebar-right"
              : "codicon-layout-sidebar-right-off",
          )}
          role="button"
          title="Toggle Secondary Side Bar (⌥⌘B)"
          onClick={() => onShowSecondarySidebarChanged(!showSecondarySideBar)}
        />
        <a
          className="codicon codicon-layout action-label"
          role="button"
          title="Customize Layout..."
        />
      </div>
    </div>
  );
};
