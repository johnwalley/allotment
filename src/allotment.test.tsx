import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";

import { Allotment } from "./index";
import { SplitView } from "./split-view";

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

  test.each([false, true])(
    "sash changes call the latest onVisibleChange (initially absent: %p)",
    (initiallyAbsent) => {
      const first = jest.fn();
      const second = jest.fn();
      const listener = jest.spyOn(SplitView.prototype, "on");
      const visible = jest.spyOn(SplitView.prototype, "isViewVisible");
      const render = (
        onVisibleChange?: (index: number, visible: boolean) => void,
      ) =>
        act(() => {
          root.render(
            <Allotment
              defaultSizes={[100, 100]}
              onVisibleChange={onVisibleChange}
            >
              <Allotment.Pane key="a" visible>
                <div />
              </Allotment.Pane>
              <Allotment.Pane key="b" visible>
                <div />
              </Allotment.Pane>
            </Allotment>,
          );
        });
      try {
        render(initiallyAbsent ? undefined : first);
        render(second);
        visible.mockReturnValue(false);
        const callback = listener.mock.calls.find(
          ([name]) => name === "sashchange",
        )![1];
        act(() => callback(0));
        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledWith(0, false);
        expect(second).toHaveBeenCalledWith(1, false);
      } finally {
        listener.mockRestore();
        visible.mockRestore();
      }
    },
  );

  test("sash changes use the current pane order", () => {
    const onVisibleChange = jest.fn();
    const listener = jest.spyOn(SplitView.prototype, "on");
    const visible = jest.spyOn(SplitView.prototype, "isViewVisible");
    const render = (keys: string[]) =>
      act(() => {
        root.render(
          <Allotment
            defaultSizes={[100, 100]}
            onVisibleChange={onVisibleChange}
          >
            {keys.map((key) => (
              <Allotment.Pane key={key} visible={key === "b"}>
                <div />
              </Allotment.Pane>
            ))}
          </Allotment>,
        );
      });
    try {
      render(["a", "b"]);
      render(["b", "a"]);
      visible.mockReturnValue(false);
      const callback = listener.mock.calls.find(
        ([name]) => name === "sashchange",
      )![1];
      act(() => callback(0));
      expect(onVisibleChange).toHaveBeenCalledTimes(1);
      expect(onVisibleChange).toHaveBeenCalledWith(0, false);
    } finally {
      listener.mockRestore();
      visible.mockRestore();
    }
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
});
