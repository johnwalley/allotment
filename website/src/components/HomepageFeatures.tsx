import Link from "@docusaurus/Link";
import clsx from "clsx";
import React from "react";

import styles from "./HomepageFeatures.module.css";

type FeatureItem = {
  title: string;
  icon: string;
  description: string;
  link?: { label: string; to: string };
};

const FeatureList: FeatureItem[] = [
  {
    title: "Derived from VS Code",
    icon: "vscode",
    description:
      "Built on the same split view code as VS Code, so dragging, snapping and double-click to reset feel the way people expect.",
  },
  {
    title: "Declarative",
    icon: "layers",
    description:
      "Add, remove and hide panes by changing your React children. Allotment works out the new sizes.",
    link: { label: "Closable panes", to: "/docs/closable" },
  },
  {
    title: "Size constraints",
    icon: "symbol-ruler",
    description:
      "Set minimum, maximum and preferred sizes per pane, fix a pane's size, or let it snap closed.",
    link: { label: "Sizing", to: "/docs/sizing" },
  },
  {
    title: "Nested layouts",
    icon: "split-horizontal",
    description:
      "Put one Allotment inside another to build editor-style layouts with sidebars and panels.",
    link: { label: "Nested", to: "/docs/nested" },
  },
  {
    title: "TypeScript",
    icon: "code",
    description:
      "Written in TypeScript and ships its own types, including the ref handle for resizing from code.",
    link: { label: "API reference", to: "/docs/allotment" },
  },
  {
    title: "Easy to style",
    icon: "symbol-color",
    description:
      "Change colours and sash sizes with CSS variables, or target the component's class names.",
    link: { label: "Styling", to: "/docs/styling" },
  },
];

function Feature({ title, icon, description, link }: FeatureItem) {
  return (
    <div className={clsx("col col--4", styles.feature)}>
      <span
        className={clsx("codicon", `codicon-${icon}`, styles.icon)}
        aria-hidden="true"
      />
      <h3>{title}</h3>
      <p>{description}</p>
      {link && <Link to={link.to}>{link.label} →</Link>}
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props) => (
            <Feature key={props.title} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
