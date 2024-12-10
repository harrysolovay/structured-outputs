import type { Assert, Fqn } from "./Annotation.ts"

export function assert<T, A extends unknown[]>(
  fqn: Fqn,
  f: (value: T, ...args: A) => void | Promise<void>,
  ...args: A
): Assert<T> {
  return {
    type: "Assert",
    fqn,
    f,
    args,
  }
}
