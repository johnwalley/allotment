import "allotment/dist/style.css";

import { Allotment, LayoutPriority, setSashSize } from "allotment";
import React from "react";

// Everything live code blocks in the docs can use without importing it
const ReactLiveScope = {
  React,
  ...React,
  Allotment,
  LayoutPriority,
  setSashSize,
};

export default ReactLiveScope;
