import React from "react";

import styles from "./auxiliary-bar.module.css";

export type AuxiliaryBarProps = {};

export const AuxiliaryBar = ({}: AuxiliaryBarProps) => {
  return (
    <div className={styles.auxiliaryBar}>
      <div className={styles.messageArea}>Drag a view here to display.</div>
    </div>
  );
};
