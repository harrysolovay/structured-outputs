import { isTemplateStringsArray } from "../../util/mod.ts"
import type { ContextPart } from "../context/mod.ts"
import type { TypeNode } from "../Node.ts"
import type { SerializeToDefContext } from "./toDefinition.ts"
import type { ReduceParamKey, Type } from "./Type.ts"

export function declareType<T, P extends symbol>(
  def: (ctx: SerializeToDefContext) => TypeNode,
  ctx: Array<ContextPart> = [],
): Type<T, P> {
  return Object.assign(make, {
    ...{} as { T: T; P: P },
    type: "Type" as const,
    def,
    ctx,
    toJSON: () => {},
  })

  function make<V extends Array<ContextPart>>(
    ...additionalCtx: V
  ): Type<T, ReduceParamKey<P, V>>
  function make<V extends Array<ContextPart>>(
    template: TemplateStringsArray,
    ...additionalCtx: V
  ): Type<T, ReduceParamKey<P, V>>
  function make<V extends Array<ContextPart>>(
    maybeTemplate: ContextPart | TemplateStringsArray,
    ...additionalCtx: Array<ContextPart>
  ): Type<T, ReduceParamKey<P, V>> {
    if (isTemplateStringsArray(maybeTemplate)) {
      return declareType(def, [...ctx, {
        type: "Template",
        template: maybeTemplate,
        ctx: additionalCtx,
      }])
    }
    return declareType(def, [...ctx, ...additionalCtx])
  }
}
