import Link from "@docusaurus/Link";
import clsx from "clsx";
import React, { useState } from "react";

import styles from "./HomepageProps.module.css";

type Prop = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

type PropGroup = {
  component: string;
  link: string;
  props: Prop[];
};

// A summary of docs/allotment.md and docs/pane.md, most commonly used first.
// Keep in sync when props change.
const GROUPS: PropGroup[] = [
  {
    component: "Allotment",
    link: "/docs/allotment",
    props: [
      {
        name: "vertical",
        type: "boolean",
        default: "false",
        description: "Stack panes vertically instead of horizontally.",
      },
      {
        name: "defaultSizes",
        type: "number[]",
        description: "Initial sizes of the panes, scaled to fit.",
      },
      {
        name: "minSize",
        type: "number",
        default: "30",
        description: "Minimum size of any pane.",
      },
      {
        name: "maxSize",
        type: "number",
        default: "Infinity",
        description: "Maximum size of any pane.",
      },
      {
        name: "snap",
        type: "boolean",
        default: "false",
        description: "Let every pane snap closed.",
      },
      {
        name: "onChange",
        type: "(sizes: number[]) => void",
        description: "Called when the pane sizes change.",
      },
      {
        name: "proportionalLayout",
        type: "boolean",
        default: "true",
        description: "Resize panes proportionally with the container.",
      },
      {
        name: "separator",
        type: "boolean",
        default: "true",
        description: "Render a separator between panes.",
      },
      {
        name: "onDragStart",
        type: "(sizes: number[]) => void",
        description: "Called when the user starts dragging a sash.",
      },
      {
        name: "onDragEnd",
        type: "(sizes: number[]) => void",
        description: "Called when the user stops dragging a sash.",
      },
      {
        name: "onReset",
        type: "() => void",
        description: "Called when the user double-clicks a sash.",
      },
      {
        name: "onVisibleChange",
        type: "(index: number, visible: boolean) => void",
        description: "Called when the user snaps a pane open or closed.",
      },
      {
        name: "className",
        type: "string",
        description: "Class name for the outer element.",
      },
      {
        name: "id",
        type: "string",
        description: "Id for the outer element.",
      },
    ],
  },
  {
    component: "Allotment.Pane",
    link: "/docs/pane",
    props: [
      {
        name: "minSize",
        type: "number",
        description: "Minimum size of this pane.",
      },
      {
        name: "maxSize",
        type: "number",
        description: "Maximum size of this pane.",
      },
      {
        name: "preferredSize",
        type: "number | string",
        description: 'Size on mount and reset, e.g. 120 or "50%".',
      },
      {
        name: "snap",
        type: "boolean",
        default: "false",
        description: "Let this pane snap closed.",
      },
      {
        name: "visible",
        type: "boolean",
        default: "true",
        description: "Whether this pane is shown.",
      },
      {
        name: "priority",
        type: "LayoutPriority",
        default: "Normal",
        description: "Which panes resize first when the layout changes.",
      },
      {
        name: "className",
        type: "string",
        description: "Class name for the pane element.",
      },
    ],
  },
];

const COLLAPSED_ROWS = 6;

function PropTable({
  group,
  expanded,
}: {
  group: PropGroup;
  expanded: boolean;
}) {
  const rows = expanded ? group.props : group.props.slice(0, COLLAPSED_ROWS);

  return (
    <div className={clsx("col col--6", styles.group)}>
      <h3>
        <code>{group.component}</code>
      </h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((prop) => (
              <tr key={prop.name}>
                <td>
                  <code>{prop.name}</code>
                  <div className={styles.type}>{prop.type}</div>
                </td>
                <td>{prop.default && <code>{prop.default}</code>}</td>
                <td>{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to={group.link}>Full {group.component} reference →</Link>
    </div>
  );
}

export default function HomepageProps(): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const hidden = GROUPS.reduce(
    (count, group) => count + Math.max(group.props.length - COLLAPSED_ROWS, 0),
    0,
  );

  return (
    <section className={styles.props}>
      <div className="container">
        <h2>Props at a glance</h2>
        <div className="row">
          {GROUPS.map((group) => (
            <PropTable
              key={group.component}
              group={group}
              expanded={expanded}
            />
          ))}
        </div>
        <button
          type="button"
          className={clsx("button button--secondary", styles.toggle)}
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          {expanded ? "Show fewer" : `Show all (${hidden} more)`}
        </button>
      </div>
    </section>
  );
}
