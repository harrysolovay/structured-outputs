import type { Type } from "../Type.ts"
import { declare } from "./declare.ts"

export function array<T, D extends symbol>(element: Type<T, D>): Type<Array<T>, D> {
  return declare({
    factory: array,
    args: [element],
  })
}
