import type { Arg, ContextPart, Param } from "../context/mod.ts"
import type { TypeNode } from "../Node.ts"
import type { SerializeToDefContext } from "./toDefinition.ts"

export interface Type<T = any, P extends symbol = symbol> {
  <V extends Array<ContextPart>>(
    template: TemplateStringsArray,
    ...ctx: V
  ): Type<T, ReduceParamKey<P, V>>

  <V extends Array<ContextPart>>(...ctx: V): Type<T, ReduceParamKey<P, V>>

  P: P
  T: T

  type: "Type"
  def: (ctx: SerializeToDefContext) => TypeNode
  ctx: Array<ContextPart>
}

export type ReduceParamKey<P extends symbol, C extends Array<ContextPart>> = C extends
  [infer Part0, ...infer PartRest extends Array<ContextPart>] ? ReduceParamKey<
    Part0 extends Param<infer K, any> ? P | K : Part0 extends Arg<infer K> ? Exclude<P, K> : P,
    PartRest
  >
  : P

export type TypeLike = Type | (() => Type)
export type UnwrapTypeLike<X extends TypeLike> = X extends (() => Type) ? ReturnType<X> : X
