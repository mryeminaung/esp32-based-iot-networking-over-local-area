/**
 * Merge class names, filtering out falsy values.
 * Lightweight alternative to clsx/twMerge.
 */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
