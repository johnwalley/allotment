import classNames from "classnames";
import React from "react";

import type { FileIcon as FileIconName } from "./documents";
import styles from "./file-icon.module.css";

export const FileIcon = ({ icon }: { icon: FileIconName }) => (
  <span className={classNames(styles.fileIcon, styles[icon])} aria-hidden />
);
