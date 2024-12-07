export const Type: unique symbol = Symbol("Liminal:Type")
export interface Type<T, C extends keyof any = never> {
  <V extends ContextParts>(
    template: TemplateStringsArray,
    ...ctx: V
  ): Type<T, ContextParamKey<C, V>>

  <V extends ContextParts>(...context: V): Type<T, ContextParamKey<C, V>>

  T: T
  C: C

  [Type]: true

  kind: string
  args?: unknown[]

  ctx: ContextParts
}

export type ContextParts = Array<unknown>

export const ContextParam: unique symbol = Symbol("Liminal:ContextParam")
export interface ContextParam<K extends symbol> {
  (...ctx: ContextParts): ContextArg<K>
  [ContextParam]: K
}

export const ContextArg: unique symbol = Symbol("Liminal:ContextArg")
export interface ContextArg<K extends symbol> {
  [ContextArg]: K
  parts: ContextParts
}

export type ContextParamKey<C extends keyof any, P extends ContextParts> = P extends
  [infer P0, ...infer PRest] ? ContextParamKey<
    P0 extends ContextParam<infer K> ? C | K : P0 extends ContextArg<infer K> ? Exclude<C, K> : C,
    PRest
  >
  : C

export type AnyType = Type<any, keyof any>

export function isType(value: unknown): value is AnyType {
  return typeof value === "object" && value !== null && Type in value
}

export function _<K extends symbol>(key: K): ContextParam<K> {
  return Object.assign((...parts: ContextParts) => ({
    [ContextArg]: key,
    parts,
  }), { [ContextParam]: key })
}
