import {
  type ContextParts,
  type ReduceParamKey,
  TemplateKey,
  Type,
  type TypeInfoBase,
} from "../Type.ts"

export interface TypeInfo {
  kind: string
  value: unknown
}
export function TypeInfo<K extends string>(kind: K) {
  return class<V = void> implements TypeInfo {
    readonly kind = kind
    constructor(readonly value: V) {}
  }
}

export function declare<T>(info: TypeInfo): Type<T, never> {
  return declare_(info, [])
}

function declare_<T, C extends symbol>(info: TypeInfoBase, ctx: ContextParts): Type<T, C> {
  return Object.assign(processCtx, {
    ...{} as { T: T; C: C },
    [Type]: true as const,
    info,
    ctx,
    toJSON: () => info,
  })

  function processCtx<V extends ContextParts>(
    template: TemplateStringsArray,
    ...additionalCtx: V
  ): Type<T, ReduceParamKey<C, V>>
  function processCtx<V extends ContextParts>(...additionalCtx: V): Type<T, ReduceParamKey<C, V>>
  function processCtx<V extends ContextParts>(
    maybeTemplate: unknown,
    ...additionalCtx: unknown[]
  ): Type<T, ReduceParamKey<C, V>> {
    if (
      Array.isArray(maybeTemplate) && "raw" in maybeTemplate && Array.isArray(maybeTemplate.raw)
    ) {
      return declare_(info, [...ctx, {
        [TemplateKey]: maybeTemplate,
        ctx: additionalCtx,
      }])
    }
    return declare_(info, [...ctx, ...additionalCtx])
  }
}
