---
id: allotment
title: Allotment
---

# Allotment API

## Props

| Name                 | Type       | Default | Description                                                                                                                                                                                          |
| -------------------- | ---------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultSizes`       | `number[]` |         | An array of initial sizes of the panes. If the sum of the sizes differs from the size of the container then the panes' sizes will be scaled proportionally.                                          |
| `maxSize`            | `number`   |         | Maximum size of any pane.                                                                                                                                                                            |
| `minSize`            | `number`   |         | Minimum size of any pane.                                                                                                                                                                            |
| `proportionalLayout` | `boolean`  | `true`  | Resize each view proportionally when resizing container.                                                                                                                                             |
| `separator`          | `boolean`  | `true`  | Whether to render a separator between panes.                                                                                                                                                         |
| `snap`               | `boolean`  | `false` | Enable snap to zero for all panes.                                                                                                                                                                   |
| `vertical`           | `boolean`  | `false` | Direction to split. If true then the panes will be stacked vertically, otherwise they will be stacked horizontally.                                                                                  |
| `onReset`            | `func`     |         | Callback that is fired whenever the user double clicks a sash                                                                                                                                        |
| `onVisibleChange`    | `func`     |         | Callback that is fired whenever the user changes the visibility of a pane by snapping. Note that this will only be called if the new value is different from the current `visible` prop on the Pane. |
