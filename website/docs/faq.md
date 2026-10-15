---
id: faq
title: FAQ
---

Below are some of the most frequently asked questions on how to use Allotment.

### It's not working/I don't see anything

Check two things:

- **The parent has a height.** Allotment fills the element that contains it and has no width or height of its own, so a parent with zero height shows nothing. This often happens with a root `div` that hasn't been given a height. See [Layout](basic.md).
- **The stylesheet is imported**, usually at the root of your app:

```jsx
import "allotment/dist/style.css";
```

### My content is larger than the containing pane. How can I let the user scroll?

Wrap the content in a `div` that fills the pane and has `overflow: auto`. See [Scrolling content](basic.md#scrolling-content) for an example.

### How do I use Allotment with Next.js?

Render it on the client only. See [Server rendering and Next.js](server-rendering.md).

### How do I prevent a pane from being resized?

Set `minSize` and `maxSize` to the same value. See [Fixed size](sizing.md#fixed-size).

### How do I keep a hidden pane hidden after a reload?

Save the pane's visibility in your own state and pass it back through the `visible` prop. See [What is remembered](visible.md#what-is-remembered).

### How do I let the user drag a pane closed?

Set `snap` on the pane, and give it a `minSize`. It snaps closed when it's dragged below half that size. See [Snapping](snapping.md).

### Why does a pane stay at its minimum size instead of following `defaultSizes`?

Minimum and maximum sizes always win. If the container is too small for every pane's `minSize`, the last panes are cut off. See [When the panes don't fit](sizing.md#when-the-panes-dont-fit), which also shows how to scroll instead.

### How do I add a gap between panes, or a handle to the sash?

Both can be done with CSS. See [Gaps between panes](styling.md#gaps-between-panes) and [Sash handles](styling.md#sash-handles).

### The panes flash at the wrong size when they first appear

Allotment measures its container before it sizes the panes, so for a frame the panes are only as wide as their content ([#820](https://github.com/johnwalley/allotment/issues/820)). Until that's fixed, you can hide the panes until they've been sized. Allotment sets an inline `style` on each pane when it lays them out, so this CSS hides them until then:

```css
.split-view-view:not([style]) {
  visibility: hidden;
}
```

## Known limitations

These are open issues. Follow the links for workarounds and progress.

- **Suspense.** Resizing can stop working after a component above Allotment suspends and resumes ([#849](https://github.com/johnwalley/allotment/issues/849)).
- **Preact.** Allotment is built for React and doesn't work correctly with `preact/compat` ([#689](https://github.com/johnwalley/allotment/issues/689)).
- **Other windows.** Resizing doesn't work properly when Allotment is rendered into a window opened with `window.open` ([#863](https://github.com/johnwalley/allotment/issues/863)).
- **Firefox clicks after a drag.** In Firefox, releasing the mouse over a button at the end of a drag also clicks that button ([#804](https://github.com/johnwalley/allotment/issues/804)). You can track drags with `onDragStart` and `onDragEnd` and ignore clicks in between.
- **First paint.** Panes appear at the wrong size for one frame when Allotment mounts ([#820](https://github.com/johnwalley/allotment/issues/820)). See [above](#the-panes-flash-at-the-wrong-size-when-they-first-appear) for a workaround.
- **Custom sash.** The sash can be styled with CSS, but you can't render your own component inside it ([#280](https://github.com/johnwalley/allotment/issues/280)).
- **Accessibility.** Sashes can't be focused or moved with the keyboard, and have no ARIA roles ([#639](https://github.com/johnwalley/allotment/issues/639)).
