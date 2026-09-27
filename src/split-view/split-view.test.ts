import { getAllByTestId } from "@testing-library/dom";

import { Sizing, SplitView, View } from "./split-view";
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

  constructor(
    private _minimumSize: number,
    private _maximumSize: number,
  ) {}

  layout(size: number, _offset: number): void {
    this._size = size;
  }
}

describe("Splitview", () => {
  let container: HTMLElement;
  let viewContainer: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    viewContainer = document.createElement("div");
    container.appendChild(viewContainer);
  });

  test("empty splitview has empty DOM", () => {
    const splitview = new SplitView(viewContainer);

    expect(
      container.firstElementChild!.firstElementChild!.childElementCount,
    ).toEqual(0);

    splitview.dispose();
  });

  test("has views and sashes as children", () => {
    const view1 = new TestView(20, 20);
    const view2 = new TestView(20, 20);
    const view3 = new TestView(20, 20);
    const splitview = new SplitView(viewContainer);

    // TODO: This reflects an issue where we rely on React to add and remove the containing elements
    //       So in this test, with no React, calling removeView does not affect the DOM
    const splitViewView1 = document.createElement("div");
    viewContainer.append(splitViewView1);
    const splitViewView2 = document.createElement("div");
    viewContainer.append(splitViewView2);
    const splitViewView3 = document.createElement("div");
    viewContainer.append(splitViewView3);

    splitview.addView(splitViewView1, view1, 20);
    splitview.addView(splitViewView2, view2, 20);
    splitview.addView(splitViewView3, view3, 20);

    let viewQuery = getAllByTestId(container, "split-view-view");

    expect(viewQuery.length).toEqual(3);

    let sashQuery = getAllByTestId(container, "sash");

    expect(sashQuery.length).toEqual(2);

    /*   splitview.removeView(2);

    viewQuery = getAllByTestId(container, "split-view-view");

    expect(viewQuery.length).toEqual(2);

    sashQuery = getAllByTestId(container, "sash");

    expect(sashQuery.length).toEqual(1);

    splitview.removeView(0);

    viewQuery = getAllByTestId(container, "split-view-view");

    expect(viewQuery.length).toEqual(1);

    sashQuery = getAllByTestId(container, "sash");

    expect(sashQuery.length).toEqual(0);

    splitview.removeView(0);

    viewQuery = getAllByTestId(container, "split-view-view");

    expect(viewQuery.length).toEqual(0);

    sashQuery = getAllByTestId(container, "sash");

    expect(sashQuery.length).toEqual(0); */

    splitview.dispose();
  });

  describe("sizing", () => {
    function createSplitView(sizes: number[]) {
      const splitview = new SplitView(viewContainer);
      const total = sizes.reduce((a, b) => a + b, 0);

      splitview.layout(total);

      for (const size of sizes) {
        splitview.addView(
          document.createElement("div"),
          new TestView(0, Number.POSITIVE_INFINITY),
          size,
          undefined,
          true,
        );
      }

      splitview.layout(total);

      return splitview;
    }

    function getSizes(splitview: SplitView) {
      const sizes: number[] = [];

      for (let i = 0; splitview.getViewSize(i) !== -1; i++) {
        sizes.push(splitview.getViewSize(i));
      }

      return sizes;
    }

    function addView(splitview: SplitView, sizing: Sizing, index?: number) {
      splitview.addView(
        document.createElement("div"),
        new TestView(0, Number.POSITIVE_INFINITY),
        sizing,
        index,
      );
    }

    test("auto distributes evenly when views are already distributed", () => {
      const splitview = createSplitView([333, 333, 334]);

      addView(splitview, Sizing.Auto(2), 3);

      expect(getSizes(splitview)).toEqual([250, 250, 250, 250]);

      splitview.dispose();
    });

    test("auto splits the reference view when views are not distributed", () => {
      const splitview = createSplitView([100, 500, 400]);

      addView(splitview, Sizing.Auto(2), 3);

      expect(getSizes(splitview)).toEqual([100, 500, 200, 200]);

      splitview.dispose();
    });

    test("auto splits the following view when inserting at the start", () => {
      const splitview = createSplitView([100, 500, 400]);

      addView(splitview, Sizing.Auto(0), 0);

      expect(getSizes(splitview)).toEqual([50, 50, 500, 400]);

      splitview.dispose();
    });

    test("split sizing when removing gives the space to the reference view", () => {
      const splitview = createSplitView([100, 500, 400]);

      splitview.removeView(1, Sizing.Split(0));

      expect(getSizes(splitview)).toEqual([600, 400]);

      splitview.dispose();
    });

    test("auto sizing when removing from distributed views keeps them distributed", () => {
      const splitview = createSplitView([250, 250, 250, 250]);

      splitview.removeView(1, Sizing.Auto(0));

      expect(getSizes(splitview)).toEqual([333, 333, 334]);

      splitview.dispose();
    });

    test("auto sizing when removing from uneven views gives the space to the reference view", () => {
      const splitview = createSplitView([100, 500, 400]);

      splitview.removeView(2, Sizing.Auto(1));

      expect(getSizes(splitview)).toEqual([100, 900]);

      splitview.dispose();
    });
  });
});
