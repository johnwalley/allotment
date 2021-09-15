<p align="center">
    <a href="https://github.com/johnwalley/banderole">
    <img src="./assets/logo.png" alt="Logo" width="640" height="120" style="image-rendering: pixelated;">
  </a>
  
  <h3 align="center">Banderole</h3>

  <p align="center">
    React split-pane component.
  </p>
</p>

- **React-based:** Integrate effortlessly into your existing React-based application.
- **Industry standard look and feel:** Like VS Code's split view implementation? You're in luck! This component is derived from the same codebase.
- **Dynamic:** Want to declaratively add and remove panes? We've got you covered.

## Getting Started

Banderole is available from npm.

### Prerequisites

Banderole has `react` and `react-dom` as peer dependencies.

```sh
yarn add react react-dom
```

### Installation

```sh
yarn add banderole
```

## Usage

```jsx
import React from "react";
import { Banderole } from "banderole";

export const App = () => (
  <Banderole>
    <ComponentA>
    <ComponentB>
  </Banderole>
);
```

### Passing a `ref` to a child

If you need to attach a ref to a child component then you must wrap it in a `Banderole.Pane` component.

```jsx
import React from "react";
import { Banderole } from "banderole";

export const App = () => {
  const ref = React.useRef<HTMLElement>(null);

  return (
    <Banderole>
      <Banderole.Pane>
        <ComponentA ref={ref}>
      </Banderole.Pane>
      <ComponentB>
    </Banderole>
  )
};
```

Under the hood the library needs to attach a ref to the immediate children. This overwrites any existing refs which will not be populated/called. This limitation may go away in a future release.
