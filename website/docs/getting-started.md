---
id: getting-started
title: Getting Started
---

Allotment is available as an [npm package](https://www.npmjs.com/package/allotment).

## Installation

To install and save in your package.json dependencies, run:

```bash npm2yarn
npm install allotment
```

Please note that `react` and `react-dom` are peer dependencies. Allotment supports React 17, 18 and 19.

## Usage

### Quick start

Here's a quick example to get you started:

```tsx
import { Allotment } from "allotment";
import "allotment/dist/style.css";

export function App() {
  return (
    <div style={{ height: 400 }}>
      <Allotment>
        <div>Pane 1</div>
        <div>Pane 2</div>
      </Allotment>
    </div>
  );
}
```

:::caution

Remember to import the required css: `import "allotment/dist/style.css"`

Allotment takes its size from its parent element, so make sure the parent has a height. See the [FAQ](faq.md#its-not-workingi-dont-see-anything) if nothing is showing.

:::

## Control over individual panes

If you want more control over the behaviour of the individual panes you can use the `Allotment.Pane` component. This includes setting the minimum and maximum size of a pane, as well as whether to enable snapping behaviour.

```tsx
import { Allotment } from "allotment";
import "allotment/dist/style.css";

export function App() {
  return (
    <div style={{ height: 400 }}>
      <Allotment>
        <Allotment.Pane minSize={200}>
          <div>Pane 1</div>
        </Allotment.Pane>
        <Allotment.Pane snap>
          <div>Pane 2</div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
```
