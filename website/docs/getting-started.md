---
id: getting-started
title: Getting started
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

Here it is running. Drag the line between the panes to resize them, or edit the code:

```tsx live
<div style={{ height: 200 }}>
  <Allotment>
    <div className="demo-pane">Pane 1</div>
    <div className="demo-pane">Pane 2</div>
  </Allotment>
</div>
```

:::caution

Remember to import the required css: `import "allotment/dist/style.css"`

Allotment takes its size from its parent element, so make sure the parent has a height. See the [FAQ](faq.md#its-not-workingi-dont-see-anything) if nothing is showing.

:::

## Next steps

- [Features](basic.md) shows what Allotment can do, with live examples: layout, sizing, snapping, nesting, adding and removing panes, visibility and resetting.
- [How-to guides](styling.md) cover styling, persisting sizes and server-side rendering.
- [API](overview.md) lists every prop and export.
