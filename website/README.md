# Website

The documentation site for Allotment, published at <https://allotment.mulberryhousesoftware.com>. It's built with [Docusaurus](https://docusaurus.io/).

- `docs/` holds the guides, API reference and examples.
- `src/pages/index.tsx` is the homepage. The VS Code-style demo on it lives in `src/components/`.
- `src/theme/ReactLiveScope` lists what live code blocks can use without importing it.

Live code blocks and the homepage demo use the published `allotment` package from npm, not the code in `../src`.

## Commands

```sh
npm install
npm start          # dev server with live reload
npm run build      # static build into build/
npm run typecheck
```

Changes here use `docs:` or `chore(website):` commit types, so they don't trigger a release. See [AGENTS.md](../AGENTS.md).
