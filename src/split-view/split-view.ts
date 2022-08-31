import EventEmitter from "eventemitter3";
import clamp from "lodash.clamp";

import styles from "../allotment.module.css";
import { pushToEnd, pushToStart, range } from "../helpers/array";
import { Disposable } from "../helpers/disposable";
import {
  Orientation,
  Sash,
  SashEvent as BaseSashEvent,
  SashState,
} from "../sash";

interface SashEvent {
  readonly sash: Sash;
  readonly start: number;
  readonly current: number;
}

/**
 * When adding or removing views, distribute the delta space among
 * all other views.
 */
export type DistributeSizing = { type: "distribute" };

/**
 * When adding or removing views, split the delta space with another
 * specific view, indexed by the provided `index`.
 */
export type SplitSizing = { type: "split"; index: number };

/**
 * When adding or removing views, assume the view is invisible.
 */
export type InvisibleSizing = { type: "invisible"; cachedVisibleSize: number };

/**
 * When adding or removing views, the sizing provides fine grained
 * control over how other views get resized.
 */
export type Sizing = DistributeSizing | SplitSizing | InvisibleSizing;

export namespace Sizing {
  /**
   * When adding or removing views, distribute the delta space among
   * all other views.
   */
  export const Distribute: DistributeSizing = { type: "distribute" };

  /**
   * When adding or removing views, split the delta space with another
   * specific view, indexed by the provided `index`.
   */
  export function Split(index: number): SplitSizing {
    return { type: "split", index };
  }

  /**
   * When adding or removing views, assume the view is invisible.
   */
  export function Invisible(cachedVisibleSize: number): InvisibleSizing {
    return { type: "invisible", cachedVisibleSize };
  }
}

/** A descriptor for a {@link SplitView} instance. */
export interface SplitViewDescriptor {
  /** The layout size of the {@link SplitView}. */
  size: number;

  /**
   * Descriptors for each {@link View view}.
   */
  views: {
    /** Whether the {@link View view} is visible. */
    visible?: boolean;

    /** The size of the {@link View view}. */
    size: number;

    container: HTMLElement;
    view: View;
  }[];
}

export interface SplitViewOptions {
  /** Which axis the views align on. */
  readonly orientation?: Orientation;

  /** Resize each view proportionally when resizing the SplitView. */
  readonly proportionalLayout?: boolean;

  /**
   * An initial description of this {@link SplitView} instance, allowing
   * to initialze all views within the ctor.
   */
  readonly descriptor?: SplitViewDescriptor;

  /** Override the orthogonal size of sashes. */
  readonly getSashOrthogonalSize?: () => number;
}

export enum LayoutPriority {
  Normal = "NORMAL",
  Low = "LOW",
  High = "HIGH",
}

/**
 * The interface to implement for views within a {@link SplitView}.
 */
export interface View {
  /** The DOM element for this view. */
  readonly element: HTMLElement;

  /**
   * A minimum size for this view.
   *
   * @remarks If none, set it to `0`.
   */
  readonly minimumSize: number;

  /**
   * A minimum size for this view.
   *
   * @remarks If none, set it to `Number.POSITIVE_INFINITY`.
   */
  readonly maximumSize: number;

  /**
   * The priority of the view when the {@link SplitView.resize layout} algorithm
   * runs. Views with higher priority will be resized first.
   *
   * @remarks Only used when `proportionalLayout` is false.
   */
  readonly priority?: LayoutPriority;

  /**
   * Whether the view will snap whenever the user reaches its minimum size or
   * attempts to grow it beyond the minimum size.
   */
  readonly snap?: boolean;

  /**
   * This will be called by the {@link SplitView} during layout. A view meant to
   * pass along the layout information down to its descendants.
   *
   * @param size The size of this view, in pixels.
   * @param offset The offset of this view, relative to the start of the {@link SplitView}.
   */
  layout(size: number, offset: number): void;

  /**
   * This will be called by the {@link SplitView} whenever this view is made
   * visible or hidden.
   *
   * @param visible Whether the view becomes visible.
   */
  setVisible?(visible: boolean): void;
}

