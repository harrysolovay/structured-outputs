import { isTemplateStringsArray } from "../../util/mod.ts"
import type { DescriptionPart, ReduceD } from "../DescriptionPart.ts"
import type { Type, TypeDeclaration } from "../Type.ts"

export function declare<T, D extends symbol = never>(
  declaration: TypeDeclaration,
  description: Array<DescriptionPart> = [],
): Type<T, D> {
  const self = Object.assign(Type, {
    declaration,
    toJSON: () => ({ TODO: "Here" }),
    description,
  }) as never as Type<T, D>
  return self

  function Type<P extends Array<DescriptionPart>>(...parts: P): Type<T, ReduceD<D, P>>
  function Type<P extends Array<DescriptionPart>>(
    template: TemplateStringsArray,
    ...parts: P
  ): Type<T, ReduceD<D, P>>
  function Type(
    maybeTemplate: DescriptionPart | TemplateStringsArray,
    ...parts: Array<DescriptionPart>
  ): Type<T, symbol> {
    if (isTemplateStringsArray(maybeTemplate)) {
      return declare(declaration, [...description, {
        type: "Template",
        template: maybeTemplate,
        parts,
      }])
    }
    return declare(declaration, [maybeTemplate, ...description, ...parts])
  }
}
