export class LayoutService {
  private _size!: number;

  public getSize() {
    return this._size;
  }

  public setSize(size: number) {
    this._size = size;
  }
}
