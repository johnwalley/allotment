---
id: styling
title: Styling
---

# Styling

Some common style changes can be made by setting CSS variables.

These include:

| Name                               | Default                     | Description                                                       |
| :--------------------------------- | :-------------------------- | :---------------------------------------------------------------- |
| `--focus-border`                   | `#007fd4`                   | Color of the sash when hovered                                    |
| `--separator-border`               | `rgba(128, 128, 128, 0.35)` | Color of the separator                                            |
| `--sash-hover-transition-duration` | `0.1s`                      | Length of time hover transition animation should take to complete |
| `--sash-size`                      | `8px`                       | Size of the draggable area between panes                          |
| `--sash-hover-size`                | `4px`                       | Size of the highlighted sash when hovered                         |

To control the size of the draggable area between panes you can call the exported `setSashSize` function with the desired size in pixels (clamped between 4 and 20). Set it to a larger value if you find it hard to resize the panes using the mouse. On touch devices the draggable area is always set to 20 pixels.

```tsx
import { setSashSize } from "allotment";

setSashSize(12);
```

For more involved styling you can target the component's child elements.

| Class                          | Description                                                          |
| :----------------------------- | :------------------------------------------------------------------- |
| `.split-view`                  | Styles applied to the top-level container                            |
| `.split-view-horizontal`       | Styles applied to the top-level container if `vertical={false}`      |
| `.split-view-vertical`         | Styles applied to the top-level container if `vertical={true}`       |
| `.split-view-separator-border` | Styles applied to the top-level container if `separator={true}`      |
| `.split-view-sash-dragging`    | Styles applied to the top-level container if a sash is being dragged |
| `.sash-container`              | Styles applied to the sash container                                 |
| `.sash`                        | Styles applied to the sash                                           |
| `.sash-active`                 | Styles applied to the sash if being dragged                          |
| `.sash-disabled`               | Styles applied to the sash if disabled                               |
| `.sash-horizontal`             | Styles applied to the sash if `vertical={false}`                     |
| `.sash-hover`                  | Styles applied to the sash if being hovered over                     |
| `.sash-mac`                    | Styles applied to the sash if running under macos                    |
| `.sash-maximum`                | Styles applied to the sash if the pane is maximised                  |
| `.sash-minimum`                | Styles applied to the sash if the pane is minimised                  |
| `.sash-vertical`               | Styles applied to the sash if `vertical={true}`                      |
| `.split-view-container`        | Styles applied to the split view container                           |
| `.split-view-view`             | Styles applied to the split view view                                |
| `.split-view-view-visible`     | Styles applied to the split view view if `visible={true}`            |
