import { recombine } from "../util/mod.ts"

export type DescriptionPart = number | string | Template | Param | Arg

export interface Template {
  type: "Template"
  template: TemplateStringsArray
  parts: Array<DescriptionPart>
}

export interface Param<K extends symbol = symbol, A = any> {
  (arg: A): Arg<K>
  type: "Param"
  key: K
}

export interface Arg<K extends symbol = symbol> {
  type: "Arg"
  key: K
  value: unknown
  serializer?: (value: any) => string
}

export type ReduceD<D extends symbol, P extends Array<DescriptionPart>> = P extends
  [infer Part0, ...infer PartRest extends Array<DescriptionPart>] ? ReduceD<
    Part0 extends Param<infer K> ? D | K : Part0 extends Arg<infer K> ? Exclude<D, K> : D,
    PartRest
  >
  : D

export interface MergeDescriptionPartsResult {
  description: Array<string>
  args: Record<symbol, string>
}

export function formatDescriptionParts(
  parts: Array<DescriptionPart>,
  args: Record<symbol, string>,
): undefined | string {
  const description: Array<string> = []
  parts.forEach((part) => {
    if (typeof part === "number") {
      description.push(part.toString())
    } else if (typeof part === "string") {
      description.push(part)
    } else if (part.type === "Template") {
      description.push(recombine(
        part.template,
        part.parts.map((part) => formatDescriptionParts([part], args)),
      ))
    } else if (part.type === "Param") {
      const arg = args[part.key]
      if (typeof arg === "string") {
        description.push(arg)
      }
    } else if (part.type === "Arg") {
      args[part.key] = part.serializer?.(part.value) ?? part.value as string
    }
  })
  return description.length ? description.join(" ") : undefined
}
