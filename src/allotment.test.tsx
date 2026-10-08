import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";

import { Allotment } from "./index";

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
});
