import { SplitView, View } from "./split-view";

class TestView implements View {
  get minimumSize(): number {
    return this._minimumSize;
  }

  set minimumSize(size: number) {
    this._minimumSize = size;
  }

  get maximumSize(): number {
    return this._maximumSize;
  }

  set maximumSize(size: number) {
    this._maximumSize = size;
  }

  private _element: HTMLElement = document.createElement("div");
  get element(): HTMLElement {
    return this._element;
  }

  private _size = 0;
  get size(): number {
    return this._size;
  }

  private _orthogonalSize: number | undefined = 0;
  get orthogonalSize(): number | undefined {
    return this._orthogonalSize;
  }

  constructor(private _minimumSize: number, private _maximumSize: number) {}

  layout(size: number, _offset: number): void {
    this._size = size;
  }
}

describe("Splitview", () => {
  let container: HTMLElement;
  let viewContainer: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.style.position = "absolute";
    container.style.width = `${200}px`;
    container.style.height = `${200}px`;

    viewContainer = document.createElement("div");

    container.appendChild(viewContainer);
  });

  test("empty splitview has empty DOM", () => {
    const splitview = new SplitView(container, viewContainer);

    expect(
      container.firstElementChild!.firstElementChild!.childElementCount
    ).toEqual(0);

    splitview.dispose();
  });

  test("has views and sashes as children", () => {
    const view1 = new TestView(20, 20);
    const view2 = new TestView(20, 20);
    const view3 = new TestView(20, 20);
    const splitview = new SplitView(container, viewContainer);

    splitview.addView(container, view1, 20);
    splitview.addView(container, view2, 20);
    splitview.addView(container, view3, 20);

    let viewQuery = viewContainer.querySelectorAll(
      ".split-view > .split-view-container > .split-view-view"
    );

    expect(viewQuery.length).toEqual(3);

    let sashQuery = container.querySelectorAll(
      ".split-view > .sash-container > .sash"
    );

    expect(sashQuery.length).toEqual(2);

    splitview.removeView(2);

    viewQuery = container.querySelectorAll(
      ".split-view > .split-view-container > .split-view-view"
    );

    expect(viewQuery.length).toEqual(2);

    sashQuery = container.querySelectorAll(
      ".split-view > .sash-container > .sash"
    );

    expect(sashQuery.length).toEqual(1);

    splitview.removeView(0);

    viewQuery = container.querySelectorAll(
      ".split-view > .split-view-container > .split-view-view"
    );
    expect(viewQuery.length).toEqual(1);

    sashQuery = container.querySelectorAll(
      ".split-view > .sash-container > .sash"
    );

    expect(sashQuery.length).toEqual(0);

    splitview.removeView(0);

    viewQuery = container.querySelectorAll(
      ".split-view > .split-view-container > .split-view-view"
    );

    expect(viewQuery.length).toEqual(0);

    sashQuery = container.querySelectorAll(
      ".split-view > .sash-container > .monaco-sash"
    );

    expect(sashQuery.length).toEqual(0);

    splitview.dispose();
  });
});
