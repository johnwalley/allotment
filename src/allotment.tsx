import classNames from "classnames";
import clamp from "lodash.clamp";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useResizeObserver from "use-resize-observer";

import styles from "./allotment.module.css";
import { isIOS } from "./helpers/platform";
import { LayoutService } from "./layout-service";
import { PaneView } from "./pane-view";
import { Orientation, setGlobalSashSize } from "./sash";
import { Sizing, SplitView, SplitViewOptions } from "./split-view";

function isPane(item: React.ReactNode): item is typeof Pane {
  return (item as any).type.displayName === "Allotment.Pane";
}

function isPaneProps(props: AllotmentProps | PaneProps): props is PaneProps {
  return (
    (props as PaneProps).preferredSize !== undefined ||
    (props as PaneProps).visible !== undefined
  );
}

export interface CommonProps {
  /** Sets a className attribute on the outer component */
  className?: string;
  /** Maximum size of each element */
  maxSize?: number;
  /** Minimum size of each element */
  minSize?: number;
  /** Enable snap to zero size */
  snap?: boolean;
}

export type PaneProps = {
  children: React.ReactNode;
  preferredSize?: number | string;
  visible?: boolean;
} & CommonProps;

export const Pane = forwardRef<HTMLDivElement, PaneProps>(
  ({ className, children }: PaneProps, ref) => {
    return (
      <div ref={ref} className={classNames(styles.splitViewView, className)}>
        {children}
      </div>
    );
  }
);

Pane.displayName = "Allotment.Pane";

export type AllotmentHandle = {
  reset: () => void;
  resize: (sizes: number[]) => void;
};

export type AllotmentProps = {
  children: React.ReactNode;
  /**
   * Initial size of each element
   */
  defaultSizes?: number[];
  /** Resize each view proportionally when resizing container */
  proportionalLayout?: boolean;
  /**
   * Initial size of each element
   * @deprecated Use {@link AllotmentProps.defaultSizes defaultSizes} instead
   */
  sizes?: number[];
  /** Direction to split */
  vertical?: boolean;
  /** Callback on drag */
  onChange?: (sizes: number[]) => void;
  /** Callback on reset */
  onReset?: () => void;
  /** Callback on visibility change */
  onVisibleChange?: (index: number, visible: boolean) => void;
} & CommonProps;

