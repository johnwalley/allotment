---
id: styling
title: Styling
---

# Styling

## CSS variables

Some common style changes can be made by setting CSS variables:

| Name                               | Default                     | Description                                                       |
| :--------------------------------- | :-------------------------- | :---------------------------------------------------------------- |
| `--focus-border`                   | `#007fd4`                   | Color of the sash when hovered                                    |
| `--separator-border`               | `rgba(128, 128, 128, 0.35)` | Color of the separator                                            |
| `--sash-hover-transition-duration` | `0.1s`                      | Length of time hover transition animation should take to complete |
| `--sash-size`                      | `8px`                       | Size of the draggable area between panes. See [below](#sash-size) |
| `--sash-hover-size`                | `4px`                       | Size of the highlighted sash when hovered                         |

The variables are inherited, so you can set them on any element that contains an `Allotment` to style just that one. Hover over the sash here to see the new colour.

```tsx live
<div
  style={
    {
      height: 300,
      "--focus-border": "#e5534b",
      "--separator-border": "#e5534b",
      "--sash-hover-size": "6px",
      "--sash-hover-transition-duration": "0.3s",
    } as React.CSSProperties
  }
>
  <Allotment>
    <div className="demo-pane">One</div>
    <div className="demo-pane">Two</div>
  </Allotment>
</div>
```

## Sash size

To control the size of the draggable area between panes, call the exported `setSashSize` function with the size in pixels. It's clamped between 4 and 20. Use a larger value if the panes are hard to resize with a mouse. On iOS and iPadOS Allotment sets it to 20 pixels.

```tsx
import { setSashSize } from "allotment";

setSashSize(12);
```

Allotment also uses the size when laying out the sashes, so set it with `setSashSize` rather than the `--sash-size` variable. It applies to every `Allotment` on the page. Move the slider, then hover over the sash. The highlight grows up to 8 pixels wide, and the area you can drag from keeps growing up to 20.

```tsx live
function SashSize() {
  const [size, setSize] = React.useState(() =>
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--sash-size",
      ),
    ),
  );

  React.useEffect(() => {
    const initial = size;

    // Put the size back when leaving the page, so other examples aren't affected
    return () => setSashSize(initial);
  }, []);

  return (
    <>
      <label className="margin-bottom--sm" style={{ display: "block" }}>
        Sash size: {size}px{" "}
        <input
          type="range"
          min={4}
          max={20}
          value={size}
          onChange={(event) => {
            const size = Number(event.target.value);
            setSize(size);
            setSashSize(size);
          }}
        />
      </label>
      <div style={{ height: 300 }}>
        <Allotment>
          <div className="demo-pane">One</div>
          <div className="demo-pane">Two</div>
        </Allotment>
      </div>
    </>
  );
}
```

## Class names

For more involved styling you can target the component's child elements.

| Class                          | Description                                                          |
| :----------------------------- | :------------------------------------------------------------------- |
| `.split-view`                  | Styles applied to the top-level container                            |
| `.split-view-horizontal`       | Styles applied to the top-level container if `vertical={false}`      |
| `.split-view-vertical`         | Styles applied to the top-level container if `vertical={true}`       |
| `.split-view-separator-border` | Styles applied to the top-level container if `separator={true}`      |
| `.split-view-sash-dragging`    | Styles applied to the top-level container if a sash is being dragged |
| `.sash-container`              | Styles applied to the sash container                                 |
| `.sash`                        | Styles applied to the sash                                           |
| `.sash-active`                 | Styles applied to the sash if being dragged                          |
| `.sash-disabled`               | Styles applied to the sash if disabled                               |
| `.sash-horizontal`             | Styles applied to the sash if `vertical={false}`                     |
| `.sash-hover`                  | Styles applied to the sash if being hovered over                     |
| `.sash-mac`                    | Styles applied to the sash if running under macOS                    |
| `.sash-maximum`                | Styles applied to the sash if the pane is maximised                  |
| `.sash-minimum`                | Styles applied to the sash if the pane is minimised                  |
| `.sash-vertical`               | Styles applied to the sash if `vertical={true}`                      |
| `.split-view-container`        | Styles applied to the split view container                           |
| `.split-view-view`             | Styles applied to the split view view                                |
| `.split-view-view-visible`     | Styles applied to the split view view if `visible={true}`            |

[Open in Storybook](https://allotment-storybook.netlify.app/?path=/story/basic--configure-sash)
