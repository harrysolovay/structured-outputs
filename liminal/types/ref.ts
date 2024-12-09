import type { Type } from "../Type.ts"
import { declare } from "./declare.ts"

export function ref<T, D extends symbol>(getter: () => Type<T, D>): Type<T, D> {
  return declare({
    factory: ref,
    args: [getter],
  })
}
