/**
 * Pushes an element to the end of the array, if found.
 */
export function pushToEnd<T>(arr: T[], value: T): void {
  const index = arr.indexOf(value);

  if (index > -1) {
    arr.splice(index, 1);
    arr.push(value);
  }
}

/**
 * Returns an array containing an arithmetic progression.
 *
 * @param start Specifies the range’s initial value. The start is inclusive (included in the returned array)
 * @param stop The stop value is exclusive; it is not included in the result
 * @param step If step is positive, the last element is the largest start + i * step less than stop; if step is negative, the last element is the smallest start + i * step greater than stop
 */
export function range(start: number, stop: number, step: number = 1): number[] {
  const n = Math.max(0, Math.ceil((stop - start) / step));
  const range = new Array(n);

  let i = -1;

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}

/**
 * Creates an array from an item with the specified length
 *
 * @param item Any item
 * @param length The length of the resulting array
 * @returns An array of the item repeated length times
 */
export function repeat<T>(item: T, length: number): T[] {
  return Array.from(Array(length)).map(() => item);
}
