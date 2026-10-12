export type FileIcon =
  | "react"
  | "typescript"
  | "css"
  | "json"
  | "npm"
  | "tsconfig"
  | "markdown"
  | "license"
  | "git";

export type OutlineSymbol = {
  name: string;
  kind:
    | "function"
    | "variable"
    | "class"
    | "property"
    | "key"
    | "module"
    | "string";
  depth?: number;
};

// VS Code's default symbol icon colours
export const SYMBOL_COLORS: Record<OutlineSymbol["kind"], string> = {
  function: "#b180d7",
  variable: "#75beff",
  class: "#ee9d28",
  property: "#bfbfbf",
  key: "#bfbfbf",
  module: "#bfbfbf",
  string: "#bfbfbf",
};

export interface Document {
  title: string;
  folder?: string;
  icon: FileIcon;
  /** Prism language used to highlight the file, or undefined for plain text */
  language?: string;
  /** Shown in the status bar, as VS Code's language mode */
  languageName: string;
  code: string;
  outline: OutlineSymbol[];
}

const APP_TSX = `import { Allotment } from "allotment";
import "allotment/dist/style.css";

import { Editor } from "./editor";
import { Sidebar } from "./sidebar";
import { Terminal } from "./terminal";

export const App = () => {
  return (
    <div className="container">
      <Allotment defaultSizes={[100, 300]}>
        <Allotment.Pane minSize={170} snap>
          <Sidebar />
        </Allotment.Pane>
        <Allotment vertical>
          <Editor />
          <Allotment.Pane preferredSize="35%">
            <Terminal />
          </Allotment.Pane>
        </Allotment>
      </Allotment>
    </div>
  );
};
`;

const APP_CSS = `.container {
  height: 100vh;
  width: 100%;
}

:root {
  /* Highlight the sash while it is dragged */
  --focus-border: #3994bc;
  --separator-border: #2a2b2c;
  --sash-hover-size: 4px;
}

.pane {
  display: flex;
  overflow: auto;
}
`;

const MAIN_TSX = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`;

const PACKAGE_JSON = `{
  "name": "my-app",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "allotment": "^1.20.6",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  }
}
`;

const TSCONFIG_JSON = `{
  "compilerOptions": {
    "target": "ES2022",
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true
  },
  "include": ["src"]
}
`;

const README_MD = `# my-app

A resizable layout built with [Allotment](https://allotment.mulberryhousesoftware.com).

## Getting started

\`\`\`sh
npm install
npm run dev
\`\`\`

Drag the sashes between panes to resize them.
`;

const LICENSE = `MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction.
`;

const GITIGNORE = `node_modules
dist
.DS_Store
`;

export const DOCUMENTS: Document[] = [
  {
    title: "app.tsx",
    folder: "src",
    icon: "react",
    language: "tsx",
    languageName: "TypeScript JSX",
    code: APP_TSX,
    outline: [{ name: "App", kind: "function" }],
  },
  {
    title: "app.module.css",
    folder: "src",
    icon: "css",
    language: "css",
    languageName: "CSS",
    code: APP_CSS,
    outline: [
      { name: ".container", kind: "class" },
      { name: ":root", kind: "class" },
      { name: ".pane", kind: "class" },
    ],
  },
  {
    title: "main.tsx",
    folder: "src",
    icon: "react",
    language: "tsx",
    languageName: "TypeScript JSX",
    code: MAIN_TSX,
    outline: [],
  },
  {
    title: ".gitignore",
    icon: "git",
    languageName: "Ignore",
    code: GITIGNORE,
    outline: [],
  },
  {
    title: "LICENSE",
    icon: "license",
    languageName: "Plain Text",
    code: LICENSE,
    outline: [],
  },
  {
    title: "package.json",
    icon: "npm",
    language: "json",
    languageName: "JSON",
    code: PACKAGE_JSON,
    outline: [
      { name: "name", kind: "key" },
      { name: "private", kind: "key" },
      { name: "scripts", kind: "module" },
      { name: "dependencies", kind: "module" },
    ],
  },
  {
    title: "README.md",
    icon: "markdown",
    language: "markdown",
    languageName: "Markdown",
    code: README_MD,
    outline: [
      { name: "my-app", kind: "string" },
      { name: "Getting started", kind: "string", depth: 1 },
    ],
  },
  {
    title: "tsconfig.json",
    icon: "tsconfig",
    language: "json",
    languageName: "JSON with Comments",
    code: TSCONFIG_JSON,
    outline: [
      { name: "compilerOptions", kind: "module" },
      { name: "include", kind: "key" },
    ],
  },
];
