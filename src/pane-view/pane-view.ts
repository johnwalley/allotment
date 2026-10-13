import { endsWith } from "../helpers/string";
import { LayoutService } from "../layout-service";
import { LayoutPriority, View } from "../split-view";

export interface Layout {
  getPreferredSize: () => number | undefined;
}

export class PixelLayout implements Layout {
  private size: number;

  constructor(size: number) {
    this.size = size;
  }

  public getPreferredSize() {
    return this.size;
  }
}

export class ProportionLayout implements Layout {
  private proportion: number;
  private layoutService: LayoutService;

  constructor(proportion: number, layoutService: LayoutService) {
    this.proportion = proportion;
    this.layoutService = layoutService;
  }

  public getPreferredSize() {
    return this.proportion * this.layoutService.getSize();
  }
}

export class NullLayout implements Layout {
  public getPreferredSize() {
    return undefined;
  }
}

export interface PaneViewOptions {
  element: HTMLElement;
  minimumSize?: number;
  maximumSize?: number;
  priority?: LayoutPriority;
  preferredSize?: number | string;
  snap?: boolean;
}

export class PaneView implements View {
  public minimumSize: number = 0;
  public maximumSize: number = Number.POSITIVE_INFINITY;

  readonly element: HTMLElement;
  readonly priority?: LayoutPriority | undefined;
  readonly snap: boolean;

  private layoutService: LayoutService;
  private layoutStrategy: Layout = new NullLayout();

  get preferredSize(): number | undefined {
    return this.layoutStrategy.getPreferredSize();
  }

  set preferredSize(preferredSize: number | string | undefined) {
    if (typeof preferredSize === "number") {
      this.layoutStrategy = new PixelLayout(preferredSize);
    } else if (typeof preferredSize === "string") {
      const trimmedPreferredSize = preferredSize.trim();

      if (endsWith(trimmedPreferredSize, "%")) {
        const proportion = Number(trimmedPreferredSize.slice(0, -1)) / 100;

        this.layoutStrategy = Number.isFinite(proportion)
          ? new ProportionLayout(proportion, this.layoutService)
          : new NullLayout();
      } else if (endsWith(trimmedPreferredSize, "px")) {
        const pixels = Number(trimmedPreferredSize.slice(0, -2));

        this.layoutStrategy = Number.isFinite(pixels)
          ? new PixelLayout(pixels)
          : new NullLayout();
      } else if (Number.isFinite(Number.parseFloat(trimmedPreferredSize))) {
        const number = Number.parseFloat(trimmedPreferredSize);

        this.layoutStrategy = new PixelLayout(number);
      } else {
        this.layoutStrategy = new NullLayout();
      }
    } else {
      this.layoutStrategy = new NullLayout();
    }
  }

  constructor(layoutService: LayoutService, options: PaneViewOptions) {
    this.layoutService = layoutService;
    this.element = options.element;

    this.minimumSize =
      typeof options.minimumSize === "number" ? options.minimumSize : 30;

    this.maximumSize =
      typeof options.maximumSize === "number"
        ? options.maximumSize
        : Number.POSITIVE_INFINITY;

    this.preferredSize = options.preferredSize;

    this.priority = options.priority ?? LayoutPriority.Normal;

    this.snap = typeof options.snap === "boolean" ? options.snap : false;
  }

  layout(_size: number): void {}
}
