---
id: visible
title: Visible
---

# Visible

Use the `visible` prop to show and hide a pane without removing it, so it keeps its size for when it comes back.

With `snap` enabled the user can also hide the pane by dragging it below half its minimum size. `onVisibleChange` tells you when that happens, so you can keep your state in sync.

```tsx live
function ToggleSidebar() {
  const [visible, setVisible] = React.useState(true);

  return (
    <>
      <button
        className="button button--secondary button--sm margin-bottom--sm"
        onClick={() => setVisible((visible) => !visible)}
      >
        {visible ? "Hide sidebar" : "Show sidebar"}
      </button>
      <div style={{ height: 300 }}>
        <Allotment
          snap
          onVisibleChange={(index, visible) => {
            if (index === 0) {
              setVisible(visible);
            }
          }}
        >
          <Allotment.Pane visible={visible} preferredSize={200} minSize={120}>
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

## Animating

Panes change size instantly by default. Add a CSS transition to the panes to animate showing and hiding them, and turn it off while the user is dragging so resizing still tracks the pointer:

```css
.animated-pane {
  transition: all 0.15s ease-in-out;
  will-change: width;
}

.split-view-sash-dragging .animated-pane {
  transition: none;
}
```

```tsx live
function AnimatedSidebar() {
  const [visible, setVisible] = React.useState(true);

  return (
    <>
      <button
        className="button button--secondary button--sm margin-bottom--sm"
        onClick={() => setVisible((visible) => !visible)}
      >
        {visible ? "Hide sidebar" : "Show sidebar"}
      </button>
      <div style={{ height: 300 }}>
        <Allotment
          snap
          onVisibleChange={(index, visible) => {
            if (index === 0) {
              setVisible(visible);
            }
          }}
        >
          <Allotment.Pane
            className="animated-pane"
            visible={visible}
            preferredSize={200}
            minSize={120}
          >
            <div className="demo-pane">Sidebar</div>
          </Allotment.Pane>
          <Allotment.Pane className="animated-pane">
            <div className="demo-pane">Main</div>
          </Allotment.Pane>
        </Allotment>
      </div>
    </>
  );
}
```

[Open in Storybook](https://allotment-storybook.netlify.app/?path=/story/basic--visible)
