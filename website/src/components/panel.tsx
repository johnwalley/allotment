import React from "react";

import "@xterm/xterm/css/xterm.css";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

import styles from "./panel.module.css";

const TABS = ["Problems", "Output", "Debug Console", "Terminal", "Ports"];
const TERMINAL = TABS.indexOf("Terminal");

const MESSAGES: Record<string, string> = {
  Problems: "No problems have been detected in the workspace.",
  Output: "",
  "Debug Console": "",
  Ports:
    "No forwarded ports. Forward a port to access your running services locally.",
};

export type PanelProps = {
  maximized: boolean;
  onClose: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
};

export const Panel = ({
  maximized,
  onClose,
  onMaximize,
  onMinimize,
}: PanelProps) => {
  const ref = useRef(null!);
  const [activeTab, setActiveTab] = useState(TERMINAL);

  useEffect(() => {
    const term = new Terminal({
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 12,
      theme: {
        background: "#191a1b",
        foreground: "#bfbfbf",
        cursor: "#bfbfbf",
        selectionBackground: "#3994bc33",
      },
    });

    const fitAddon = new FitAddon();

    term.loadAddon(fitAddon);

    term.open(ref.current);

    const prompt = () => {
      term.write("\r\n\x1b[1mmy-app\x1b[0m % ");
    };

    let started = false;

    // Wait until Allotment has given the terminal its real width, or the
    // prompt wraps
    const start = () => {
      fitAddon.fit();

      if (!started && term.cols > 20) {
        started = true;

        term.writeln("Welcome to allotment");
        term.writeln(
          "This is a local terminal emulation, without a real terminal in the back-end.",
        );
        term.writeln("Type some keys and commands to play around.");
        prompt();
      }
    };

    start();

    term.onKey((e: { key: string; domEvent: KeyboardEvent }) => {
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

      if (ev.keyCode === 13) {
        prompt();
      } else if (ev.keyCode === 8) {
        // Do not delete the prompt
        /*         if (term._core.buffer.x > 2) {
          term.write("\b \b");
        } */
      } else if (printable) {
        term.write(e.key);
      }
    });

    // The pane's size isn't final until Allotment has laid it out, so refit
    // whenever it changes.
    const resizeObserver = new ResizeObserver(start);

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
      term.dispose();
    };
  }, []);

  return (
    <div className={styles.panel}>
      <div className={styles.title}>
        <ul className={styles.tabs} role="tablist">
          {TABS.map((tab, index) => (
            <li
              key={tab}
              className={clsx(styles.tab, {
                [styles.checked]: index === activeTab,
              })}
              role="tab"
              aria-selected={index === activeTab}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          {activeTab === TERMINAL && (
            <>
              <a
                className="codicon codicon-add action-label"
                role="button"
                title="New Terminal (⌃⇧`)"
              />
              <a
                className="codicon codicon-split-horizontal action-label"
                role="button"
                title="Split Terminal (⌘\)"
              />
              <a
                className="codicon codicon-trash action-label"
                role="button"
                title="Kill Terminal"
              />
            </>
          )}
          <a
            className="codicon codicon-ellipsis action-label"
            role="button"
            title="Views and More Actions..."
          />
          <div className={styles.separator} />
          {maximized ? (
            <a
              className="codicon codicon-chevron-down action-label"
              role="button"
              title="Restore Panel Size"
              onClick={onMinimize}
            />
          ) : (
            <a
              className="codicon codicon-chevron-up action-label"
              role="button"
              title="Maximize Panel Size"
              onClick={onMaximize}
            />
          )}
          <a
            className="codicon codicon-close action-label"
            role="button"
            title="Hide Panel (⌘J)"
            onClick={onClose}
          />
        </div>
      </div>
      <div className={styles.content}>
        {/* Keep the terminal mounted so it doesn't lose its contents */}
        <div
          ref={ref}
          className={styles.terminalWrapper}
          hidden={activeTab !== TERMINAL}
        ></div>
        {activeTab !== TERMINAL && (
          <p className={styles.message}>{MESSAGES[TABS[activeTab]]}</p>
        )}
      </div>
    </div>
  );
};