type ViewItemSize = number | { cachedVisibleSize: number };

abstract class ViewItem {
  protected container: HTMLElement;
  public view: View;
  private _size: number;

  constructor(container: HTMLElement, view: View, size: ViewItemSize) {
    this.container = container;
    this.view = view;

    this.container.classList.add("split-view-view", styles.splitViewView);
    this.container.dataset.testid = "split-view-view";

    if (typeof size === "number") {
      this._size = size;
      this._cachedVisibleSize = undefined;
      container.classList.add("split-view-view-visible");
    } else {
      this._size = 0;
      this._cachedVisibleSize = size.cachedVisibleSize;
    }
  }

  set size(size: number) {
    this._size = size;
  }

  get size(): number {
    return this._size;
  }

  get priority(): LayoutPriority | undefined {
    return this.view.priority;
  }

  get snap(): boolean {
    return !!this.view.snap;
  }

  private _cachedVisibleSize: number | undefined = undefined;
  get cachedVisibleSize(): number | undefined {
    return this._cachedVisibleSize;
  }

  get visible(): boolean {
    return typeof this._cachedVisibleSize === "undefined";
  }

  public setVisible(visible: boolean, size?: number): void {
    if (visible === this.visible) {
      return;
    }

    if (visible) {
      this.size = clamp(
        this._cachedVisibleSize!,
        this.viewMinimumSize,
        this.viewMaximumSize
      );
      this._cachedVisibleSize = undefined;
    } else {
      this._cachedVisibleSize = typeof size === "number" ? size : this.size;
      this.size = 0;
    }

    this.container.classList.toggle("split-view-view-visible", visible);

    if (this.view.setVisible) {
      this.view.setVisible(visible);
    }
  }

  get minimumSize(): number {
    return this.visible ? this.view.minimumSize : 0;
  }
  get viewMinimumSize(): number {
    return this.view.minimumSize;
  }

  get maximumSize(): number {
    return this.visible ? this.view.maximumSize : 0;
  }
  get viewMaximumSize(): number {
    return this.view.maximumSize;
  }

  set enabled(enabled: boolean) {
    this.container.style.pointerEvents = enabled ? "" : "none";
  }

  layout(offset: number): void {
    this.layoutContainer(offset);
    this.view.layout(this.size, offset);
  }

  abstract layoutContainer(offset: number): void;
}

class HorizontalViewItem extends ViewItem {
  layoutContainer(offset: number): void {
    this.container.style.left = `${offset}px`;
    this.container.style.width = `${this.size}px`;
  }
}

class VerticalViewItem extends ViewItem {
  layoutContainer(offset: number): void {
    this.container.style.top = `${offset}px`;
    this.container.style.height = `${this.size}px`;
  }
}

interface SashItem {
  sash: Sash;
}

interface SashDragSnapState {
  readonly index: number;
  readonly limitDelta: number;
  readonly size: number;
}

interface SashDragState {
  index: number;
  start: number;
  current: number;
  sizes: number[];
  minDelta: number;
  maxDelta: number;
  snapBefore: SashDragSnapState | undefined;
  snapAfter: SashDragSnapState | undefined;
}

/**
 * The {@link SplitView} is the UI component which implements a one dimensional
 * flex-like layout algorithm for a collection of {@link View} instances, which
 * are essentially HTMLElement instances with the following size constraints:
 *
 * - {@link View.minimumSize}
 * - {@link View.maximumSize}
 * - {@link View.snap}
 *
 * In case the SplitView doesn't have enough size to fit all views, it will overflow
 * its content with a scrollbar.
 *
 * In between each pair of views there will be a {@link Sash} allowing the user
 * to resize the views, making sure the constraints are respected.
 */
export class SplitView extends EventEmitter implements Disposable {
  public onDidChange: ((sizes: number[]) => void) | undefined;

  /**  This {@link SplitView}'s orientation. */
  readonly orientation: Orientation;

