---
id: allotment
title: Allotment
---

# Allotment API

## Props

| Name                 | Type                                        | Default    | Description                                                                                                                                                                         |
| -------------------- | ------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className`          | `string`                                    |            | Sets a class name on the outer element.                                                                                                                                             |
| `defaultSizes`       | `number[]`                                  |            | An array of initial sizes of the panes. If the sum of the sizes differs from the size of the container then the panes' sizes will be scaled proportionally.                         |
| `id`                 | `string`                                    |            | The id to set on the outer element.                                                                                                                                                 |
| `maxSize`            | `number`                                    | `Infinity` | Maximum size of any pane.                                                                                                                                                           |
| `minSize`            | `number`                                    | `30`       | Minimum size of any pane.                                                                                                                                                           |
| `proportionalLayout` | `boolean`                                   | `true`     | Resize each view proportionally when resizing container.                                                                                                                            |
| `separator`          | `boolean`                                   | `true`     | Whether to render a separator between panes.                                                                                                                                        |
| `sizes`              | `number[]`                                  |            | **Deprecated.** Use `defaultSizes` instead.                                                                                                                                         |
| `snap`               | `boolean`                                   | `false`    | Enable snap to zero for all panes.                                                                                                                                                  |
| `vertical`           | `boolean`                                   | `false`    | Direction to split. If true then the panes will be stacked vertically, otherwise they will be stacked horizontally.                                                                 |
| `onChange`           | `(sizes: number[]) => void`                 |            | Callback that is fired when the pane sizes change (usually on drag). Recommended to add a debounce function to rate limit the callback.                                             |
| `onDragStart`        | `(sizes: number[]) => void`                 |            | Callback that is fired when the user starts dragging a sash.                                                                                                                        |
| `onDragEnd`          | `(sizes: number[]) => void`                 |            | Callback that is fired when the user stops dragging a sash.                                                                                                                         |
| `onReset`            | `() => void`                                |            | Callback that is fired whenever the user double clicks a sash.                                                                                                                      |
| `onVisibleChange`    | `(index: number, visible: boolean) => void` |            | Callback that is fired whenever the user changes the visibility of a pane by snapping. Only called for panes with a `visible` prop, and only if the new value is different from it. |

## Ref methods

You can use a ref to get access to the Allotment component instance and call its methods manually.

| Name     | Type                        | Description                                                                                                                                     |
| -------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `reset`  | `() => void`                | Distribute the panes equally, then resize any pane with a `preferredSize` to that size. If an `onReset` prop is provided, it is called instead. |
| `resize` | `(sizes: number[]) => void` | Resize the panes to the given sizes.                                                                                                            |

```tsx
import * as React from "react";
import { Allotment, AllotmentHandle } from "allotment";

function App() {
  const ref = React.useRef<AllotmentHandle>(null);

  return (
    <div>
      <button onClick={() => ref.current?.reset()}>Reset</button>
      <button onClick={() => ref.current?.resize([100, 200])}>Resize</button>
      <Allotment ref={ref}>
        <div />
        <div />
      </Allotment>
    </div>
  );
}
```
