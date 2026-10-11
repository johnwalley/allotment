import { Orientation, Sash, setGlobalSashSize } from "./sash";

jest.mock("./sash.module.css", () => ({
  sash: "sash-module",
  active: "active-module",
  hover: "hover-module",
  vertical: "vertical-module",
  horizontal: "horizontal-module",
}));

describe("Sash", () => {
  let container: HTMLElement;

  const { setPointerCapture, releasePointerCapture, hasPointerCapture } =
    HTMLElement.prototype;

  beforeAll(() => {
    HTMLElement.prototype.setPointerCapture = jest.fn();
    HTMLElement.prototype.releasePointerCapture = jest.fn();
    HTMLElement.prototype.hasPointerCapture = jest.fn(() => true);
  });

  afterAll(() => {
    HTMLElement.prototype.setPointerCapture = setPointerCapture;
    HTMLElement.prototype.releasePointerCapture = releasePointerCapture;
    HTMLElement.prototype.hasPointerCapture = hasPointerCapture;
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
    jest.useRealTimers();
  });

  function createSash(size?: number) {
    const layoutProvider = { getVerticalSashLeft: jest.fn(() => 0) };
    const sash = new Sash(container, layoutProvider, {
      orientation: Orientation.Vertical,
      size,
    });
    const el = container.lastElementChild as HTMLElement;

    return { sash, el, layoutProvider };
  }

  test("dispose ends an in-progress drag", () => {
    const { sash, el } = createSash();
    const onChange = jest.fn();
    const onEnd = jest.fn();
    sash.on("change", onChange);
    sash.on("end", onEnd);

    el.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    expect(el.classList.contains("sash-active")).toBe(true);

    sash.dispose();

    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(el.classList.contains("sash-active")).toBe(false);

    window.dispatchEvent(new MouseEvent("pointermove"));
    window.dispatchEvent(new MouseEvent("pointerup"));

    expect(onChange).not.toHaveBeenCalled();
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  test("pointercancel ends the drag", () => {
    const { sash, el } = createSash();
    const onChange = jest.fn();
    const onEnd = jest.fn();
    sash.on("change", onChange);
    sash.on("end", onEnd);

    el.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    window.dispatchEvent(new MouseEvent("pointercancel"));

    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(el.classList.contains("sash-active")).toBe(false);

    window.dispatchEvent(new MouseEvent("pointermove"));
    window.dispatchEvent(new MouseEvent("pointerup"));

    expect(onChange).not.toHaveBeenCalled();
    expect(onEnd).toHaveBeenCalledTimes(1);

    sash.dispose();
  });

  test("starting a second drag ends the first", () => {
    const { sash, el } = createSash();
    const onStart = jest.fn();
    const onEnd = jest.fn();
    sash.on("start", onStart);
    sash.on("end", onEnd);

    el.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    el.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    window.dispatchEvent(new MouseEvent("pointerup"));

    expect(onStart).toHaveBeenCalledTimes(2);
    expect(onEnd).toHaveBeenCalledTimes(2);

    sash.dispose();
  });

  test("a throwing end listener doesn't leave the drag attached", () => {
    const { sash, el } = createSash();
    const onChange = jest.fn();
    sash.on("change", onChange);
    sash.on("end", () => {
      throw new Error("end listener failed");
    });

    el.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));

    expect(() => sash.endDrag()).toThrow("end listener failed");

    window.dispatchEvent(new MouseEvent("pointermove"));

    expect(onChange).not.toHaveBeenCalled();
    expect(el.classList.contains("sash-active")).toBe(false);

    sash.removeAllListeners();
    sash.dispose();
  });

  test("dispose unsubscribes from global sash size changes", () => {
    const sashes = Array.from({ length: 5 }, () => createSash());

    // The sash is centred on getVerticalSashLeft, which returns 0, so its
    // left offset is minus half the current global size.
    const originalSize = -2 * parseFloat(sashes[0].el.style.left);

    sashes.forEach(({ sash }) => sash.dispose());
    sashes.forEach(({ layoutProvider }) =>
      layoutProvider.getVerticalSashLeft.mockClear(),
    );

    try {
      setGlobalSashSize(originalSize + 2);

      sashes.forEach(({ layoutProvider }) =>
        expect(layoutProvider.getVerticalSashLeft).not.toHaveBeenCalled(),
      );
    } finally {
      setGlobalSashSize(originalSize);
    }
  });

  test("dispose cancels the pending hover delay", () => {
    jest.useFakeTimers();

    const { sash, el } = createSash();

    el.dispatchEvent(new MouseEvent("mouseenter"));
    sash.dispose();
    jest.advanceTimersByTime(500);

    expect(el.classList.contains("sash-hover")).toBe(false);
  });
});
