import classNames from "classnames";
import React from "react";

import styles from "./statusbar.module.css";

export type StatusbarProps = {};

export const Statusbar = ({}: StatusbarProps) => {
  return <div className={styles.statusbar}></div>;
};
