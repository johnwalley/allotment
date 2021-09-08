export function range(start: number, stop: number, step: number = 1): number[] {
  const n = Math.max(0, Math.ceil((stop - start) / step));
  const range = new Array(n);

  let i = -1;

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}
