import { type Expand, isTemplateStringsArray } from "../util/mod.ts"
import type { ReduceParamKey } from "./_.ts"
import type { ContextPart } from "./ContextPart.ts"
import { TemplateKey } from "./Template.ts"
import { type P, type T, Type, type TypeLike } from "./Type.ts"
import type { TypeInfoBase } from "./TypeInfo.ts"
import {
  ArrayInfo,
  BooleanInfo,
  EnumInfo,
  IntegerInfo,
  NumberInfo,
  ObjectInfo,
  OptionInfo,
  StringInfo,
  TaggedUnionInfo,
} from "./TypeInfo.ts"

export const boolean: Type<boolean> = declare(new BooleanInfo())
export const integer: Type<number> = declare(new IntegerInfo())
export const number: Type<number> = declare(new NumberInfo())
export const string: Type<string> = declare(new StringInfo())

export function array<E extends TypeLike>(element: E): Type<Array<T<E>>, P<E>> {
  return declare(new ArrayInfo({ element }))
}

export function object<F extends Record<string, TypeLike>>(
  fields: F,
): Type<{ [K in keyof F]: T<F[K]> }, P<F[keyof F]>> {
  return declare(new ObjectInfo({ fields }))
}

export function option<X extends TypeLike>(some: X): Type<T<X> | undefined, P<X>> {
  return declare(new OptionInfo({ some }))
}

export { enum_ as enum }
function enum_<V extends Array<string>>(...values: V): Type<V[number]> {
  return declare(new EnumInfo({ values }))
}
Object.defineProperty(enum_, "name", { value: "enum" })

export function taggedUnion<
  K extends number | string,
  M extends Record<number | string, unknown>,
>(
  tagKey: K,
  members: M,
): Type<
  {
    [V in keyof M]: Expand<
      (
        & { [_ in K]: V }
        & (M[V] extends TypeLike<infer T> ? { value: T } : {})
      )
    >
  }[keyof M],
  P<Extract<M[keyof M], TypeLike>>
> {
  return declare(new TaggedUnionInfo({ tagKey, members }))
}

function declare<T, P extends symbol>(
  info: TypeInfoBase,
  ctx: Array<ContextPart> = [],
): Type<T, P> {
  return Object.assign(make, {
    ...{} as { T: T; P: P },
    [Type]: true as const,
    info,
    ctx,
    toJSON: () => info,
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
      return declare(info, [...ctx, {
        [TemplateKey]: maybeTemplate,
        ctx: additionalCtx,
      }])
    }
    return declare(info, [...ctx, ...additionalCtx])
  }
}
