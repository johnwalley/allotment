import type { AllotmentHandle } from "allotment";
import { Allotment, LayoutPriority, setSashSize } from "allotment";
import "allotment/dist/style.css";

import Link from "@docusaurus/Link";
import CodeBlock from "@theme/CodeBlock";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

import styles from "./playground.module.css";

type Priority = "Normal" | "Low" | "High";

type PaneConfig = {
  id: string;
  minSize: string;
  maxSize: string;
  preferredSize: string;
  snap: boolean;
  visible: boolean;
  priority: Priority;
};

type Config = {
  vertical: boolean;
  separator: boolean;
  proportionalLayout: boolean;
  snap: boolean;
  minSize: string;
  maxSize: string;
  sashSize: number;
  panes: PaneConfig[];
};

type LogEntry = { id: number; text: string };

const DEFAULT_SASH_SIZE = 8;
const MAX_PANES = 5;
const MAX_LOG_ENTRIES = 8;
const PANE_IDS = ["A", "B", "C", "D", "E"];

const PRIORITIES: Record<Priority, LayoutPriority> = {
  Normal: LayoutPriority.Normal,
  Low: LayoutPriority.Low,
  High: LayoutPriority.High,
};

function createPane(id: string): PaneConfig {
  return {
    id,
    minSize: "",
    maxSize: "",
    preferredSize: "",
    snap: false,
    visible: true,
    priority: "Normal",
  };
}

const DEFAULT_CONFIG: Config = {
  vertical: false,
  separator: true,
  proportionalLayout: true,
  snap: false,
  minSize: "",
  maxSize: "",
  sashSize: DEFAULT_SASH_SIZE,
  panes: [createPane("A"), createPane("B"), createPane("C")],
};

// Empty inputs mean "use the default", so leave the prop out
function toNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

