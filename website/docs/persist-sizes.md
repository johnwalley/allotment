---
id: persist-sizes
title: Persisting sizes
---

# Persisting sizes

To remember a layout between visits, save the sizes when the user finishes dragging and pass them back as `defaultSizes`.

Resize the panes below, then reload the page.

```tsx live
function PersistedLayout() {
  const [defaultSizes] = React.useState<number[] | undefined>(() => {
    const saved = localStorage.getItem("allotment-sizes");
    return saved ? JSON.parse(saved) : undefined;
  });

  return (
    <div style={{ height: 300 }}>
      <Allotment
        defaultSizes={defaultSizes}
        onDragEnd={(sizes) => {
          localStorage.setItem("allotment-sizes", JSON.stringify(sizes));
        }}
      >
        <div className="demo-pane">One</div>
        <div className="demo-pane">Two</div>
        <div className="demo-pane">Three</div>
      </Allotment>
    </div>
  );
}
```

`onDragEnd` only fires when a drag finishes. To also save sizes after a double-click reset or a `resize()` call, use `onChange` instead, and debounce it because it fires continuously while dragging.

## Telling drags apart from other resizes

`onChange` fires whenever the pane sizes change: while the user drags a sash, but also when the container is resized, panes are added or hidden, or you call `resize()`. To react only to the user, set a flag in `onDragStart` and clear it in `onDragEnd`.

Drag a sash, then resize the browser window, and compare what each one reports.

```tsx live
function DragOrResize() {
  const dragging = React.useRef(false);
  const [source, setSource] = React.useState("Nothing yet");
  const [sizes, setSizes] = React.useState<number[]>([]);

  return (
    <>
      <p>
        Last change: <strong>{source}</strong>{" "}
        {sizes.map((size) => Math.round(size)).join(", ")}
      </p>
      <div style={{ height: 300 }}>
        <Allotment
          onDragStart={() => {
            dragging.current = true;
          }}
          onDragEnd={() => {
            dragging.current = false;
          }}
          onChange={(sizes) => {
            setSource(dragging.current ? "User drag" : "Layout change");
            setSizes(sizes);
          }}
        >
          <div className="demo-pane">One</div>
          <div className="demo-pane">Two</div>
        </Allotment>
      </div>
    </>
  );
}
```

If your app renders on the server, `localStorage` isn't available there. Read it in an effect, or only render `Allotment` on the client. See [Server rendering and Next.js](server-rendering.md).

[Open in Storybook](https://allotment-storybook.netlify.app/?path=/story/basic--persist-sizes)
