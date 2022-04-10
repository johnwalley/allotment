/**
 * Checks if `string` ends with the given target string.
 */
export function endsWith(string: string, target: string): boolean {
  const length = string.length;

  const position = length - target.length;

  return position >= 0 && string.slice(position, length) === target;
}