  private sashContainer: HTMLElement;
  private size = 0;
  private contentSize = 0;
  private proportions: undefined | number[] = undefined;
  private viewItems: ViewItem[] = [];
  private sashItems: SashItem[] = [];
  private sashDragState: SashDragState | undefined;
  private proportionalLayout: boolean;
  private readonly getSashOrthogonalSize: { (): number } | undefined;

  private _startSnappingEnabled = true;
  get startSnappingEnabled(): boolean {
    return this._startSnappingEnabled;
  }

  /**
   * Enable/disable snapping at the beginning of this {@link SplitView}.
   */
  set startSnappingEnabled(startSnappingEnabled: boolean) {
    if (this._startSnappingEnabled === startSnappingEnabled) {
      return;
    }

    this._startSnappingEnabled = startSnappingEnabled;
    this.updateSashEnablement();
  }

  private _endSnappingEnabled = true;
  get endSnappingEnabled(): boolean {
    return this._endSnappingEnabled;
  }

  /**
   * Enable/disable snapping at the end of this {@link SplitView}.
   */
  set endSnappingEnabled(endSnappingEnabled: boolean) {
    if (this._endSnappingEnabled === endSnappingEnabled) {
      return;
    }

    this._endSnappingEnabled = endSnappingEnabled;
    this.updateSashEnablement();
  }

  /** Create a new {@link SplitView} instance. */
  constructor(
    container: HTMLElement,
    options: SplitViewOptions = {},
    onDidChange?: (sizes: number[]) => void
  ) {
    super();

    this.orientation = options.orientation ?? Orientation.Vertical;
    this.proportionalLayout = options.proportionalLayout ?? true;
    this.getSashOrthogonalSize = options.getSashOrthogonalSize;

    if (onDidChange) {
      this.onDidChange = onDidChange;
    }

    this.sashContainer = document.createElement("div");

    this.sashContainer.classList.add("sash-container", styles.sashContainer);
    container.prepend(this.sashContainer); // Should always be first child

    // We have an existing set of view, add them now
    if (options.descriptor) {
      this.size = options.descriptor.size;

      for (const [
        index,
        viewDescriptor,
      ] of options.descriptor.views.entries()) {
        const size = viewDescriptor.size;

        const container = viewDescriptor.container;
        const view = viewDescriptor.view;

        this.addView(container, view, size, index, true);
      }

      // Initialize content size and proportions for first layout
      this.contentSize = this.viewItems.reduce((r, i) => r + i.size, 0);
      this.saveProportions();
    }
  }

