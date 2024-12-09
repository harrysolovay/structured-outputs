import { declareType } from "./declareType.ts"
import type { Type } from "./Type.ts"

export { enum_ as enum }
function enum_<V extends Array<string>>(...values: V): Type<V[number]> {
  return declareType(() => ({
    type: "enum",
    value: {
      values,
    },
  }))
}
Object.defineProperty(enum_, "name", { value: "enum" })
