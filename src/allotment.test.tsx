import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";

import { Allotment, AllotmentHandle } from "./index";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("Allotment", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeAll(() => {
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
    (globalThis as any).ResizeObserver ??= ResizeObserverMock;
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  test("double-clicking a sash calls the latest onReset", () => {
    const firstOnReset = jest.fn();
    const secondOnReset = jest.fn();

    const render = (onReset: () => void) =>
      act(() => {
        root.render(
          <Allotment defaultSizes={[100, 100]} onReset={onReset}>
            <div key="a" />
            <div key="b" />
          </Allotment>,
        );
      });

    render(firstOnReset);
    render(secondOnReset);

    const sash = container.querySelector(".sash");
    expect(sash).not.toBeNull();

    act(() => {
      sash!.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    });

    expect(firstOnReset).not.toHaveBeenCalled();
    expect(secondOnReset).toHaveBeenCalledTimes(1);
  });

  test("reset() resizes a pane with preferredSize={0} to zero", () => {
    const ref = React.createRef<AllotmentHandle>();

    act(() => {
      root.render(
        <Allotment ref={ref} defaultSizes={[100, 100]}>
          <Allotment.Pane key="a" minSize={0} preferredSize={0}>
            <div />
          </Allotment.Pane>
          <Allotment.Pane key="b" minSize={0}>
            <div />
          </Allotment.Pane>
        </Allotment>,
      );
    });

    act(() => {
      ref.current!.reset();
    });

    const panes = container.querySelectorAll<HTMLElement>(".split-view-view");

    expect(panes).toHaveLength(2);
    expect(panes[0].style.width).toBe("0px");
    expect(panes[1].style.width).toBe("200px");
  });

  test.each([
    [0, "0px"],
    [50, "50px"],
    ["50px", "50px"],
    ["", "100px"],
    [undefined, "100px"],
  ])("reset() with preferredSize=%p sizes the pane to %s", (size, width) => {
    const ref = React.createRef<AllotmentHandle>();
    const onChange = jest.fn();

    act(() => {
      root.render(
        <Allotment ref={ref} defaultSizes={[100, 100]} onChange={onChange}>
          <Allotment.Pane key="a" minSize={0} preferredSize={size}>
            <div />
          </Allotment.Pane>
          <Allotment.Pane key="b" minSize={0}>
            <div />
          </Allotment.Pane>
        </Allotment>,
      );
    });

    act(() => {
      ref.current!.reset();
    });

    const panes = container.querySelectorAll<HTMLElement>(".split-view-view");

    expect(panes[0].style.width).toBe(width);
    expect(onChange.mock.calls.flat(2).every(Number.isFinite)).toBe(true);
  });

  test("a pane added with preferredSize={0} starts at zero", () => {
    const originalResizeObserver = globalThis.ResizeObserver;

    // Report a 300x100 container so that Allotment adds new panes.
    class SizedResizeObserver {
      constructor(private callback: ResizeObserverCallback) {}
      observe(target: Element) {
        this.callback(
          [
            {
              target,
              contentRect: { width: 300, height: 100 },
            } as unknown as ResizeObserverEntry,
          ],
          this as unknown as ResizeObserver,
        );
      }
      unobserve() {}
      disconnect() {}
    }

    globalThis.ResizeObserver =
      SizedResizeObserver as unknown as typeof ResizeObserver;

    const render = (withC: boolean) =>
      act(() => {
        root.render(
          <Allotment defaultSizes={[150, 150]}>
            <Allotment.Pane key="a" minSize={0}>
              <div />
            </Allotment.Pane>
            <Allotment.Pane key="b" minSize={0}>
              <div />
            </Allotment.Pane>
            {withC && (
              <Allotment.Pane key="c" minSize={0} preferredSize={0}>
                <div />
              </Allotment.Pane>
            )}
          </Allotment>,
        );
      });

    try {
      render(false);
      render(true);
    } finally {
      globalThis.ResizeObserver = originalResizeObserver;
    }

    const panes = container.querySelectorAll<HTMLElement>(".split-view-view");

    expect(panes).toHaveLength(3);
    expect(panes[2].style.width).toBe("0px");
  });
});