  /**
   * Add a {@link View view} to this {@link SplitView}.
   *
   * @param container The container element.
   * @param view The view to add.
   * @param size Either a fixed size, or a dynamic {@link Sizing} strategy.
   * @param index The index to insert the view on.
   * @param skipLayout Whether layout should be skipped.
   */
  public addView(
    container: HTMLElement,
    view: View,
    size: number | Sizing,
    index = this.viewItems.length,
    skipLayout?: boolean
  ) {
    let viewSize: ViewItemSize;

    if (typeof size === "number") {
      viewSize = size;
    } else if (size.type === "split") {
      viewSize = this.getViewSize(size.index) / 2;
    } else if (size.type === "invisible") {
      viewSize = { cachedVisibleSize: size.cachedVisibleSize };
    } else {
      viewSize = view.minimumSize;
    }

    const item =
      this.orientation === Orientation.Vertical
        ? new VerticalViewItem(container, view, viewSize)
        : new HorizontalViewItem(container, view, viewSize);

    this.viewItems.splice(index, 0, item);

    if (this.viewItems.length > 1) {
      const sash =
        this.orientation === Orientation.Vertical
          ? new Sash(
              this.sashContainer,
              {
                getHorizontalSashTop: (s) => this.getSashPosition(s),
                getHorizontalSashWidth: this.getSashOrthogonalSize,
              },
              { orientation: Orientation.Horizontal }
            )
          : new Sash(
              this.sashContainer,
              {
                getVerticalSashLeft: (s) => this.getSashPosition(s),
                getVerticalSashHeight: this.getSashOrthogonalSize,
              },
              { orientation: Orientation.Vertical }
            );

      const sashEventMapper =
        this.orientation === Orientation.Vertical
          ? (e: BaseSashEvent) => ({
              sash,
              start: e.startY,
              current: e.currentY,
            })
          : (e: BaseSashEvent) => ({
              sash,
              start: e.startX,
              current: e.currentX,
            });

      sash.on("start", (event: BaseSashEvent) =>
        this.onSashStart(sashEventMapper(event))
      );

      sash.on("change", (event: BaseSashEvent) =>
        this.onSashChange(sashEventMapper(event))
      );

      sash.on("end", () =>
        this.onSashEnd(this.sashItems.findIndex((item) => item.sash === sash))
      );

      sash.on("reset", () => {
        const index = this.sashItems.findIndex((item) => item.sash === sash);
        const upIndexes = range(index, -1, -1);
        const downIndexes = range(index + 1, this.viewItems.length);
        const snapBeforeIndex = this.findFirstSnapIndex(upIndexes);
        const snapAfterIndex = this.findFirstSnapIndex(downIndexes);

        if (
          typeof snapBeforeIndex === "number" &&
          !this.viewItems[snapBeforeIndex].visible
        ) {
          return;
        }

        if (
          typeof snapAfterIndex === "number" &&
          !this.viewItems[snapAfterIndex].visible
        ) {
          return;
        }

        this.emit("sashreset", index);
      });

      const sashItem: SashItem = { sash };

      this.sashItems.splice(index - 1, 0, sashItem);
    }

    if (!skipLayout) {
      this.relayout();
    }

    if (!skipLayout && typeof size !== "number" && size.type === "distribute") {
      this.distributeViewSizes();
    }
  }

  /**
   * Remove a {@link View view} from this {@link SplitView}.
   *
   * @param index The index where the {@link View view} is located.
   * @param sizing Whether to distribute other {@link View view}'s sizes.
   */
  public removeView(index: number, sizing?: Sizing): View {
    if (index < 0 || index >= this.viewItems.length) {
      throw new Error("Index out of bounds");
    }

    // Remove view
    const viewItem = this.viewItems.splice(index, 1)[0];
    const view = viewItem.view;

    // Remove sash
    if (this.viewItems.length >= 1) {
      const sashIndex = Math.max(index - 1, 0);
      const sashItem = this.sashItems.splice(sashIndex, 1)[0];
      sashItem.sash.dispose();
    }

    this.relayout();

    if (sizing && sizing.type === "distribute") {
      this.distributeViewSizes();
    }

    return view;
  }

  /**
   * Move a {@link View view} to a different index.
   *
   * @param from The source index.
   * @param to The target index.
   */
  public moveView(container: HTMLElement, from: number, to: number): void {
    const cachedVisibleSize = this.getViewCachedVisibleSize(from);

    const sizing =
      typeof cachedVisibleSize === "undefined"
        ? this.getViewSize(from)
        : Sizing.Invisible(cachedVisibleSize);

    const view = this.removeView(from);
    this.addView(container, view, sizing, to);
  }

  /**
   * Returns the {@link View view}'s size previously to being hidden.
   *
   * @param index The {@link View view} index.
   */
  private getViewCachedVisibleSize(index: number): number | undefined {
    if (index < 0 || index >= this.viewItems.length) {
      throw new Error("Index out of bounds");
    }

    const viewItem = this.viewItems[index];
    return viewItem.cachedVisibleSize;
  }

  /**
   * Layout the {@link SplitView}.
   *
   * @param size The entire size of the {@link SplitView}.
   */
  public layout(size: number = this.size): void {
    const previousSize = Math.max(this.size, this.contentSize);
    this.size = size;

    if (!this.proportions) {
      const indexes = range(0, this.viewItems.length);

      const lowPriorityIndexes = indexes.filter(
        (i) => this.viewItems[i].priority === LayoutPriority.Low
      );

      const highPriorityIndexes = indexes.filter(
        (i) => this.viewItems[i].priority === LayoutPriority.High
      );

      this.resize(
        this.viewItems.length - 1,
        size - previousSize,
        undefined,
        lowPriorityIndexes,
        highPriorityIndexes
      );
    } else {
      for (let i = 0; i < this.viewItems.length; i++) {
        const item = this.viewItems[i];

        item.size = clamp(
          Math.round(this.proportions[i] * size),
          item.minimumSize,
          item.maximumSize
        );
      }
    }

    this.distributeEmptySpace();
    this.layoutViews();
  }

