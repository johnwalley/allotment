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

If your app renders on the server, `localStorage` isn't available there. Read it in an effect, or only render `Allotment` on the client.

[Open in Storybook](https://allotment-storybook.netlify.app/?path=/story/basic--persist-sizes)
