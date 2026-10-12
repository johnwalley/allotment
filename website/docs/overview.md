---
id: overview
title: Overview
---

# API Overview

For most purposes the `Allotment` component is all that is needed. Consider using the `Allotment.Pane` sub-component if you need more fine-grained control over the individual panes.

## Exports

Everything below is exported from the `allotment` package.

| Export            | Kind      | Description                                                                                                                                          |
| ----------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Allotment`       | Component | The split view. Each child becomes a pane. See [Allotment](allotment.md).                                                                            |
| `Allotment.Pane`  | Component | Wraps a child to set per-pane options such as sizes and snapping. See [Pane](pane.md).                                                               |
| `LayoutPriority`  | Enum      | `Low`, `Normal` or `High`, for the `priority` prop on `Allotment.Pane`. See [Pane](pane.md#priority).                                                |
| `setSashSize`     | Function  | `(size: number) => void`. Sets the size of the draggable area between panes, for every `Allotment` on the page. See [Styling](styling.md#sash-size). |
| `AllotmentHandle` | Type      | The ref handle, with the `reset` and `resize` methods. See [Ref methods](allotment.md#ref-methods).                                                  |
| `AllotmentProps`  | Type      | The props accepted by `Allotment`.                                                                                                                   |

The stylesheet is published separately and must be imported once, usually at the root of your app:

```tsx
import "allotment/dist/style.css";
```
