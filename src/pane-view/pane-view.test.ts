import { LayoutService } from "../layout-service";
import { PaneView } from "./pane-view";

describe("PaneView preferredSize", () => {
  const layoutService = new LayoutService();
  layoutService.setSize(600);

  test.each([
    [200, 200],
    ["200px", 200],
    [" 300px ", 300],
    ["50%", 300],
    ["200", 200],
    [undefined, undefined],
    ["auto", undefined],
    ["invalidpx", undefined],
    ["invalid%", undefined],
  ])("uses the same size for initial and updated %p", (input, expected) => {
    const view = new PaneView(layoutService, {
      element: document.createElement("div"),
      preferredSize: input,
    });
    expect(view.preferredSize).toBe(expected);

    view.preferredSize = 100;
    view.preferredSize = input;
    expect(view.preferredSize).toBe(expected);
  });
});
