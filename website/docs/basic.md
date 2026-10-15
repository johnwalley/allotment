---
id: basic
title: Layout
---

# Layout

Each child of `Allotment` becomes a pane. Drag the line between two panes to resize them, and double-click it to reset them to equal sizes.

All the examples on this site are editable: change the code and the result updates as you type.

```tsx live
<div style={{ height: 300 }}>
  <Allotment>
    <div className="demo-pane">One</div>
    <div className="demo-pane">Two</div>
    <div className="demo-pane">Three</div>
  </Allotment>
</div>
```

:::tip

Allotment fills its parent element, so the parent needs a height. If you can't see anything, check that first.

:::

## Vertical

Set `vertical` to stack the panes from top to bottom.

```tsx live
<div style={{ height: 300 }}>
  <Allotment vertical>
    <div className="demo-pane">Top</div>
    <div className="demo-pane">Bottom</div>
  </Allotment>
</div>
```

## Without a separator

Set `separator={false}` to hide the line between panes. You can still drag the boundary to resize them.

```tsx live
<div style={{ height: 300 }}>
  <Allotment separator={false}>
    <div className="demo-pane">Left</div>
    <div className="demo-pane">Right</div>
  </Allotment>
</div>
```

## Scrolling content

Panes don't scroll by themselves. If the content can be larger than the pane, wrap it in an element that fills the pane and has `overflow: auto`.

```tsx live
<div style={{ height: 300 }}>
  <Allotment>
    <div style={{ height: "100%", overflow: "auto" }}>
      {Array.from({ length: 50 }, (_, i) => (
        <p key={i} style={{ margin: "0.25rem 0.75rem" }}>
          Line {i + 1}
        </p>
      ))}
    </div>
    <div className="demo-pane">Two</div>
  </Allotment>
</div>
```

[Open in Storybook](https://allotment-storybook.netlify.app/?path=/story/basic--horizontal)
