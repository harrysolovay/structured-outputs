import type { Arg, Param } from "./_.ts"
import type { Assertion } from "./Assertion.ts"
import type { Template } from "./Template.ts"

export type ContextPart = number | string | Template | Param | Arg | Assertion

// moderate

export * from "./_.ts"
export * from "./Assertion.ts"
export * from "./serializeCtx.ts"
export * from "./Template.ts"
