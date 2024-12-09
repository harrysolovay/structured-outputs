import type { Type } from "../Type.ts"
import { declare } from "./declare.ts"

function enum_<V extends Array<string>>(...values: V): Type<V[number], never> {
  const sorted = [...values]
  sorted.sort()
  return declare({
    factory: enum_,
    args: sorted,
  })
}
Object.defineProperty(enum_, "name", { value: "enum" })
export { enum_ as enum }