const Allotment = forwardRef<AllotmentHandle, AllotmentProps>(
  (
    {
      children,
      className,
      maxSize = Infinity,
      minSize = 30,
      proportionalLayout = true,
      sizes,
      defaultSizes = sizes,
      snap = false,
      vertical = false,
      onChange,
      onReset,
      onVisibleChange,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null!);
    const previousKeys = useRef<string[]>([]);
    const splitViewPropsRef = useRef(new Map<React.Key, PaneProps>());
    const splitViewRef = useRef<SplitView | null>(null);
    const splitViewViewRef = useRef(new Map<React.Key, HTMLElement>());
    const layoutService = useRef<LayoutService>(new LayoutService());
    const views = useRef<PaneView[]>([]);

    const [dimensionsInitialized, setDimensionsInitialized] = useState(false);

    if (process.env.NODE_ENV !== "production" && sizes) {
      console.warn(
        `Prop sizes is deprecated. Please use defaultSizes instead.`
      );
    }

    const childrenArray = useMemo(
      () => React.Children.toArray(children).filter(React.isValidElement),
      [children]
    );

    const resizeToPreferredSize = useCallback((index: number): boolean => {
      const view = views.current?.[index];

      if (typeof view?.preferredSize !== "number") {
        return false;
      }

      splitViewRef.current?.resizeView(index, Math.round(view.preferredSize));

      return true;
    }, []);

    useImperativeHandle(ref, () => ({
      reset: () => {
        splitViewRef.current?.distributeViewSizes();

        for (let index = 0; index < views.current.length; index++) {
          resizeToPreferredSize(index);
        }
      },
      resize: (sizes) => {
        splitViewRef.current?.resizeViews(sizes);
      },
    }));

    useLayoutEffect(() => {
      let initializeSizes = true;

      if (
        defaultSizes &&
        splitViewViewRef.current.size !== defaultSizes.length
      ) {
        initializeSizes = false;

        console.warn(
          `Expected ${defaultSizes.length} children based on defaultSizes but found ${splitViewViewRef.current.size}`
        );
      }

      if (initializeSizes && defaultSizes) {
        previousKeys.current = childrenArray.map(
          (child) => child.key as string
        );
      }

      const options: SplitViewOptions = {
        orientation: vertical ? Orientation.Vertical : Orientation.Horizontal,
        proportionalLayout,
        ...(initializeSizes &&
          defaultSizes && {
            descriptor: {
              size: defaultSizes.reduce((a, b) => a + b, 0),
              views: defaultSizes.map((size, index) => {
                const props = splitViewPropsRef.current.get(
                  previousKeys.current[index]
                );

                const view = new PaneView(layoutService.current, {
                  element: document.createElement("div"),
                  minimumSize: props?.minSize ?? minSize,
                  maximumSize: props?.maxSize ?? maxSize,
                  ...(props?.preferredSize && {
                    preferredSize: props?.preferredSize,
                  }),
                  snap: props?.snap ?? snap,
                });

                return {
                  container: [...splitViewViewRef.current.values()][index],
                  size: size,
                  view: view,
                };
              }),
            },
          }),
      };

      splitViewRef.current = new SplitView(
        containerRef.current,
        options,
        onChange
      );

      splitViewRef.current.on("sashchange", (_index: number) => {
        if (onVisibleChange && splitViewRef.current) {
          const keys = childrenArray.map((child) => child.key as string);

          for (let index = 0; index < keys.length; index++) {
            const props = splitViewPropsRef.current.get(keys[index]);

            if (props?.visible !== undefined) {
              if (props.visible !== splitViewRef.current.isViewVisible(index)) {
                onVisibleChange(
                  index,
                  splitViewRef.current.isViewVisible(index)
                );
              }
            }
          }
        }
      });

      splitViewRef.current.on("sashreset", (index: number) => {
        if (onReset) {
          onReset();
        } else {
          if (resizeToPreferredSize(index)) {
            return;
          }

          if (resizeToPreferredSize(index + 1)) {
            return;
          }

          splitViewRef.current?.distributeViewSizes();
        }
      });

      const that = splitViewRef.current;

      return () => {
        that.dispose();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Add, remove or update views as children change
     */
    useEffect(() => {
      if (dimensionsInitialized) {
        const keys = childrenArray.map((child) => child.key as string);

        const enter = keys.filter((key) => !previousKeys.current.includes(key));
        const update = keys.filter((key) => previousKeys.current.includes(key));
        const exit = previousKeys.current.map((key) => !keys.includes(key));

        exit.forEach((flag, index) => {
          if (flag) {
            splitViewRef.current?.removeView(index);
            views.current.splice(index, 1);
          }
        });

        for (const enterKey of enter) {
          const props = splitViewPropsRef.current.get(enterKey);

          const view = new PaneView(layoutService.current, {
            element: document.createElement("div"),
            minimumSize: props?.minSize ?? minSize,
            maximumSize: props?.maxSize ?? maxSize,
            ...(props?.preferredSize && {
              preferredSize: props?.preferredSize,
            }),
            snap: props?.snap ?? snap,
          });

          splitViewRef.current?.addView(
            splitViewViewRef.current.get(enterKey)!,
            view,
            Sizing.Distribute,
            keys.findIndex((key) => key === enterKey)
          );

          views.current.splice(
            keys.findIndex((key) => key === enterKey),
            0,
            view
          );
        }

        for (const enterKey of enter) {
          const index = keys.findIndex((key) => key === enterKey);

          const preferredSize = views.current[index].preferredSize;

          if (preferredSize !== undefined) {
            splitViewRef.current?.resizeView(index, preferredSize);
          }
        }

        for (const updateKey of [...enter, ...update]) {
          const props = splitViewPropsRef.current.get(updateKey);
          const index = keys.findIndex((key) => key === updateKey);

          if (props && isPaneProps(props)) {
            if (props.visible !== undefined) {
              if (
                splitViewRef.current?.isViewVisible(index) !== props.visible
              ) {
                splitViewRef.current?.setViewVisible(index, props.visible);
              }
            }
          }
        }

        for (const updateKey of update) {
          const props = splitViewPropsRef.current.get(updateKey);
          const index = keys.findIndex((key) => key === updateKey);

          if (props && isPaneProps(props)) {
            if (props.preferredSize !== undefined) {
              views.current[index].preferredSize = props.preferredSize;
            }
          }
        }

        if (enter.length > 0 || exit.length > 0) {
          previousKeys.current = keys;
        }
      }
    }, [childrenArray, dimensionsInitialized, maxSize, minSize, snap]);

    useResizeObserver({
      ref: containerRef,
      onResize: ({ width, height }) => {
        if (width && height) {
          splitViewRef.current?.layout(vertical ? height : width);
          layoutService.current.setSize(vertical ? height : width);
          setDimensionsInitialized(true);
        }
      },
    });

    useEffect(() => {
      if (isIOS) {
        setSashSize(20);
      }
    }, []);

    return (
      <div
        ref={containerRef}
        className={classNames(
          styles.splitView,
          vertical ? styles.vertical : styles.horizontal,
          styles.separatorBorder,
          className
        )}
      >
        <div className={styles.splitViewContainer}>
          {React.Children.toArray(children).map((child) => {
            if (!React.isValidElement(child)) {
              return null;
            }

            // toArray flattens and converts nulls to non-null keys
            const key = child.key!;

            if (isPane(child)) {
              splitViewPropsRef.current.set(key, child.props);

              return React.cloneElement(child, {
                key: key,
                ref: (el: HTMLElement | null) => {
                  if (el) {
                    splitViewViewRef.current.set(key, el);
                  } else {
                    splitViewViewRef.current.delete(key);
                  }
                },
              });
            } else {
              return (
                <Pane
                  key={key}
                  ref={(el: HTMLElement | null) => {
                    if (el) {
                      splitViewViewRef.current.set(key, el);
                    } else {
                      splitViewViewRef.current.delete(key);
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
  }
);

Allotment.displayName = "Allotment";

export function setSashSize(sashSize: number) {
  const size = clamp(sashSize, 4, 20);
  const hoverSize = clamp(sashSize, 1, 8);

  document.documentElement.style.setProperty("--sash-size", size + "px");
  document.documentElement.style.setProperty(
    "--sash-hover-size",
    hoverSize + "px"
  );

  setGlobalSashSize(size);
}

export default Object.assign(Allotment, { Pane: Pane });
