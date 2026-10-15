---
id: reset
title: Reset and resize
---

# Reset and resize

Pass a `ref` to `Allotment` to control pane sizes from your own code.

- `reset()` makes the panes equal, then moves any pane with a `preferredSize` to that size. It does the same as double-clicking a sash.
- `resize(sizes)` sets the size of each pane in pixels. Like `defaultSizes`, they're scaled to fit if they don't add up to the container's size.

```tsx live
function Controls() {
  const ref = React.useRef<AllotmentHandle>(null);

  return (
    <>
      <div className="margin-bottom--sm">
        <button
          className="button button--secondary button--sm margin-right--sm"
          onClick={() => ref.current?.reset()}
        >
          Reset
        </button>
        <button
          className="button button--secondary button--sm"
          onClick={() => ref.current?.resize([100, 300])}
        >
          Resize to 1:3
        </button>
      </div>
      <div style={{ height: 300 }}>
        <Allotment ref={ref}>
          <div className="demo-pane">Left</div>
          <div className="demo-pane">Right</div>
        </Allotment>
      </div>
    </>
  );
}
```

## Custom reset

Pass `onReset` to replace the default behaviour. It's called both when the user double-clicks a sash and when `reset()` is called. Double-click the sash here to make the left pane a quarter of the width.

```tsx live
function CustomReset() {
  const ref = React.useRef<AllotmentHandle>(null);

  return (
    <div style={{ height: 300 }}>
      <Allotment ref={ref} onReset={() => ref.current?.resize([100, 300])}>
        <div className="demo-pane">Left</div>
        <div className="demo-pane">Right</div>
      </Allotment>
    </div>
  );
}
```

[Open in Storybook](https://allotment-storybook.netlify.app/?path=/story/basic--reset)
