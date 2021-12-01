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

### Styling

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

## Frequently asked questions

### Next.js

If you get an error when importing allotment in a Next.js project consider [not including the module server-side](https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr). Allotment currently only works in a browser. It might be possible to produce sensible results server-side in the future so create an issue requesting this if interested.
