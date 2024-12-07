import type { ContextPart } from "./ContextPart.ts"

export function _<K extends symbol, V>(
  key: K,
  serializer: (value: V) => string,
): Param<K, V> {
  return Object.assign(
    (value: V) => ({
      [ArgKey]: key,
      value,
      serializer,
    }),
    {
      [ParamKey]: key,
    },
  )
}

export const ParamKey: unique symbol = Symbol("Liminal:Param")

export interface Param<K extends symbol, A> {
  (arg: A): Arg<K>
  [ParamKey]: K
}

export function isParam(value: unknown): value is Param<symbol, unknown> {
  return typeof value === "object" && value !== null && ParamKey in value
}

export const ArgKey: unique symbol = Symbol("Liminal:Arg")

export interface Arg<K extends symbol> {
  [ArgKey]: K
  value: unknown
  serializer: (value: any) => string
}

export function isArg(value: unknown): value is Arg<symbol> {
  return typeof value === "object" && value !== null && ArgKey in value
}

export type ReduceParamKey<P extends keyof any, C extends Array<ContextPart>> = C extends
  [infer Part0, ...infer PartRest extends Array<ContextPart>] ? ReduceParamKey<
    Part0 extends Param<infer K, any> ? P | K : Part0 extends Arg<infer K> ? Exclude<P, K> : P,
    PartRest
  >
  : P