// Accepts 200, "200px" or "25%", the same as the preferredSize prop
function toPreferredSize(value: string): number | string | undefined {
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  if (/^\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (/^\d+(\.\d+)?(px|%)$/.test(trimmed)) return trimmed;
  return undefined;
}

function jsxProps(props: [string, string | number | boolean | undefined][]) {
  return props.flatMap(([name, value]) => {
    if (value === undefined) return [];
    if (value === true) return [name];
    if (typeof value === "string" && !value.startsWith("LayoutPriority")) {
      return [`${name}="${value}"`];
    }
    return [`${name}={${value}}`];
  });
}

function openingTag(name: string, props: string[], indent: string) {
  const inline = `<${name}${props.map((prop) => ` ${prop}`).join("")}>`;
  if (indent.length + inline.length <= 72) return `${indent}${inline}`;
  return [
    `${indent}<${name}`,
    ...props.map((prop) => `${indent}  ${prop}`),
    `${indent}>`,
  ].join("\n");
}

function generateCode(config: Config): string {
  const usesPriority =
    !config.proportionalLayout &&
    config.panes.some((pane) => pane.priority !== "Normal");
  const usesSashSize = config.sashSize !== DEFAULT_SASH_SIZE;

  const imports = ["Allotment"];
  if (usesPriority) imports.push("LayoutPriority");
  if (usesSashSize) imports.push("setSashSize");

  const allotmentProps = jsxProps([
    ["vertical", config.vertical || undefined],
    ["separator", config.separator ? undefined : false],
    ["proportionalLayout", config.proportionalLayout ? undefined : false],
    ["snap", config.snap || undefined],
    ["minSize", toNumber(config.minSize)],
    ["maxSize", toNumber(config.maxSize)],
  ]);

  const panes = config.panes.map((pane) => {
    const content = `<div>Pane ${pane.id}</div>`;
    const paneProps = jsxProps([
      ["minSize", toNumber(pane.minSize)],
      ["maxSize", toNumber(pane.maxSize)],
      ["preferredSize", toPreferredSize(pane.preferredSize)],
      ["snap", (!config.snap && pane.snap) || undefined],
      [
        "priority",
        !config.proportionalLayout && pane.priority !== "Normal"
          ? `LayoutPriority.${pane.priority}`
          : undefined,
      ],
      ["visible", pane.visible ? undefined : false],
    ]);

    if (paneProps.length === 0) return `      ${content}`;

    return [
      openingTag("Allotment.Pane", paneProps, "      "),
      `        ${content}`,
      "      </Allotment.Pane>",
    ].join("\n");
  });

  return [
    `import { ${imports.join(", ")} } from "allotment";`,
    `import "allotment/dist/style.css";`,
    "",
    ...(usesSashSize
      ? [
          "// Applies to every Allotment on the page",
          `setSashSize(${config.sashSize});`,
          "",
        ]
      : []),
    "export const Layout = () => (",
    "  <div style={{ height: 400 }}>",
    openingTag("Allotment", allotmentProps, "    "),
    ...panes,
    "    </Allotment>",
    "  </div>",
    ");",
  ].join("\n");
}

function Checkbox({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: React.ReactNode;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={clsx(styles.checkbox, disabled && styles.disabled)}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

function TextField({
  label,
  value,
  placeholder,
  invalid,
  onChange,
}: {
  label: React.ReactNode;
  value: string;
  placeholder: string;
  invalid?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        type="text"
        inputMode="numeric"
        className={clsx(invalid && styles.invalid)}
        value={value}
        placeholder={placeholder}
        aria-invalid={invalid}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export default function Playground(): JSX.Element {
  const ref = useRef<AllotmentHandle>(null);
  const nextLogId = useRef(0);
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [sizes, setSizes] = useState<number[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);

  const update = (changes: Partial<Config>) =>
    setConfig((current) => ({ ...current, ...changes }));

  const updatePane = (index: number, changes: Partial<PaneConfig>) =>
    setConfig((current) => ({
      ...current,
      panes: current.panes.map((pane, i) =>
        i === index ? { ...pane, ...changes } : pane,
      ),
    }));

  const addLog = (text: string) =>
    setLog((current) =>
      [{ id: nextLogId.current++, text }, ...current].slice(0, MAX_LOG_ENTRIES),
    );

  const formatSizes = (values: number[]) =>
    `[${values.map((value) => Math.round(value)).join(", ")}]`;

  // setSashSize changes a global, so put it back when leaving the page
  useEffect(() => {
    setSashSize(config.sashSize);
  }, [config.sashSize]);

  useEffect(
    () => () => {
      setSashSize(DEFAULT_SASH_SIZE);
      document.documentElement.style.removeProperty("--sash-size");
      document.documentElement.style.removeProperty("--sash-hover-size");
    },
    [],
  );

  // Allotment reads most of these props when it mounts, so remount it when
  // any of them change. Visibility is left out because it updates live.
  const layoutKey = JSON.stringify({
    ...config,
    panes: config.panes.map(({ visible, ...pane }) => pane),
  });

  const unusedPaneId = PANE_IDS.find(
    (id) => !config.panes.some((pane) => pane.id === id),
  );

  return (
    <Layout
      title="Playground"
      description="Try out Allotment's props and copy the code for the layout you build."
    >
      <main className={clsx("container", styles.page)}>
        <header className={styles.header}>
          <h1>Playground</h1>
          <p>
            Change the props, drag the sashes, then copy the code. See the{" "}
            <Link to="/docs/allotment">API reference</Link> for what each prop
            does.
          </p>
        </header>

        <div className={styles.layout}>
          <aside className={styles.controls} aria-label="Props">
            <section>
              <h2>Allotment</h2>
              <Checkbox
                label={<code>vertical</code>}
                checked={config.vertical}
                onChange={(vertical) => update({ vertical })}
              />
              <Checkbox
                label={<code>separator</code>}
                checked={config.separator}
                onChange={(separator) => update({ separator })}
              />
              <Checkbox
                label={<code>proportionalLayout</code>}
                checked={config.proportionalLayout}
                onChange={(proportionalLayout) =>
                  update({ proportionalLayout })
                }
              />
              <Checkbox
                label={<code>snap</code>}
                checked={config.snap}
                onChange={(snap) => update({ snap })}
              />
              <div className={styles.fieldRow}>
                <TextField
                  label={<code>minSize</code>}
                  value={config.minSize}
                  placeholder="30"
                  invalid={
                    config.minSize !== "" &&
                    toNumber(config.minSize) === undefined
                  }
                  onChange={(minSize) => update({ minSize })}
                />
                <TextField
                  label={<code>maxSize</code>}
                  value={config.maxSize}
                  placeholder="Infinity"
                  invalid={
                    config.maxSize !== "" &&
                    toNumber(config.maxSize) === undefined
                  }
                  onChange={(maxSize) => update({ maxSize })}
                />
              </div>
              <label className={styles.field}>
                <span>
                  <code>setSashSize</code> ({config.sashSize}px)
                </span>
                <input
                  type="range"
                  min={4}
                  max={20}
                  value={config.sashSize}
                  onChange={(event) =>
                    update({ sashSize: Number(event.target.value) })
                  }
                />
              </label>
            </section>

            {config.panes.map((pane, index) => (
              <section key={pane.id}>
                <div className={styles.paneHeading}>
                  <h2>Pane {pane.id}</h2>
                  <button
                    type="button"
                    className="button button--sm button--link"
                    disabled={config.panes.length <= 2}
                    onClick={() =>
                      update({
                        panes: config.panes.filter((_, i) => i !== index),
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
                <Checkbox
                  label={<code>visible</code>}
                  checked={pane.visible}
                  onChange={(visible) => updatePane(index, { visible })}
                />
                <Checkbox
                  label={<code>snap</code>}
                  checked={config.snap || pane.snap}
                  disabled={config.snap}
                  onChange={(snap) => updatePane(index, { snap })}
                />
                <div className={styles.fieldRow}>
                  <TextField
                    label={<code>minSize</code>}
                    value={pane.minSize}
                    placeholder={config.minSize || "30"}
                    invalid={
                      pane.minSize !== "" &&
                      toNumber(pane.minSize) === undefined
                    }
                    onChange={(minSize) => updatePane(index, { minSize })}
                  />
                  <TextField
                    label={<code>maxSize</code>}
                    value={pane.maxSize}
                    placeholder={config.maxSize || "Infinity"}
                    invalid={
                      pane.maxSize !== "" &&
                      toNumber(pane.maxSize) === undefined
                    }
                    onChange={(maxSize) => updatePane(index, { maxSize })}
                  />
                </div>
                <div className={styles.fieldRow}>
                  <TextField
                    label={<code>preferredSize</code>}
                    value={pane.preferredSize}
                    placeholder="200 or 25%"
                    invalid={
                      pane.preferredSize !== "" &&
                      toPreferredSize(pane.preferredSize) === undefined
                    }
                    onChange={(preferredSize) =>
                      updatePane(index, { preferredSize })
                    }
                  />
                  <label
                    className={clsx(
                      styles.field,
                      config.proportionalLayout && styles.disabled,
                    )}
                    title={
                      config.proportionalLayout
                        ? "Only used when proportionalLayout is off"
                        : undefined
                    }
                  >
                    <span>
                      <code>priority</code>
                    </span>
                    <select
                      value={pane.priority}
                      disabled={config.proportionalLayout}
                      onChange={(event) =>
                        updatePane(index, {
                          priority: event.target.value as Priority,
                        })
                      }
                    >
                      {Object.keys(PRIORITIES).map((priority) => (
                        <option key={priority}>{priority}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>
            ))}

            <div className={styles.controlActions}>
              <button
                type="button"
                className="button button--sm button--secondary"
                disabled={!unusedPaneId}
                onClick={() =>
                  unusedPaneId &&
                  update({ panes: [...config.panes, createPane(unusedPaneId)] })
                }
              >
                Add pane
              </button>
              <button
                type="button"
                className="button button--sm button--outline button--secondary"
                onClick={() => {
                  setConfig(DEFAULT_CONFIG);
                  setLog([]);
                }}
              >
                Start over
              </button>
            </div>
          </aside>

          <div className={styles.output}>
            <div className={styles.preview}>
              <Allotment
                key={layoutKey}
                ref={ref}
                vertical={config.vertical}
                separator={config.separator}
                proportionalLayout={config.proportionalLayout}
                snap={config.snap}
                minSize={toNumber(config.minSize)}
                maxSize={toNumber(config.maxSize)}
                onChange={setSizes}
                onDragStart={(values) =>
                  addLog(`onDragStart ${formatSizes(values)}`)
                }
                onDragEnd={(values) =>
                  addLog(`onDragEnd ${formatSizes(values)}`)
                }
                onVisibleChange={(index, visible) => {
                  addLog(`onVisibleChange ${index}, ${visible}`);
                  updatePane(index, { visible });
                }}
              >
                {config.panes.map((pane, index) => (
                  <Allotment.Pane
                    key={pane.id}
                    minSize={toNumber(pane.minSize)}
                    maxSize={toNumber(pane.maxSize)}
                    preferredSize={toPreferredSize(pane.preferredSize)}
                    snap={config.snap || pane.snap || undefined}
                    priority={PRIORITIES[pane.priority]}
                    visible={pane.visible}
                  >
                    <div className="demo-pane">
                      <strong>Pane {pane.id}</strong>
                      {sizes[index] !== undefined && (
                        <span>{Math.round(sizes[index])}px</span>
                      )}
                    </div>
                  </Allotment.Pane>
                ))}
              </Allotment>
            </div>

            <div className={styles.toolbar}>
              <span className={styles.sizes}>
                <code>onChange</code> {formatSizes(sizes)}
              </span>
              <button
                type="button"
                className="button button--sm button--secondary"
                onClick={() => ref.current?.reset()}
              >
                <code>ref.reset()</code>
              </button>
            </div>

            <div className={styles.log} aria-live="polite">
              <h2>Events</h2>
              {log.length === 0 ? (
                <p>Drag a sash or hide a pane to see events here.</p>
              ) : (
                <ol>
                  {log.map((entry) => (
                    <li key={entry.id}>
                      <code>{entry.text}</code>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <CodeBlock language="tsx" title="Layout.tsx">
              {generateCode(config)}
            </CodeBlock>
          </div>
        </div>
      </main>
    </Layout>
  );
}
