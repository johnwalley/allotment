import { Highlight, PrismTheme } from "prism-react-renderer";
import React from "react";

import { Document } from "./documents";
import styles from "./code-view.module.css";

// Approximates the token colours of VS Code's "Dark 2026" theme
const DARK_2026: PrismTheme = {
  plain: { color: "#c9d1d9", backgroundColor: "transparent" },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "#8b949e" },
    },
    {
      types: ["keyword", "operator", "atrule"],
      style: { color: "#ff7b72" },
    },
    {
      types: ["string", "char", "attr-value", "url"],
      style: { color: "#a5d6ff" },
    },
    { types: ["function"], style: { color: "#d2a8ff" } },
    { types: ["tag", "selector"], style: { color: "#7ee787" } },
    {
      types: [
        "number",
        "boolean",
        "constant",
        "attr-name",
        "property",
        "variable",
      ],
      style: { color: "#79c0ff" },
    },
    { types: ["class-name", "maybe-class-name"], style: { color: "#ffa657" } },
    { types: ["punctuation"], style: { color: "#c9d1d9" } },
    { types: ["title"], style: { color: "#79c0ff", fontWeight: "bold" } },
  ],
};

export const CodeView = ({ document }: { document: Document }) => {
  return (
    <Highlight
      code={document.code.trimEnd()}
      language={document.language ?? "plain"}
      theme={DARK_2026}
    >
      {({ tokens, getLineProps, getTokenProps }) => (
        <div className={styles.codeView}>
          {tokens.map((line, index) => (
            <div key={index} className={styles.line}>
              <span className={styles.lineNumber}>{index + 1}</span>
              <span {...getLineProps({ line, className: styles.lineContent })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
        </div>
      )}
    </Highlight>
  );
};
