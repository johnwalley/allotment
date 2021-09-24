import EventEmitter from "eventemitter3";
import debounce from "lodash.debounce";

import { Disposable } from "../helpers/disposable";
import { isMacintosh } from "../helpers/platform";
import styles from "./sash.module.css";

export interface SashOptions {
  readonly orientation: Orientation;
  readonly size?: number;
}

export interface SashEvent {
  startX: number;
  currentX: number;
  startY: number;
  currentY: number;
}

export enum Orientation {
  Vertical = "VERTICAL",
  Horizontal = "HORIZONTAL",
}

export enum SashState {
  Disabled = "DISABLED",
  Minimum = "MINIMUM",
  Maximum = "MAXIMUM",
  Enabled = "ENABLED",
}

export interface SashLayoutProvider {}

export interface VerticalSashLayoutProvider extends SashLayoutProvider {
  getVerticalSashLeft(sash: Sash): number;
  getVerticalSashTop?(sash: Sash): number;
  getVerticalSashHeight?(sash: Sash): number;
}

export interface HorizontalSashLayoutProvider extends SashLayoutProvider {
  getHorizontalSashTop(sash: Sash): number;
  getHorizontalSashLeft?(sash: Sash): number;
  getHorizontalSashWidth?(sash: Sash): number;
}

export class Sash extends EventEmitter implements Disposable {
  private el: HTMLElement;
  private layoutProvider: SashLayoutProvider;
  private hidden: boolean;
  private orientation!: Orientation;
  private size: number;
  private hoverDelay = 300;
  private hoverDelayer = debounce(
    (el) => el.classList.add(styles.hover),
    this.hoverDelay
  );

  private _state: SashState = SashState.Enabled;
  get state(): SashState {
    return this._state;
  }
  set state(state: SashState) {
    if (this._state === state) {
      return;
    }

    this.el.classList.toggle(styles.disabled, state === SashState.Disabled);
    this.el.classList.toggle(styles.minimum, state === SashState.Minimum);
    this.el.classList.toggle(styles.maximum, state === SashState.Maximum);

    this._state = state;

    this.emit("enablementChange", state);
  }

  constructor(
    container: HTMLElement,
    layoutProvider: VerticalSashLayoutProvider,
    options: SashOptions
  );
  constructor(
    container: HTMLElement,
    layoutProvider: HorizontalSashLayoutProvider,
    options: SashOptions
  );
  constructor(
    container: HTMLElement,
    layoutProvider: SashLayoutProvider,
    options: SashOptions
  ) {
    super();

    this.el = document.createElement("div");
    this.el.classList.add(styles.sash);
    container.append(this.el);

    if (isMacintosh) {
      this.el.classList.add(styles.mac);
    }

    this.el.addEventListener("pointerdown", this.onPointerStart);
    this.el.addEventListener("dblclick", this.onPointerDoublePress);
    this.el.addEventListener("mouseenter", this.onMouseEnter);
    this.el.addEventListener("mouseleave", this.onMouseLeave);

    const cssStyleDeclaration = getComputedStyle(document.documentElement);

    const sashSize = parseInt(
      cssStyleDeclaration.getPropertyValue("--sash-size").trim(),
      10
    );

    this.size = isNaN(sashSize) ? 4 : sashSize;

    this.hidden = false;
    this.layoutProvider = layoutProvider;

    this.orientation = options.orientation ?? Orientation.Vertical;

    if (this.orientation === Orientation.Horizontal) {
      this.el.classList.add(styles.horizontal);
      this.el.classList.remove(styles.vertical);
    } else {
      this.el.classList.remove(styles.horizontal);
      this.el.classList.add(styles.vertical);
    }

    this.layout();
  }

  private onPointerStart = (event: PointerEvent) => {
    const startX = event.pageX;
    const startY = event.pageY;

    const startEvent: SashEvent = {
      startX,
      currentX: startX,
      startY,
      currentY: startY,
    };

    this.el.classList.add(styles.active);

    this.emit("start", startEvent);

    this.el.setPointerCapture(event.pointerId);

    const onPointerMove = (event: PointerEvent) => {
      event.preventDefault();

      const moveEvent: SashEvent = {
        startX,
        currentX: event.pageX,
        startY,
        currentY: event.pageY,
      };

      this.emit("change", moveEvent);
    };

    const onPointerUp = (event: PointerEvent): void => {
      event.preventDefault();

      this.el.classList.remove(styles.active);

      this.emit("end");

      this.el.releasePointerCapture(event.pointerId);

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  private onPointerDoublePress = (): void => {
    this.emit("reset");
  };

  private onMouseEnter = (): void => {
    if (this.el.classList.contains(styles.active)) {
      this.hoverDelayer.cancel();
      this.el.classList.add(styles.hover);
    } else {
      this.hoverDelayer(this.el);
    }
  };

  private onMouseLeave = (): void => {
    this.hoverDelayer.cancel();
    this.el.classList.remove(styles.hover);
  };

  public layout(): void {
    if (this.orientation === Orientation.Vertical) {
      const verticalProvider = this
        .layoutProvider as VerticalSashLayoutProvider;

      this.el.style.left =
        verticalProvider.getVerticalSashLeft(this) - this.size / 2 + "px";

      if (verticalProvider.getVerticalSashTop) {
        this.el.style.top = verticalProvider.getVerticalSashTop(this) + "px";
      }

      if (verticalProvider.getVerticalSashHeight) {
        this.el.style.height =
          verticalProvider.getVerticalSashHeight(this) + "px";
      }
    } else {
      const horizontalProvider = this
        .layoutProvider as HorizontalSashLayoutProvider;

      this.el.style.top =
        horizontalProvider.getHorizontalSashTop(this) - this.size / 2 + "px";

      if (horizontalProvider.getHorizontalSashLeft) {
        this.el.style.left =
          horizontalProvider.getHorizontalSashLeft(this) + "px";
      }

      if (horizontalProvider.getHorizontalSashWidth) {
        this.el.style.width =
          horizontalProvider.getHorizontalSashWidth(this) + "px";
      }
    }
  }

  show(): void {
    this.hidden = false;
    this.el.style.removeProperty("display");
    this.el.setAttribute("aria-hidden", "false");
  }

  hide(): void {
    this.hidden = true;
    this.el.style.display = "none";
    this.el.setAttribute("aria-hidden", "true");
  }

  public dispose(): void {
    this.el.removeEventListener("pointerdown", this.onPointerStart);
    this.el.removeEventListener("dblclick", this.onPointerDoublePress);
    this.el.removeEventListener("mouseenter", this.onMouseEnter);
    this.el.removeEventListener("mouseleave", () => this.onMouseLeave);

    this.el.remove();
  }
}
