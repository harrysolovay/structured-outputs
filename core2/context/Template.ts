import type { ContextPart } from "./mod.ts"

export interface Template {
  type: "Template"
  template: TemplateStringsArray
  ctx: Array<ContextPart>
}
