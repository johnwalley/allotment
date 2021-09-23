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

export const App = () => (
  <Allotment>
    <ComponentA>
    <ComponentB>
  </Allotment>
);
```

### Passing a `ref` to a child

If you need to attach a ref to a child component then you must wrap it in a `Allotment.Pane` component.

```jsx
import React from "react";
import { Allotment } from "allotment";

export const App = () => {
  const ref = React.useRef<HTMLElement>(null);

  return (
    <Allotment>
      <Allotment.Pane>
        <ComponentA ref={ref}>
      </Allotment.Pane>
      <ComponentB>
    </Allotment>
  )
};
```

Under the hood the library needs to attach a ref to the immediate children. This overwrites any existing refs which will not be populated/called. This limitation may go away in a future release.
