import { recombine } from "../../util/mod.ts"
import type { ContextPart } from "./mod.ts"

export function serializeCtx(
  parts: Array<ContextPart>,
  parentArgs: Record<symbol, string>,
): Array<string> {
  const segments: Array<string> = []
  const args = { ...parentArgs }
  parts.forEach((part) => {
    if (typeof part === "number") {
      segments.push(part.toString())
    } else if (typeof part === "string") {
      segments.push(part)
    } else {
      switch (part.type) {
        case "Template": {
          segments.push(recombine(part.template, serializeCtx(part.ctx, args)))
          break
        }
        case "Param": {
          const arg = args[part.key]
          if (typeof arg === "string") {
            segments.push(arg)
          }
          break
        }
        case "Arg": {
          args[part.key] = part.serializer?.(part.value) ?? part.value as string
          break
        }
        case "Assertion": {
          const { description, args } = part
          const segment = typeof description === "string" ? description : description?.(...args)
          if (segment) {
            segments.push(segment)
          }
          break
        }
      }
    }
  })
  return segments
}
