import classNames from "classnames";
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import useResizeObserver from "use-resize-observer";

import styles from "./banderole.module.css";
import { Orientation } from "./sash";
import { Sizing, SplitView } from "./split-view/split-view";

export type PaneProps = {
  children: React.ReactNode;
};

export const Pane = forwardRef<HTMLDivElement, BanderoleProps>(
  ({ children }: PaneProps, ref) => {
    return (
      <div ref={ref} className={styles.pane}>
        {children}
      </div>
    );
  }
);

Pane.displayName = "Banderole.Pane";

export type BanderoleProps = {
  children: React.ReactNode;
  maxSize?: number;
  minSize?: number;
  snap?: boolean;
  vertical?: boolean;
};

const Banderole = forwardRef<HTMLElement, BanderoleProps>(
  (
    {
      children,
      maxSize = Infinity,
      minSize = 30,
      snap = false,
      vertical = false,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null!);
    const splitViewContainerRef = useRef<HTMLDivElement>(null!);
    const splitViewViewRef = useRef<Record<string, HTMLElement>>({});
    const viewRef = useRef<Record<string, HTMLElement>>({});

    const splitViewRef = useRef<SplitView | null>(null);

    const previousKeys = useRef<string[]>([]);

    const childrenArray = useMemo(
      () => React.Children.toArray(children).filter(React.isValidElement),
      [children]
    );

    useEffect(() => {
      splitViewRef.current = new SplitView(
        containerRef.current,
        splitViewContainerRef.current,
        {
          orientation: vertical ? Orientation.Vertical : Orientation.Horizontal,
        }
      );

      splitViewRef.current.on("sashreset", (_index: number) => {
        splitViewRef.current?.distributeViewSizes();
      });

      const that = splitViewRef.current;

      return () => {
        that.dispose();
      };
    }, [vertical]);

    /**
     * Add or remove views as number of children changes
     */
    useEffect(() => {
      const keys = childrenArray
        .filter(React.isValidElement)
        .map((child) => child.key as string);

      const enter = keys.filter((key) => !previousKeys.current.includes(key));
      const update = keys.filter((key) => previousKeys.current.includes(key));
      const exit = previousKeys.current.map((key) => !keys.includes(key));

      exit.forEach((flag, index) => {
        if (flag) {
          splitViewRef.current?.removeView(index);
        }
      });

      for (const key of enter) {
        splitViewRef.current?.addView(
          splitViewViewRef.current[key!],
          {
            element: document.createElement("div"),
            minimumSize: minSize,
            maximumSize: maxSize,
            snap: snap,
            layout: (size) => {},
          },
          Sizing.Distribute
        );
      }

      if (enter.length > 0 || exit.length > 0) {
        previousKeys.current = keys;
      }
    }, [children, childrenArray, maxSize, minSize, snap]);

    useResizeObserver({
      ref: containerRef,
      onResize: ({ width, height }) => {
        if (width && height) {
          splitViewRef.current?.layout(vertical ? height : width);
        }
      },
    });

    return (
      <div
        ref={containerRef}
        className={classNames(
          styles.splitView,
          vertical ? styles.vertical : styles.horizontal,
          styles.separatorBorder
        )}
      >
        <div ref={splitViewContainerRef} className={styles.splitViewContainer}>
          {React.Children.toArray(children).map((child, index) => {
            if (!React.isValidElement(child)) {
              return null;
            }

            return (
              <div
                key={child.key ?? index}
                ref={(el: HTMLElement | null) => {
                  if (el) {
                    splitViewViewRef.current[child.key ?? index] = el;
                  } else {
                    delete splitViewViewRef.current[child.key ?? index];
                  }
                }}
                className={classNames(styles.splitViewView)}
              >
                {React.cloneElement(child, {
                  ref: (el: HTMLElement | null) => {
                    if (el) {
                      viewRef.current[child.key ?? index] = el;
                    } else {
                      delete viewRef.current[child.key ?? index];
                    }
                  },
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

Banderole.displayName = "Banderole";

export default Object.assign(Banderole, { Pane: Pane });
