import { isTemplateStringsArray } from "../../util/mod.ts"
import type { Annotation, ReduceD } from "../annotations/Annotation.ts"
import { serialize } from "../json/serialize.ts"
import type { Type, TypeDeclaration } from "../Type.ts"

export function declare<T, D extends symbol = never>(
  declaration: TypeDeclaration,
  annotations: Array<Annotation> = [],
): Type<T, D> {
  return Object.assign(
    Type,
    {
      declaration,
      toJSON: serialize,
      annotations,
    } satisfies Omit<Type<T, D>, "T" | "D">,
  ) as never

  function Type<P extends Array<Annotation>>(...parts: P): Type<T, ReduceD<D, P>>
  function Type<P extends Array<Annotation>>(
    template: TemplateStringsArray,
    ...parts: P
  ): Type<T, ReduceD<D, P>>
  function Type(
    maybeTemplate: Annotation | TemplateStringsArray,
    ...parts: Array<Annotation>
  ): Type<T, symbol> {
    if (isTemplateStringsArray(maybeTemplate)) {
      return declare(declaration, [...annotations, {
        type: "Template",
        template: maybeTemplate,
        parts,
      }])
    }
    return declare(declaration, [maybeTemplate, ...annotations, ...parts])
  }
}