  /**
   * Resize a {@link View view} within the {@link SplitView}.
   *
   * @param index The {@link View view} index.
   * @param size The {@link View view} size.
   */
  public resizeView(index: number, size: number): void {
    if (index < 0 || index >= this.viewItems.length) {
      return;
    }

    const indexes = range(0, this.viewItems.length).filter((i) => i !== index);

    const lowPriorityIndexes = [
      ...indexes.filter(
        (i) => this.viewItems[i].priority === LayoutPriority.Low
      ),
      index,
    ];

    const highPriorityIndexes = indexes.filter(
      (i) => this.viewItems[i].priority === LayoutPriority.High
    );

    const item = this.viewItems[index];
    size = Math.round(size);
    size = clamp(size, item.minimumSize, Math.min(item.maximumSize, this.size));

    item.size = size;
    this.relayout(lowPriorityIndexes, highPriorityIndexes);
  }

  public resizeViews(sizes: number[]): void {
    for (let index = 0; index < sizes.length; index++) {
      const item = this.viewItems[index];
      let size = sizes[index];

      size = Math.round(size);

      size = clamp(
        size,
        item.minimumSize,
        Math.min(item.maximumSize, this.size)
      );

      item.size = size;
    }

    this.contentSize = this.viewItems.reduce((r, i) => r + i.size, 0);
    this.saveProportions();
    this.layout(this.size);
  }

  /**
   * Returns the size of a {@link View view}.
   */
  public getViewSize(index: number): number {
    if (index < 0 || index >= this.viewItems.length) {
      return -1;
    }

    return this.viewItems[index].size;
  }

  /**
   * Returns whether the {@link View view} is visible.
   *
   * @param index The {@link View view} index.
   */
  isViewVisible(index: number): boolean {
    if (index < 0 || index >= this.viewItems.length) {
      throw new Error("Index out of bounds");
    }

    const viewItem = this.viewItems[index];
    return viewItem.visible;
  }

  /**
   * Set a {@link View view}'s visibility.
   *
   * @param index The {@link View view} index.
   * @param visible Whether the {@link View view} should be visible.
   */
  setViewVisible(index: number, visible: boolean): void {
    if (index < 0 || index >= this.viewItems.length) {
      throw new Error("Index out of bounds");
    }

    const viewItem = this.viewItems[index];
    viewItem.setVisible(visible);

    this.distributeEmptySpace(index);
    this.layoutViews();
    this.saveProportions();
  }

  /**
   * Distribute the entire {@link SplitView} size among all {@link View views}.
   */
  public distributeViewSizes(): void {
    const flexibleViewItems: ViewItem[] = [];
    let flexibleSize = 0;

    for (const item of this.viewItems) {
      if (item.maximumSize - item.minimumSize > 0) {
        flexibleViewItems.push(item);
        flexibleSize += item.size;
      }
    }

    const size = Math.floor(flexibleSize / flexibleViewItems.length);

    for (const item of flexibleViewItems) {
      item.size = clamp(size, item.minimumSize, item.maximumSize);
    }

    const indexes = range(0, this.viewItems.length);

    const lowPriorityIndexes = indexes.filter(
      (i) => this.viewItems[i].priority === LayoutPriority.Low
    );

    const highPriorityIndexes = indexes.filter(
      (i) => this.viewItems[i].priority === LayoutPriority.High
    );

    this.relayout(lowPriorityIndexes, highPriorityIndexes);
  }

  public dispose(): void {
    this.sashItems.forEach((sashItem) => sashItem.sash.dispose());
    this.sashItems = [];

    this.sashContainer.remove();
  }

