import { assert } from "@std/assert"
import { isArg, isParam, Param, ParamKey } from "./_.ts"
import { Assertion, AssertionKey, isAssertion } from "./Assertion.ts"
import type { ContextPart } from "./ContextPart.ts"
import { isPin, Pin, PinKey } from "./Pin.ts"
import { isTemplate, Template, TemplateKey } from "./Template.ts"

export function serializeCtx(
  parts: Array<ContextPart>,
  parentArgs: Record<symbol, unknown>,
): string {
  const segments: Array<string> = []
  const args = { ...parentArgs }
  parts.forEach((part) => {
    if (isParam(part)) {
      const key = part[ParamKey]
      const arg = args[key]
      assert(arg) // TODO: message
      segments.push(JSON.stringify(arg))
    }
  })
  return segments.join(" ")
}
