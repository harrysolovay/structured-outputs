import type { ReduceParamKey } from "./_.ts"
import type { ContextPart } from "./ContextPart.ts"

export const Type: unique symbol = Symbol("Liminal:Type")
export interface Type<T, P extends symbol = never> {
  <V extends Array<ContextPart>>(
    template: TemplateStringsArray,
    ...ctx: V
  ): Type<T, ReduceParamKey<P, V>>

  <V extends Array<ContextPart>>(...ctx: V): Type<T, ReduceParamKey<P, V>>

  T: T
  P: P

  [Type]: true

  info: TypeInfoBase
  ctx: Array<ContextPart>
}

export interface TypeInfoBase {
  kind: string
}

export type AnyType<T = any> = Type<T, symbol>

export function isType(value: unknown): value is AnyType {
  return typeof value === "object" && value !== null && Type in value
}
