import type { Param } from "./Annotation.ts"

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
