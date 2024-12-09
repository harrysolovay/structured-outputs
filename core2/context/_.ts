export interface Param<K extends symbol = symbol, A = any> {
  (arg: A): Arg<K>
  type: "Param"
  key: K
}

export interface Arg<K extends symbol = symbol> {
  type: "Arg"
  key: K
  value: unknown
  serializer?: (value: any) => string
}

export function _<K extends symbol, V = string>(
  key: K,
  serializer?: (value: V) => string,
): Param<K, V> {
  return Object.assign(
    (value: V) => ({
      type: "Arg" as const,
      key,
      value,
      serializer,
    }),
    {
      type: "Param" as const,
      key,
    },
  )
}