  private relayout(
    lowPriorityIndexes?: number[],
    highPriorityIndexes?: number[]
  ): void {
    const contentSize = this.viewItems.reduce((r, i) => r + i.size, 0);

    this.resize(
      this.viewItems.length - 1,
      this.size - contentSize,
      undefined,
      lowPriorityIndexes,
      highPriorityIndexes
    );

    this.distributeEmptySpace();
    this.layoutViews();
    this.saveProportions();
  }

  private onSashStart({ sash, start }: SashEvent): void {
    const index = this.sashItems.findIndex((item) => item.sash === sash);

    const resetSashDragState = (start: number) => {
      const sizes = this.viewItems.map((i) => i.size);

      let minDelta = Number.NEGATIVE_INFINITY;
      let maxDelta = Number.POSITIVE_INFINITY;

      let snapBefore: SashDragSnapState | undefined;
      let snapAfter: SashDragSnapState | undefined;

      const upIndexes = range(index, -1, -1);
      const downIndexes = range(index + 1, this.viewItems.length);

      const minDeltaUp = upIndexes.reduce(
        (r, i) => r + (this.viewItems[i].minimumSize - sizes[i]),
        0
      );

      const maxDeltaUp = upIndexes.reduce(
        (r, i) => r + (this.viewItems[i].viewMaximumSize - sizes[i]),
        0
      );

      const maxDeltaDown =
        downIndexes.length === 0
          ? Number.POSITIVE_INFINITY
          : downIndexes.reduce(
              (r, i) => r + (sizes[i] - this.viewItems[i].minimumSize),
              0
            );

      const minDeltaDown =
        downIndexes.length === 0
          ? Number.NEGATIVE_INFINITY
          : downIndexes.reduce(
              (r, i) => r + (sizes[i] - this.viewItems[i].viewMaximumSize),
              0
            );

      minDelta = Math.max(minDeltaUp, minDeltaDown);
      maxDelta = Math.min(maxDeltaDown, maxDeltaUp);

      const snapBeforeIndex = this.findFirstSnapIndex(upIndexes);
      const snapAfterIndex = this.findFirstSnapIndex(downIndexes);

      if (typeof snapBeforeIndex === "number") {
        const viewItem = this.viewItems[snapBeforeIndex];
        const halfSize = Math.floor(viewItem.viewMinimumSize / 2);

        snapBefore = {
          index: snapBeforeIndex,
          limitDelta: viewItem.visible
            ? minDelta - halfSize
            : minDelta + halfSize,
          size: viewItem.size,
        };
      }

      if (typeof snapAfterIndex === "number") {
        const viewItem = this.viewItems[snapAfterIndex];
        const halfSize = Math.floor(viewItem.viewMinimumSize / 2);

        snapAfter = {
          index: snapAfterIndex,
          limitDelta: viewItem.visible
            ? maxDelta + halfSize
            : maxDelta - halfSize,
          size: viewItem.size,
        };
      }

      this.sashDragState = {
        start,
        current: start,
        index,
        sizes,
        minDelta,
        maxDelta,
        snapBefore,
        snapAfter,
      };
    };

    resetSashDragState(start);
  }

  private onSashChange({ current }: SashEvent): void {
    const { index, start, sizes, minDelta, maxDelta, snapBefore, snapAfter } =
      this.sashDragState!;

    this.sashDragState!.current = current;

    const delta = current - start;

    // TODO: Should this be conditional on alt?
    this.resize(
      index,
      delta,
      sizes,
      undefined,
      undefined,
      minDelta,
      maxDelta,
      snapBefore,
      snapAfter
    );

    this.distributeEmptySpace();
    this.layoutViews();
  }

  private onSashEnd = (index: number): void => {
    this.emit("sashchange", index);
    this.saveProportions();

    for (const item of this.viewItems) {
      item.enabled = true;
    }
  };

  private getSashPosition(sash: Sash): number {
    let position = 0;

    for (let i = 0; i < this.sashItems.length; i++) {
      position += this.viewItems[i].size;

      if (this.sashItems[i].sash === sash) {
        return position;
      }
    }

    return 0;
  }

