export const AssertionKey: unique symbol = Symbol("Liminal:Assertion")

export interface Assertion {
  [AssertionKey]: true
  name: string
  f: (value: any, ...args: any[]) => void | Promise<void>
  args: unknown[]
}

export function Assertion<T, A extends Array<unknown>>(
  name: string,
  f: (value: T, ...args: A) => void | Promise<void>,
  ...args: A
): Assertion {
  return {
    [AssertionKey]: true,
    name,
    f,
    args,
  }
}

export function isAssertion(value: unknown): value is Assertion {
  return typeof value === "object" && value !== null && AssertionKey in value
}
