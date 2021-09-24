import classNames from "classnames";
import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import useResizeObserver from "use-resize-observer";

import styles from "./allotment.module.css";
import { Orientation } from "./sash";
import { Sizing, SplitView } from "./split-view/split-view";

function isPane(item: React.ReactNode): item is typeof Pane {
  return (item as any).type.displayName === "Allotment.Pane";
}

export type PaneProps = {
  children: React.ReactNode;
  maxSize?: number;
  minSize?: number;
  snap?: boolean;
};

export const Pane = forwardRef<HTMLDivElement, PaneProps>(
  ({ children }: PaneProps, ref) => {
    return (
      <div ref={ref} className={styles.splitViewView}>
        {children}
      </div>
    );
  }
);

Pane.displayName = "Allotment.Pane";

export type AllotmentProps = {
  children: React.ReactNode;
  maxSize?: number;
  minSize?: number;
  snap?: boolean;
  vertical?: boolean;
};

const Allotment = ({
  children,
  maxSize = Infinity,
  minSize = 30,
  snap = false,
  vertical = false,
}: AllotmentProps) => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const previousKeys = useRef<string[]>([]);
  const splitViewContainerRef = useRef<HTMLDivElement>(null!);
  const splitViewRef = useRef<SplitView | null>(null);
  const splitViewViewRef = useRef<Record<string, HTMLElement>>({});
  const splitViewPropsRef = useRef<
    Record<string, { maxSize?: number; minSize?: number; snap?: boolean }>
  >({});

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
    const keys = childrenArray.map((child) => child.key as string);

    const enter = keys.filter((key) => !previousKeys.current.includes(key));
    const exit = previousKeys.current.map((key) => !keys.includes(key));

    exit.forEach((flag, index) => {
      if (flag) {
        splitViewRef.current?.removeView(index);
      }
    });

    for (const key of enter) {
      const props = splitViewPropsRef.current[key];

      splitViewRef.current?.addView(
        splitViewViewRef.current[key],
        {
          element: document.createElement("div"),
          minimumSize: props?.minSize ?? minSize,
          maximumSize: props?.maxSize ?? maxSize,
          snap: props?.snap ?? snap,
          layout: () => {},
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

          const key = child.key ?? index;

          if (isPane(child)) {
            splitViewPropsRef.current[key] = child.props;

            return React.cloneElement(child, {
              key: key,
              ref: (el: HTMLElement | null) => {
                if (el) {
                  splitViewViewRef.current[key] = el;
                } else {
                  delete splitViewViewRef.current[key];
                }
              },
            });
          } else {
            return (
              <Pane
                key={key}
                ref={(el: HTMLElement | null) => {
                  if (el) {
                    splitViewViewRef.current[key] = el;
                  } else {
                    delete splitViewViewRef.current[key];
                  }
                }}
              >
                {child}
              </Pane>
            );
          }
        })}
      </div>
    </div>
  );
};

Allotment.displayName = "Allotment";

export default Object.assign(Allotment, { Pane: Pane });
