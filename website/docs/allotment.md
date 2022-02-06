---
id: allotment
title: Allotment
---

# Allotment API

## Props

| Name           | Type       | Default | Description                                                                                                                                                 |
| -------------- | ---------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultSizes` | `number[]` |         | An array of initial sizes of the panes. If the sum of the sizes differs from the size of the container then the panes' sizes will be scaled proportionally. |
| `maxSize`      | `number`   |         | Maximum size of any pane.                                                                                                                                   |
| `minSize`      | `number`   |         | Minimum size of any pane.                                                                                                                                   |
| `snap`         | `boolean`  | `false` | Enable snap to zero for all panes.                                                                                                                          |
| `vertical`     | `boolean`  | `false` | Direction to split. If true then the panes will be stacked vertically, otherwise they will be stacked horizontally.                                         |
| `onReset`      | `func`     |         | Callback that is fired whenever the user double clicks a sash                                                                                               |
