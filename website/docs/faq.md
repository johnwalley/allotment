---
id: faq
title: FAQ
---

Below are some of the most frequently asked questions on how to use Allotment.

### It's not working/I don't see anything

Check two things:

- **The parent has a height.** Allotment fills the element that contains it and has no width or height of its own, so a parent with zero height shows nothing. This often happens with a root `div` that hasn't been given a height. See [Basic](basic.md).
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
