export const Type: unique symbol = Symbol("Liminal:Type")
export interface Type<T, C extends keyof any = never> {
  <V extends ContextParts>(
    template: TemplateStringsArray,
    ...ctx: V
  ): Type<T, ReduceParamKey<C, V>>

  <V extends ContextParts>(...ctx: V): Type<T, ReduceParamKey<C, V>>

  T: T

  [Type]: true

  kind: string
  args?: unknown[]

  ctx: ContextParts
}

export type ContextParts = Array<unknown>

export const ContextParamKey: unique symbol = Symbol("Liminal:ContextParam")
export interface ContextParam<K extends symbol> {
  (...ctx: ContextParts): ContextArg<K>
  [ContextParamKey]: K
}

export const ContextArgKey: unique symbol = Symbol("Liminal:ContextArg")
export interface ContextArg<K extends symbol> {
  [ContextArgKey]: K
  arg: unknown
}

export type ReduceParamKey<C extends keyof any, P extends ContextParts> = P extends
  [infer P0, ...infer PRest] ? ReduceParamKey<
    P0 extends ContextParam<infer K> ? C | K : P0 extends ContextArg<infer K> ? Exclude<C, K> : C,
    PRest
  >
  : C

export function _<K extends symbol>(key: K): <A>(arg: A) => ContextArg<K> {
  return Object.assign((arg: unknown) => ({
    [ContextArgKey]: key,
    arg,
  }), { [ContextParamKey]: key })
}

export const AssertionKey: unique symbol = Symbol("Liminal:Assertion")
export interface Assertion {
  [AssertionKey]: true
  name: string
  f: (value: any, ...args: any[]) => void | Promise<void>
  args: unknown[]
}
export function Assertion<T, A extends Array<unknown>>(
  name: string,
  f: (value: T, ...args: A) => void | Promise<void>,
  ...args: A
): Assertion {
  return {
    [AssertionKey]: true,
    name,
    f,
    args,
  }
}

export type AnyType = Type<any, keyof any>

export function isType(value: unknown): value is AnyType {
  return typeof value === "object" && value !== null && Type in value
}
