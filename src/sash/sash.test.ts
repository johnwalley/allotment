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

  beforeAll(() => {
    HTMLElement.prototype.setPointerCapture = jest.fn();
    HTMLElement.prototype.releasePointerCapture = jest.fn();
    HTMLElement.prototype.hasPointerCapture = jest.fn(() => true);
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

  test("dispose tears down an in-progress drag", () => {
    const { sash, el } = createSash();
    const onChange = jest.fn();
    const onEnd = jest.fn();
    sash.on("change", onChange);
    sash.on("end", onEnd);

    el.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    expect(el.classList.contains("sash-active")).toBe(true);

    sash.dispose();

    window.dispatchEvent(new MouseEvent("pointermove"));
    window.dispatchEvent(new MouseEvent("pointerup"));

    expect(onChange).not.toHaveBeenCalled();
    expect(onEnd).not.toHaveBeenCalled();
    expect(el.classList.contains("sash-active")).toBe(false);
  });

  test("dispose unsubscribes from global sash size changes", () => {
    const sashes = Array.from({ length: 5 }, () => createSash());

    sashes.forEach(({ sash }) => sash.dispose());
    sashes.forEach(({ layoutProvider }) =>
      layoutProvider.getVerticalSashLeft.mockClear(),
    );

    setGlobalSashSize(10);

    sashes.forEach(({ layoutProvider }) =>
      expect(layoutProvider.getVerticalSashLeft).not.toHaveBeenCalled(),
    );

    setGlobalSashSize(8);
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
