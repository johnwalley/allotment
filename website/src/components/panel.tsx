import React from "react";

import "xterm/css/xterm.css";

import classNames from "classnames";
import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

import styles from "./panel.module.css";

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

  useEffect(() => {
    const term = new Terminal({
      fontSize: 11,
      theme: { background: "rgb(30,30,30)" },
    });

    const fitAddon = new FitAddon();

    term.loadAddon(fitAddon);

    term.open(ref.current);

    fitAddon.fit();

    const prompt = () => {
      term.write("\r\n$ ");
    };

    term.writeln("Welcome to allotment");
    term.writeln(
      "This is a local terminal emulation, without a real terminal in the back-end."
    );
    term.writeln("Type some keys and commands to play around.");
    term.writeln("");
    prompt();

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
  }, []);

  return (
    <div className={styles.panel}>
      <div className={styles.title}>
        <div className={styles.actionBar}>
          <ul className={styles.actionsContainer}>
            <li className={classNames(styles.actionItem, "checked")}>
              <a className={styles.actionLabel} style={{ background: "none" }}>
                Terminal
              </a>
              <div className={styles.activeItemIndicator} />
            </li>
          </ul>
        </div>
        <div>
          <ul className={styles.actionsContainer}>
            <li>
              {maximized ? (
                <a
                  className={classNames(
                    "codicon codicon-chevron-down",
                    styles.actionLabel
                  )}
                  role="button"
                  title="Minimize Panel Size"
                  onClick={onMinimize}
                />
              ) : (
                <a
                  className={classNames(
                    "codicon codicon-chevron-up",
                    styles.actionLabel
                  )}
                  role="button"
                  title="Maximize Panel Size"
                  onClick={onMaximize}
                />
              )}
            </li>
            <li>
              <a
                className={classNames(
                  "codicon codicon-close",
                  styles.actionLabel
                )}
                role="button"
                title="Close Panel"
                onClick={onClose}
              ></a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.content}>
        <div ref={ref} className={styles.terminalWrapper}></div>
      </div>
    </div>
  );
};
