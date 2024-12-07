import type { Arg, Param } from "./_.ts"
import type { Assertion } from "./Assertion.ts"
import type { Pin } from "./Pin.ts"
import type { Template } from "./Template.ts"

export type ContextPart =
  | string
  | Template
  | Param<symbol, any>
  | Arg<symbol>
  | Assertion
  | Pin<unknown>
