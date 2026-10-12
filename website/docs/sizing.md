---
id: sizing
title: Sizing
---

# Sizing

## Initial sizes

`defaultSizes` sets the initial size of each pane in pixels. If they don't add up to the size of the container, they're scaled proportionally, so here the right pane starts twice as wide as the left.

```tsx live
<div style={{ height: 300 }}>
  <Allotment defaultSizes={[100, 200]}>
    <div className="demo-pane">One third</div>
    <div className="demo-pane">Two thirds</div>
  </Allotment>
</div>
```

## Minimum and maximum sizes

Wrap a child in `Allotment.Pane` to control it individually. This sidebar can't be made narrower than 100 pixels or wider than 250.

```tsx live
<div style={{ height: 300 }}>
  <Allotment>
    <Allotment.Pane minSize={100} maxSize={250}>
      <div className="demo-pane">100–250px</div>
    </Allotment.Pane>
    <Allotment.Pane>
      <div className="demo-pane">Main</div>
    </Allotment.Pane>
  </Allotment>
</div>
```

`minSize` and `maxSize` can also be set on `Allotment` itself to apply to every pane.

## Fixed size

Set `minSize` and `maxSize` to the same value to stop a pane being resized, for example a toolbar or activity bar.

```tsx live
<div style={{ height: 300 }}>
  <Allotment>
    <Allotment.Pane minSize={48} maxSize={48}>
      <div className="demo-pane">48px</div>
    </Allotment.Pane>
    <Allotment.Pane>
      <div className="demo-pane">Main</div>
    </Allotment.Pane>
  </Allotment>
</div>
```

## Preferred size

`preferredSize` is the size a pane returns to when it's first shown, when the user double-clicks a sash, and when `reset` is called. It can be a number of pixels or a string ending in `px` or `%`.

Resize the panes, then double-click a sash to put them back.

```tsx live
<div style={{ height: 300 }}>
  <Allotment>
    <Allotment.Pane preferredSize="20%">
      <div className="demo-pane">20%</div>
    </Allotment.Pane>
    <Allotment.Pane>
      <div className="demo-pane">The rest</div>
    </Allotment.Pane>
    <Allotment.Pane preferredSize={150}>
      <div className="demo-pane">150px</div>
    </Allotment.Pane>
  </Allotment>
</div>
```

## When the container resizes

By default, when the `Allotment` itself changes size, every pane grows or shrinks in proportion. That's usually wrong for a sidebar, which should keep its width while the main area takes up the difference.

Set `proportionalLayout={false}` to stop scaling the panes, and give the pane that should absorb the change `priority={LayoutPriority.High}`. Move the slider to resize both containers and compare.

```tsx live
function ContainerResize() {
  const [width, setWidth] = React.useState(100);

  return (
    <>
      <label className="margin-bottom--sm" style={{ display: "block" }}>
        Container width: {width}%{" "}
        <input
          type="range"
          min={40}
          max={100}
          value={width}
          onChange={(event) => setWidth(Number(event.target.value))}
        />
      </label>
      <p className="margin-bottom--xs">Proportional (default)</p>
      <div style={{ height: 150, width: `${width}%` }}>
        <Allotment>
          <Allotment.Pane preferredSize={150}>
            <div className="demo-pane">Sidebar</div>
          </Allotment.Pane>
          <Allotment.Pane>
            <div className="demo-pane">Main</div>
          </Allotment.Pane>
        </Allotment>
      </div>
      <p className="margin-top--md margin-bottom--xs">
        <code>proportionalLayout={"{false}"}</code>
      </p>
      <div style={{ height: 150, width: `${width}%` }}>
        <Allotment proportionalLayout={false}>
          <Allotment.Pane preferredSize={150}>
            <div className="demo-pane">Sidebar</div>
          </Allotment.Pane>
          <Allotment.Pane priority={LayoutPriority.High}>
            <div className="demo-pane">Main</div>
          </Allotment.Pane>
        </Allotment>
      </div>
    </>
  );
}
```

Without any priorities, the last pane takes up the change, so here `Main` would anyway. Setting its priority makes that explicit, and keeps it working if you add a pane after it. Panes with `LayoutPriority.Low` are resized only once the others reach their minimum or maximum size.

[Open in Storybook](https://allotment-storybook.netlify.app/?path=/story/basic--preferred-size)
