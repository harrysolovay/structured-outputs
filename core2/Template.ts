import type { ContextPart } from "./mod.ts"

export const TemplateKey: unique symbol = Symbol("Liminal:Template")

export interface Template {
  [TemplateKey]: TemplateStringsArray
  ctx: Array<ContextPart>
}

export function isTemplate(value: unknown): value is Template {
  return typeof value === "object" && value !== null && TemplateKey in value
}
