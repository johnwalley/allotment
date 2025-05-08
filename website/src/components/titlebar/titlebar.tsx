import classNames from "classnames";
import React from "react";

import styles from "./titlebar.module.css";

export type TitlebarProps = {
  showPanel: boolean;
  showPrimarySideBar: boolean;
  showSecondarySideBar: boolean;
  onShowPanelChanged: (visible: boolean) => void;
  onShowPrimarySideBarChanged: (visible: boolean) => void;
  onShowSecondarySidebarChanged: (visible: boolean) => void;
};

export const Titlebar = ({
  showPanel,
  showPrimarySideBar,
  showSecondarySideBar,
  onShowPanelChanged,
  onShowPrimarySideBarChanged,
  onShowSecondarySidebarChanged,
}: TitlebarProps) => {
  return (
    <div className={styles.titlebar}>
      <div className={styles.layoutControls}>
        <ul className={styles.actionsContainer}>
          <li className={styles.actionItem}>
            <a
              className={classNames(
                "codicon",
                showPrimarySideBar
                  ? "codicon-layout-sidebar-left"
                  : "codicon-layout-sidebar-left-off",
                styles.actionLabel,
              )}
              role="button"
              aria-label="Toggle Primary Side Bar (⌘B)"
              title=""
              tab-index="0"
              onClick={() => onShowPrimarySideBarChanged(!showPrimarySideBar)}
            ></a>
          </li>
          <li className={styles.actionItem}>
            <a
              className={classNames(
                "codicon",
                showPanel ? "codicon-layout-panel" : "codicon-layout-panel-off",
                styles.actionLabel,
              )}
              role="button"
              aria-label="Toggle Primary Side Bar (⌘B)"
              title=""
              tab-index="0"
              onClick={() => onShowPanelChanged(!showPanel)}
            ></a>
          </li>
          <li className={styles.actionItem}>
            <a
              className={classNames(
                "codicon",
                showSecondarySideBar
                  ? "codicon-layout-sidebar-right"
                  : "codicon-layout-sidebar-right-off",
                styles.actionLabel,
              )}
              role="button"
              aria-label="Toggle Primary Panel (⌘.)"
              title=""
              tab-index="0"
              onClick={() =>
                onShowSecondarySidebarChanged(!showSecondarySideBar)
              }
            ></a>
          </li>
          <li className={styles.actionItem}>
            <a
              className={classNames(
                "codicon codicon-layout",
                styles.actionLabel,
              )}
              role="button"
              aria-label="Toggle Secondary Side Bar"
              title=""
              tab-index="0"
              onClick={console.log}
            ></a>
          </li>
        </ul>
      </div>
    </div>
  );
};
