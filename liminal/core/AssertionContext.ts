import type { JSONTypeName } from "./JSONSchema.ts"
import type { AnyType, Type } from "./Type.ts"

export interface Diagnostic {
  type: AnyType
  exception: unknown
  value: unknown
  path: string
}

export namespace Diagnostic {
  export function toString({ exception, path, value }: Diagnostic): string {
    return `${
      exception instanceof Error ? `Error "${exception.name}"` : "Exception"
    } from value \`${JSON.stringify(value)}\` at \`root${path}\`: ${
      exception instanceof Error ? exception.message : JSON.stringify(exception)
    }`
  }
}

export class AssertionContext {
  constructor(
    readonly path: string,
    readonly structuralDiagnostics: Array<Diagnostic>,
    readonly annotationDiagnostics?: Array<Promise<Diagnostic | void>>,
  ) {}

  visit = <T>(
    type: Type<JSONTypeName, T, symbol>,
    value: unknown,
    junction?: number | string,
  ) => {
    const path = junction === undefined ? this.path : `${this.path}["${junction}"]`
    try {
      type.declaration.assert(
        value,
        new AssertionContext(path, this.structuralDiagnostics, this.annotationDiagnostics),
      )
    } catch (exception: unknown) {
      this.structuralDiagnostics.push({ type, exception, value, path })
    }
    const { annotationDiagnostics } = this
    if (annotationDiagnostics) {
      type.annotations
        .filter((annotation) => typeof annotation === "object" && annotation?.type === "Assertion")
        .forEach(({ f, args }) => {
          if (f) {
            annotationDiagnostics.push((async () => {
              try {
                await f(value, ...args)
              } catch (exception: unknown) {
                return { exception, path, value, type }
              }
            })())
          }
        })
    }
  }
}
