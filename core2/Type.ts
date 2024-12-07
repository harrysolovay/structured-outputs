import type { ReduceParamKey } from "./_.ts"
import type { ContextPart } from "./ContextPart.ts"
import type { Pin } from "./Pin.ts"
import type { TypeInfoBase } from "./TypeInfo.ts"

export const Type: unique symbol = Symbol("Liminal:Type")
export interface Type<T, P extends symbol = never> {
  <V extends Array<ContextPart>>(
    template: TemplateStringsArray,
    ...ctx: V
  ): Type<T, ReduceParamKey<P, V>>

  <V extends Array<ContextPart>>(...ctx: V): Type<T, ReduceParamKey<P, V>>

  P: P

  [Type]: true

  info: TypeInfoBase
  ctx: Array<ContextPart>
}

export type TypeLike<
  T = any,
  P extends symbol = symbol,
> = Type<T, P> | (() => Type<T, P>) | Pin<T>

export type T<L extends TypeLike> = L extends TypeLike<infer T> ? T : never
export type P<L extends TypeLike> = L extends TypeLike<any, infer P> ? P : never

export function isType(value: unknown): value is Type<any, symbol> {
  return typeof value === "object" && value !== null && Type in value
}
