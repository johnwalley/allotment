[![CI status](https://github.com/johnwalley/allotment/actions/workflows/build.yml/badge.svg)](https://github.com/johnwalley/allotment/actions/workflows/build.yml)
[![GitHub license](https://img.shields.io/npm/l/allotment?style=plastic)](https://github.com/johnwalley/allotment/blob/main/LICENSE)
[![NPM](https://img.shields.io/npm/v/allotment?style=plastic&color=green)](https://npmjs.com/package/allotment/)
[![Netlify Status](https://img.shields.io/netlify/17b280b3-d81d-4576-a58d-b7ccc2e66d7c?color=green&style=plastic)](https://allotment-storybook.netlify.app/)

<p align="center">
    <a href="https://github.com/johnwalley/allotment">
    <img src="./assets/logo.svg" alt="Logo" height="120">
  </a>
  
  <h3 align="center">Allotment</h3>

  <p align="center">
    React split-pane component.
  </p>

  <p align="center">
    <a href="https://allotment.mulberryhousesoftware.com/">Docs</a>
    ·
    <a href="https://allotment-storybook.netlify.app/">Examples</a>
    ·
    <a href="./CHANGELOG.md">Changelog</a>
  </p>
  
  <p align="center">
    <img align="center" src="https://user-images.githubusercontent.com/981531/161631194-1e24ea10-f46a-42db-bfdb-89bcfa3fc50b.gif" />
  </p>
</p>

- **React-based:** Integrate effortlessly into your existing React-based application.
- **Industry standard look and feel:** Like VS Code's split view implementation? You're in luck! This component is derived from the same codebase.
- **Dynamic:** Want to declaratively add and remove panes? We've got you covered.

## Quick start

```sh
npm install allotment
```

Allotment requires React 17, 18 or 19 (`react` and `react-dom` are peer dependencies).

```jsx
import { Allotment } from "allotment";
import "allotment/dist/style.css";

export const App = () => (
  <div style={{ height: 400 }}>
    <Allotment>
      <div>Pane A</div>
      <div>Pane B</div>
    </Allotment>
  </div>
);
```

Allotment fills its parent element, so make sure the parent has a height. See the [FAQ](#its-not-workingi-dont-see-anything) if nothing is showing.

## Usage

If you want more control over the behaviour of the individual panes you can use the `Allotment.Pane` component. This includes setting the minimum and maximum size of a pane, as well as whether to enable snapping behaviour.

```jsx
<Allotment>
  <Allotment.Pane minSize={200}>
    <ComponentA />
  </Allotment.Pane>
  <Allotment.Pane snap>
    <ComponentB />
  </Allotment.Pane>
</Allotment>
```

## Allotment props

All properties are optional.

### className

Sets a class name on the outer element.

### defaultSizes

An array of initial sizes of the panes. If the sum of the sizes differs from the size of the container then the panes' sizes will be scaled proportionally.

```jsx
<Allotment defaultSizes={[100, 200]}>
  <div />
  <div />
</Allotment>
```

### id

The id to set on the outer element.

### maxSize (default: `Infinity`)

Maximum size of any pane.

### minSize (default: `30`)

Minimum size of any pane.

### proportionalLayout (default: `true`)

Resize each view proportionally when resizing container.

### separator (default: `true`)

Whether to render a separator between panes.

### sizes

**Deprecated.** Use `defaultSizes` instead.

### snap (default: `false`)

Enable snap to zero for all panes.

### vertical (default: `false`)

Direction to split. If true then the panes will be stacked vertically, otherwise they will be stacked horizontally.

### onChange

Callback that is fired when the pane sizes change (usually on drag). Recommended to add a debounce function to rate limit the callback. Passed an array of numbers.

### onDragStart

Callback that is fired when the user starts dragging a sash. Passed an array of the current pane sizes.

### onDragEnd

Callback that is fired when the user stops dragging a sash. Passed an array of the current pane sizes.

### onReset

Callback that is fired whenever the user double clicks a sash.

### onVisibleChange

Callback that is fired whenever the user changes the visibility of a pane by snapping. Passed the index of the pane and its new visibility. Note that this will only be called if the new value is different from the current `visible` prop on the Pane.

## Allotment.Pane props

### className

Sets a class name on the pane element.

### maxSize

Maximum size of this pane. Overrides `maxSize` set on parent component.

### minSize

Minimum size of this pane. Overrides `minSize` set on parent component.

### priority

The priority of the pane when the layout algorithm runs. Panes with higher priority will be resized first. One of `LayoutPriority.Low`, `LayoutPriority.Normal` (default) or `LayoutPriority.High`.

Only used when `proportionalLayout` is false.

```jsx
import { Allotment, LayoutPriority } from "allotment";

<Allotment proportionalLayout={false}>
  <Allotment.Pane priority={LayoutPriority.High}>
    <ComponentA />
  </Allotment.Pane>
  <Allotment.Pane>
    <ComponentB />
  </Allotment.Pane>
</Allotment>;
```

### preferredSize

Preferred size of this pane. Allotment will attempt to use this size when adding this pane (including on initial mount) as well as when a user double clicks a sash, or the `reset` method is called on the Allotment instance.

The size can either be a number or a string. If it is a number it will be interpreted as a number of pixels. If it is a string it should end in either "px" or "%". If it ends in "px" it will be interpreted as a number of pixels, e.g. "120px". If it ends in "%" it will be interpreted as a percentage of the size of the Allotment component, e.g. "50%".

### snap

Enable snap to zero for this pane. Overrides `snap` set on parent component.

### visible

Whether the pane should be visible.

## Styling

Allotment uses [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) for styling. See [How do I style the component?](#how-do-i-style-the-component) for the full list of variables and class names.

```css
:root {
  --focus-border: #007fd4;
  --separator-border: rgba(128, 128, 128, 0.35);
}
```

To control the size of the draggable area between panes you can call the exported `setSashSize` function with the desired size in pixels (clamped between 4 and 20). Set it to a larger value if you find it hard to resize the panes using the mouse. On touch devices the draggable area is always set to 20 pixels.

### Programmatic control

You can use a ref to get access to the Allotment component instance and call its `reset` and `resize` methods manually:

```tsx
import { Allotment, AllotmentHandle } from "allotment";

const ref = React.useRef<AllotmentHandle>(null);

return (
  <div>
    <button
      onClick={() => {
        ref.current?.reset();
      }}
    >
      Reset
    </button>
    <button
      onClick={() => {
        ref.current?.resize([100, 200]);
      }}
    >
      Resize
    </button>
    <Allotment ref={ref}>
      <div />
      <div />
    </Allotment>
  </div>
);
```

## Frequently asked questions

### It's not working/I don't see anything

The Allotment component takes its width and height from the element which contains it. It does not come with an explicit width or height out of the box. It's easy to end up with a div of height zero by accident. For example, adding allotment to a brand new Create React App project without setting a height on a containing div won't work because the default root div itself has no height.

You should also check that the css has been imported/included, for example at the root of your application:

```jsx
import "allotment/dist/style.css";
```

### My content is larger than the containing pane. How can I let the user scroll?

The simplest approach is to place your content inside a new div with width and height `100%` and overflow `auto`. This div will have the same dimensions as the pane it's inside and if its content overflows the browser will provide scrolling behaviour.

### Next.js

Allotment currently only works in a browser. When using the App Router, render it from a Client Component (a file starting with `"use client"`). If you still get an error during server rendering, [skip SSR for the component](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#skipping-ssr) with `next/dynamic`:

```jsx
"use client";

import dynamic from "next/dynamic";

const Allotment = dynamic(
  () => import("allotment").then((mod) => mod.Allotment),
  { ssr: false },
);
```

Note that `Allotment.Pane` is not available on a dynamically imported component, so move any code using it into a separate client-only component. It might be possible to produce sensible results server-side in the future so create an issue requesting this if interested.

### How do I prevent a pane from being resized?

Set `minSize` and `maxSize` props to the same value.

### How do I style the component?

Some common style changes can be made by setting CSS variables.

These include:

| Name                               | Default                     | Description                                     |
| :--------------------------------- | :-------------------------- | :---------------------------------------------- |
| `--focus-border`                   | `#007fd4`                   | Color of the sash when hovered                  |
| `--separator-border`               | `rgba(128, 128, 128, 0.35)` | Color of the separator                          |
| `--sash-size`                      | `8px`                       | Size of the draggable area between panes        |
| `--sash-hover-size`                | `4px`                       | Size of the highlighted sash when hovered       |
| `--sash-hover-transition-duration` | `0.1s`                      | Duration of the sash hover highlight transition |

For more involved styling you can target the component's child elements.

| Class                          | Description                                                     |
| :----------------------------- | :-------------------------------------------------------------- |
| `.split-view`                  | Styles applied to the top-level container                       |
| `.split-view-horizontal`       | Styles applied to the top-level container if `vertical={false}` |
| `.split-view-vertical`         | Styles applied to the top-level container if `vertical={true}`  |
| `.split-view-separator-border` | Styles applied to the top-level container if `separator={true}` |
| `.split-view-sash-dragging`    | Styles applied to the top-level container if sash is dragging   |
| `.sash-container`              | Styles applied to the sash container                            |
| `.sash`                        | Styles applied to the sash                                      |
| `.sash-active`                 | Styles applied to the sash if being dragged                     |
| `.sash-disabled`               | Styles applied to the sash if disabled                          |
| `.sash-horizontal`             | Styles applied to the sash if `vertical={false}`                |
| `.sash-hover`                  | Styles applied to the sash if being hovered over                |
| `.sash-mac`                    | Styles applied to the sash if running under macos               |
| `.sash-maximum`                | Styles applied to the sash if the pane is maximised             |
| `.sash-minimum`                | Styles applied to the sash if the pane is minimised             |
| `.sash-vertical`               | Styles applied to the sash if `vertical={true}`                 |
| `.split-view-container`        | Styles applied to the split view container                      |
| `.split-view-view`             | Styles applied to the split view view                           |
| `.split-view-view-visible`     | Styles applied to the split view view if `visible={true}`       |