  private resize(
    index: number,
    delta: number,
    sizes = this.viewItems.map((i) => i.size),
    lowPriorityIndexes?: number[],
    highPriorityIndexes?: number[],
    overloadMinDelta: number = Number.NEGATIVE_INFINITY,
    overloadMaxDelta: number = Number.POSITIVE_INFINITY,
    snapBefore?: SashDragSnapState,
    snapAfter?: SashDragSnapState
  ): number {
    if (index < 0 || index >= this.viewItems.length) {
      return 0;
    }

    const upIndexes = range(index, -1, -1);
    const downIndexes = range(index + 1, this.viewItems.length);

    if (highPriorityIndexes) {
      for (const index of highPriorityIndexes) {
        pushToStart(upIndexes, index);
        pushToStart(downIndexes, index);
      }
    }

    if (lowPriorityIndexes) {
      for (const index of lowPriorityIndexes) {
        pushToEnd(upIndexes, index);
        pushToEnd(downIndexes, index);
      }
    }

    const upItems = upIndexes.map((i) => this.viewItems[i]);
    const upSizes = upIndexes.map((i) => sizes[i]);

    const downItems = downIndexes.map((i) => this.viewItems[i]);
    const downSizes = downIndexes.map((i) => sizes[i]);

    const minDeltaUp = upIndexes.reduce(
      (r, i) => r + (this.viewItems[i].minimumSize - sizes[i]),
      0
    );

    const maxDeltaUp = upIndexes.reduce(
      (r, i) => r + (this.viewItems[i].maximumSize - sizes[i]),
      0
    );

    const maxDeltaDown =
      downIndexes.length === 0
        ? Number.POSITIVE_INFINITY
        : downIndexes.reduce(
            (r, i) => r + (sizes[i] - this.viewItems[i].minimumSize),
            0
          );

    const minDeltaDown =
      downIndexes.length === 0
        ? Number.NEGATIVE_INFINITY
        : downIndexes.reduce(
            (r, i) => r + (sizes[i] - this.viewItems[i].maximumSize),
            0
          );

    const minDelta = Math.max(minDeltaUp, minDeltaDown, overloadMinDelta);
    const maxDelta = Math.min(maxDeltaDown, maxDeltaUp, overloadMaxDelta);

    let snapped = false;

    if (snapBefore) {
      const snapView = this.viewItems[snapBefore.index];
      const visible = delta >= snapBefore.limitDelta;
      snapped = visible !== snapView.visible;
      snapView.setVisible(visible, snapBefore.size);
    }

    if (!snapped && snapAfter) {
      const snapView = this.viewItems[snapAfter.index];
      const visible = delta < snapAfter.limitDelta;
      snapped = visible !== snapView.visible;
      snapView.setVisible(visible, snapAfter.size);
    }

    if (snapped) {
      return this.resize(
        index,
        delta,
        sizes,
        lowPriorityIndexes,
        highPriorityIndexes,
        overloadMinDelta,
        overloadMaxDelta
      );
    }

    delta = clamp(delta, minDelta, maxDelta);

    for (let i = 0, deltaUp = delta; i < upItems.length; i++) {
      const item = upItems[i];

      const size = clamp(
        upSizes[i] + deltaUp,
        item.minimumSize,
        item.maximumSize
      );

      const viewDelta = size - upSizes[i];

      deltaUp -= viewDelta;

      item.size = size;
    }

    for (let i = 0, deltaDown = delta; i < downItems.length; i++) {
      const item = downItems[i];

      const size = clamp(
        downSizes[i] - deltaDown,
        item.minimumSize,
        item.maximumSize
      );

      const viewDelta = size - downSizes[i];

      deltaDown += viewDelta;
      item.size = size;
    }

    return delta;
  }

