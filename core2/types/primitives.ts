import { declareType } from "./declareType.ts"
import type { Type } from "./Type.ts"

export const boolean: Type<boolean> = declareType(() => ({ type: "boolean" }))
export const integer: Type<number> = declareType(() => ({ type: "integer" }))
export const number: Type<number> = declareType(() => ({ type: "number" }))
export const string: Type<string> = declareType(() => ({ type: "string" }))
