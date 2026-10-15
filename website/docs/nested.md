---
id: nested
title: Nested
---

# Nested

Put an `Allotment` inside a pane to build more complex layouts, such as an editor with a sidebar and a panel underneath.

```tsx live
<div style={{ height: 400 }}>
  <Allotment>
    <Allotment.Pane preferredSize={200} minSize={120} maxSize={400}>
      <div className="demo-pane">Sidebar</div>
    </Allotment.Pane>
    <Allotment.Pane>
      <Allotment vertical>
        <Allotment.Pane>
          <div className="demo-pane">Editor</div>
        </Allotment.Pane>
        <Allotment.Pane preferredSize={120} minSize={60} snap>
          <div className="demo-pane">Panel</div>
        </Allotment.Pane>
      </Allotment>
    </Allotment.Pane>
  </Allotment>
</div>
```

The panel has `snap` set, so dragging it below half its minimum size collapses it. Drag the edge back up to restore it.

[Open in Storybook](https://allotment-storybook.netlify.app/?path=/story/basic--nested)
