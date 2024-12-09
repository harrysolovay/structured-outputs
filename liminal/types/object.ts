import type { AnyType, Type } from "../Type.ts"
import { declare } from "./declare.ts"

export function object<F extends Record<number | string, AnyType>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["D"]> {
  const keys = Object.keys(fields)
  keys.sort()
  return declare({
    factory: object,
    args: [Object.fromEntries(keys.map((key) => [key, fields[key]]))],
  })
}
