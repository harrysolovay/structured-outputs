import type { Type } from "../Type.ts"
import { declare } from "./declare.ts"

export function option<T, D extends symbol>(some: Type<T, D>): Type<T | null, D> {
  return declare({
    factory: option,
    args: [some],
  })
}