  private distributeEmptySpace(lowPriorityIndex?: number): void {
    const contentSize = this.viewItems.reduce((r, i) => r + i.size, 0);
    let emptyDelta = this.size - contentSize;

    const indexes = range(this.viewItems.length - 1, -1, -1);

    if (typeof lowPriorityIndex === "number") {
      pushToEnd(indexes, lowPriorityIndex);
    }

    for (let i = 0; emptyDelta !== 0 && i < indexes.length; i++) {
      const item = this.viewItems[indexes[i]];
      const size = clamp(
        item.size + emptyDelta,
        item.minimumSize,
        item.maximumSize
      );

      const viewDelta = size - item.size;

      emptyDelta -= viewDelta;
      item.size = size;
    }
  }

  private layoutViews(): void {
    // Save new content size
    this.contentSize = this.viewItems.reduce((r, i) => r + i.size, 0);

    // Layout views
    let offset = 0;

    for (const viewItem of this.viewItems) {
      viewItem.layout(offset);
      offset += viewItem.size;
    }

    this.onDidChange?.(this.viewItems.map((viewItem) => viewItem.size));

    // Layout sashes
    this.sashItems.forEach((item) => item.sash.layout());
    this.updateSashEnablement();
  }

  private saveProportions(): void {
    if (this.proportionalLayout && this.contentSize > 0) {
      this.proportions = this.viewItems.map((i) => i.size / this.contentSize);
    }
  }

  private updateSashEnablement(): void {
    let previous = false;

    const collapsesDown = this.viewItems.map(
      (i) => (previous = i.size - i.minimumSize > 0 || previous)
    );

    previous = false;

    const expandsDown = this.viewItems.map(
      (i) => (previous = i.maximumSize - i.size > 0 || previous)
    );

    const reverseViews = [...this.viewItems].reverse();

    previous = false;

    const collapsesUp = reverseViews
      .map((i) => (previous = i.size - i.minimumSize > 0 || previous))
      .reverse();

    previous = false;

    const expandsUp = reverseViews
      .map((i) => (previous = i.maximumSize - i.size > 0 || previous))
      .reverse();

    let position = 0;

    for (let index = 0; index < this.sashItems.length; index++) {
      const { sash } = this.sashItems[index];
      const viewItem = this.viewItems[index];

      position += viewItem.size;

      const min = !(collapsesDown[index] && expandsUp[index + 1]);
      const max = !(expandsDown[index] && collapsesUp[index + 1]);

      if (min && max) {
        const upIndexes = range(index, -1, -1);
        const downIndexes = range(index + 1, this.viewItems.length);
        const snapBeforeIndex = this.findFirstSnapIndex(upIndexes);
        const snapAfterIndex = this.findFirstSnapIndex(downIndexes);

        const snappedBefore =
          typeof snapBeforeIndex === "number" &&
          !this.viewItems[snapBeforeIndex].visible;

        const snappedAfter =
          typeof snapAfterIndex === "number" &&
          !this.viewItems[snapAfterIndex].visible;

        if (
          snappedBefore &&
          collapsesUp[index] &&
          (position > 0 || this.startSnappingEnabled)
        ) {
          sash.state = SashState.Minimum;
        } else if (
          snappedAfter &&
          collapsesDown[index] &&
          (position < this.contentSize || this.endSnappingEnabled)
        ) {
          sash.state = SashState.Maximum;
        } else {
          sash.state = SashState.Disabled;
        }
      } else if (min && !max) {
        sash.state = SashState.Minimum;
      } else if (!min && max) {
        sash.state = SashState.Maximum;
      } else {
        sash.state = SashState.Enabled;
      }
    }
  }

  private findFirstSnapIndex(indexes: number[]): number | undefined {
    for (const index of indexes) {
      const viewItem = this.viewItems[index];

      if (!viewItem.visible) {
        continue;
      }

      if (viewItem.snap) {
        return index;
      }
    }

    for (const index of indexes) {
      const viewItem = this.viewItems[index];

      if (viewItem.visible && viewItem.maximumSize - viewItem.minimumSize > 0) {
        return undefined;
      }

      if (!viewItem.visible && viewItem.snap) {
        return index;
      }
    }

    return undefined;
  }
}
