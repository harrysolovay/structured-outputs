import { recombine } from "../../util/mod.ts"

export type Annotation =
  | null
  | undefined
  | false
  | string
  | Template
  | Param
  | Arg
  | Assert
  | Metadata

export interface Template {
  type: "Template"
  template: TemplateStringsArray
  parts: Array<Annotation>
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

export interface Assert<T = any> {
  type: "Assert"
  fqn: Fqn
  f: (value: T, ...args: any) => void | Promise<void>
  args: unknown[]
}

export interface Metadata<T = any> {
  type: "Metadata"
  fqn?: Fqn
  value: T
  serializer?: (value: T) => string
}

export type Fqn = number | string | Array<Fqn>

export type ReduceD<D extends symbol, A extends Array<Annotation>> = A extends
  [infer Part0, ...infer PartRest extends Array<Annotation>] ? ReduceD<
    Part0 extends Param<infer K> ? D | K : Part0 extends Arg<infer K> ? Exclude<D, K> : D,
    PartRest
  >
  : D

export function formatDescription(
  annotations: Array<Annotation>,
  args: Record<symbol, string>,
): undefined | string {
  const description: Array<string> = []
  annotations.forEach((annotation) => {
    if (!(annotation === null || annotation === undefined || annotation === false)) {
      if (typeof annotation === "string") {
        description.push(annotation)
      } else if (annotation.type === "Template") {
        description.push(recombine(
          annotation.template,
          annotation.parts.map((part) => formatDescription([part], args)),
        ))
      } else if (annotation.type === "Param") {
        const arg = args[annotation.key]
        if (typeof arg === "string") {
          description.push(arg)
        }
      } else if (annotation.type === "Arg") {
        args[annotation.key] = annotation.serializer?.(annotation.value)
          ?? annotation.value as string
      } else if (annotation.type === "Metadata") {
        if (annotation.serializer) {
          description.push(annotation.serializer(annotation.value))
        }
      }
    }
  })
  return description.length ? description.join(" ") : undefined
}
