---
id: snapping
title: Snapping
---

# Snapping

With `snap` enabled, a pane can be dragged closed. Drag the sash past half of the pane's minimum size and the pane snaps to zero and is hidden. Drag the sash back out to show it again.

This is how the sidebar and panel in VS Code work. Try it on the left pane:

```tsx live
<div style={{ height: 300 }}>
  <Allotment>
    <Allotment.Pane snap minSize={150} preferredSize={200}>
      <div className="demo-pane">Drag me closed</div>
    </Allotment.Pane>
    <Allotment.Pane>
      <div className="demo-pane">Main</div>
    </Allotment.Pane>
  </Allotment>
</div>
```

`snap` can be set on `Allotment.Pane` for a single pane, as above, or on `Allotment` for every pane.

## Choosing a minimum size

Snapping happens at half of the pane's minimum size, so `minSize` decides how far the user has to drag. Here the pane resizes normally down to 150 pixels, stays at 150 until the sash is dragged below 75, then snaps closed.

The default `minSize` is 30 pixels, which means a pane snaps once it's under 15 pixels wide. That's easy to miss, so set a `minSize` that suits the content when you use `snap`.

## Knowing when a pane snaps

A snapped pane is hidden in the same way as a pane with `visible={false}`. To find out when the user snaps a pane closed or drags it open again, give the pane a `visible` prop and listen to `onVisibleChange` on `Allotment`. It's called with the index of the pane and whether it's now visible.

```tsx live
function SnapState() {
  const [visible, setVisible] = React.useState(true);

  return (
    <>
      <p>
        The sidebar is <strong>{visible ? "open" : "snapped closed"}</strong>.
      </p>
      <div style={{ height: 300 }}>
        <Allotment
          onVisibleChange={(index, visible) => {
            if (index === 0) {
              setVisible(visible);
            }
          }}
        >
          <Allotment.Pane snap minSize={150} visible={visible}>
            <div className="demo-pane">Sidebar</div>
          </Allotment.Pane>
          <Allotment.Pane>
            <div className="demo-pane">Main</div>
          </Allotment.Pane>
        </Allotment>
      </div>
    </>
  );
}
```

:::note

`onVisibleChange` is only called for panes that have a `visible` prop. Store the value in state and pass it back, as above, so the prop and the pane stay in sync. See [Visible](visible.md) for showing and hiding panes from your own controls.

:::

## Styling a snapped pane

When a pane snaps, its element loses the `split-view-view-visible` class. The sash next to it gets the `sash-minimum` class if the snapped pane is before it, or `sash-maximum` if it's after it. These classes are also added when a pane reaches its minimum or maximum size, so to style only the snapped state, use the `visible` state from `onVisibleChange` instead.

A snapped pane at the edge of the window leaves its sash at the very edge, where it's easy to grab the browser's own resize handle instead. Here the sash is highlighted while the sidebar is snapped, so it's easier to find:

```tsx live
function HighlightSnappedSash() {
  const [visible, setVisible] = React.useState(true);

  return (
    <>
      <style>{`
        .snapped-sidebar .sash::before {
          background: var(--focus-border);
          left: 50%;
          width: 4px;
        }
      `}</style>
      <div style={{ height: 300 }}>
        <Allotment
          className={visible ? undefined : "snapped-sidebar"}
          onVisibleChange={(index, visible) => {
            if (index === 0) {
              setVisible(visible);
            }
          }}
        >
          <Allotment.Pane snap minSize={150} visible={visible}>
            <div className="demo-pane">Sidebar</div>
          </Allotment.Pane>
          <Allotment.Pane>
            <div className="demo-pane">Main</div>
          </Allotment.Pane>
        </Allotment>
      </div>
    </>
  );
}
```
