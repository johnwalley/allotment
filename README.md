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
    <img align="center" src="https://user-images.githubusercontent.com/981531/133465908-0f9c28e9-9da3-4faf-959e-ec36393acd0a.gif" />
  </p>
</p>

- **React-based:** Integrate effortlessly into your existing React-based application.
- **Industry standard look and feel:** Like VS Code's split view implementation? You're in luck! This component is derived from the same codebase.
- **Dynamic:** Want to declaratively add and remove panes? We've got you covered.

## Examples

You can find examples of using the library [here](https://allotment-storybook.netlify.app/).

## Getting Started

Allotment is available from npm.

### Prerequisites

Allotment has `react` and `react-dom` as peer dependencies.

```sh
yarn add react react-dom
```

### Installation

```sh
yarn add allotment
```

## Usage

```jsx
import React from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

export const App = () => (
  <Allotment>
    <ComponentA>
    <ComponentB>
  </Allotment>
);
```

If you want more control over the behaviour of the individual panes you can use the `Allotment.Pane` component. This includes setting the minimum and maximum size of a pane, as well as whether to enable snapping behaviour.

```jsx
<Allotment >
  <Allotment.Pane minSize={200}>
    <ComponentA>
  </Allotment.Pane>
  <Allotment.Pane snap>
    <ComponentB>
  </Allotment.Pane>
</Allotment>
```

## Allotment props

All properties are optional.

### defaultSizes

An array of initial sizes of the panes. If the sum of the sizes differs from the size of the container then the panes' sizes will be scaled proportionally.

```jsx
<Allotment defaultSizes={[100, 200]}>
  <div />
  <div />
</Allotment>
```

### maxSize (default: `Infinity`)

Maximum size of any pane.

### minSize (default: `30`)

Minimum size of any pane.

### snap (default: `false`)

Enable snap to zero for all panes.

### vertical (default: `false`)

Direction to split. If true then the panes will be stacked vertically, otherwise they will be stacked horizontally.

### onChange

Callback that is fired when the pane sizes change (usually on drag). Recommended to add a debounce function to rate limit the callback. Passed an array of numbers.

## Allotment.Pane props

### maxSize

Maximum size of this pane. Overrides `maxSize` set on parent component.

### minSize

Minimum size of this pane. Overrides `minSize` set on parent component.

### snap

Enable snap to zero for this pane. Overrides `snap` set on parent component.

## Styling

Allotment uses [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) for styling.
You can customize the following default variables.

```css
:root {
  --focus-border: #007fd4;
  --sash-size: 8px;
  --sash-hover-size: 4px;
  --separator-border: #838383;
}
```

### Programmatic control

You can use a ref to get access to the Allotment component instance and call its reset method manually:

```jsx
const ref = React.useRef(ref);

return (
  <div>
    <button
      onClick={() => {
        ref.current.reset();
      }}
    >
      Reset
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

### Next.js

If you get an error when importing allotment in a Next.js project consider [not including the module server-side](https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr). Allotment currently only works in a browser. It might be possible to produce sensible results server-side in the future so create an issue requesting this if interested.

See these issues for more discussion: [Example usage with Next.js](https://github.com/johnwalley/allotment/issues/81) and [SyntaxError: Cannot use import statement outside a module](https://github.com/johnwalley/allotment/issues/23).
