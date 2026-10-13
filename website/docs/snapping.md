---
id: snapping
title: Snapping
---

# Snapping

With `snap` set, a pane collapses to nothing when the user drags it below half its minimum size, like the sidebar and panel in VS Code. Drag the sash back out to restore it.

```tsx live
<div style={{ height: 300 }}>
  <Allotment>
    <Allotment.Pane preferredSize={200} minSize={120} snap>
      <div className="demo-pane">Drag me closed</div>
    </Allotment.Pane>
    <Allotment.Pane>
      <div className="demo-pane">Main</div>
    </Allotment.Pane>
  </Allotment>
</div>
```

Set `snap` on `Allotment` to let every pane snap, or on an individual `Allotment.Pane` to override it.

## Choosing a minimum size

The snap point depends on `minSize`. With the default of 30 pixels, a pane only snaps once it's dragged below 15, which is hard to notice. Give snapping panes a minimum size that makes sense for their content, so they stay usable until the user clearly means to close them.

## Keeping track of snapped panes

A snapped pane is hidden, in the same way as setting `visible={false}`. If you need to know when it happens, for example to update a toggle button, control the pane with the `visible` prop and listen to `onVisibleChange`. See [Visible](visible.md).
