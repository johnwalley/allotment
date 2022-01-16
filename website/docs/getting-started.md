---
id: getting-started
title: Getting Started
---

Allotment is available as an [npm package](https://www.npmjs.com/package/allotment).

## Installation

To install and save in your package.json dependencies, run:

```sh
// with npm
npm install allotment

// with yarn
yarn add allotment
```

Please note that react >= 17.0.0 and react-dom >= 17.0.0 are peer dependencies.

## Usage

### Quick start

Here's a quick example to get you started, it's literally all you need:

```tsx
import * as React from "react";
import ReactDOM from "react-dom";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

function App() {
  return (
    <Allotment>
      <div>Pane 1</div>
      <div>Pane 1</div>
    </Allotment>
  );
}

ReactDOM.render(<App />, document.querySelector("#app"));
```

:::caution

Remember to import the required css: `import "allotment/dist/style.css"`

:::

## Next steps
