---
id: server-rendering
title: Server rendering and Next.js
---

# Server rendering and Next.js

Allotment measures its container and creates DOM elements as it lays out the panes, so it only works in a browser. Frameworks that render on the server, such as Next.js, need to render it on the client only.

## Next.js App Router

Render Allotment from a Client Component, a file starting with `"use client"`. If you still get an error during server rendering, [skip SSR for the component](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#skipping-ssr) with `next/dynamic`:

```jsx
"use client";

import dynamic from "next/dynamic";

const Allotment = dynamic(
  () => import("allotment").then((mod) => mod.Allotment),
  { ssr: false },
);
```

`Allotment.Pane` is not available on a dynamically imported component. Instead, move the code that uses it into its own component and import that dynamically:

```jsx
// layout.jsx
import { Allotment } from "allotment";
import "allotment/dist/style.css";

export default function Layout() {
  return (
    <Allotment>
      <Allotment.Pane minSize={200}>Sidebar</Allotment.Pane>
      <Allotment.Pane>Main</Allotment.Pane>
    </Allotment>
  );
}
```

```jsx
// page.jsx
"use client";

import dynamic from "next/dynamic";

const Layout = dynamic(() => import("./layout"), { ssr: false });
```

## Other frameworks

The same approach works elsewhere: only render Allotment once the page is running in the browser, for example with your framework's client-only component or a lazy import.

Browser-only APIs that you use alongside Allotment need the same care. For example, read saved sizes from `localStorage` on the client, as described in [Persisting sizes](persist-sizes.md).

It might be possible to produce sensible results server-side in the future. [Open an issue](https://github.com/johnwalley/allotment/issues) if you're interested.
