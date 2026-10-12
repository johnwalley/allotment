---
id: pane
title: Pane
---

# Allotment.Pane API

## Props

| Name            | Type                 | Default                 | Description                                                                    |
| --------------- | -------------------- | ----------------------- | ------------------------------------------------------------------------------ |
| `className`     | `string`             |                         | Sets a class name on the pane element.                                         |
| `maxSize`       | `number`             |                         | Maximum size of this pane. Overrides `maxSize` set on parent component.        |
| `minSize`       | `number`             |                         | Minimum size of this pane. Overrides `minSize` set on parent component.        |
| `priority`      | `LayoutPriority`     | `LayoutPriority.Normal` | Which panes are resized first when the layout changes. See [below](#priority). |
| `preferredSize` | `number` \| `string` |                         | Size to use when the pane is added or reset. See [below](#preferredsize).      |
| `snap`          | `boolean`            | `false`                 | Enable snap to zero for this pane. Overrides `snap` set on parent component.   |
| `visible`       | `boolean`            | `true`                  | Whether this pane should be visible.                                           |

### `priority`

The priority of the pane when the layout algorithm runs. Panes with higher priority are resized first. One of `LayoutPriority.Low`, `LayoutPriority.Normal` or `LayoutPriority.High`, imported from `allotment`.

Only used when `proportionalLayout` is `false`. See [When the container resizes](sizing.md#when-the-container-resizes) for an example.

### `preferredSize`

Allotment tries to give the pane this size when it is added (including on initial mount), when the user double-clicks a sash, and when the `reset` method is called on the Allotment instance.

The size can be a number or a string:

- A number is a size in pixels, e.g. `120`.
- A string ending in `px` is also a size in pixels, e.g. `"120px"`.
- A string ending in `%` is a percentage of the size of the Allotment component, e.g. `"50%"`.
