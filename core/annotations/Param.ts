export interface Param<K extends symbol = symbol, A = any, T = any> {
  (arg: A): Arg<K, T>
  type: "Param"
  key: K
}

export type AnyParam<T> = Param<symbol, any, T>

export interface Arg<K extends symbol = symbol, T = any> {
  type: "Arg"
  key: K
  value: T
}

export function Param<K extends symbol, A, T>(
  key: K,
  f: (value: A) => T,
): Param<K, A, T> {
  return Object.assign(
    (value: A): Arg<K> => ({
      type: "Arg",
      key,
      value: f(value),
    }),
    {
      type: "Param" as const,
      key,
    },
  )
}
