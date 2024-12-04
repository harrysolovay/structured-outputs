import type { Expand } from "../util/mod.ts"
import { type AnyType, Type } from "./Type.ts"

export const boolean: Type<boolean> = Type({
  name: "boolean",
  getAtom: () => boolean,
})

export const number: Type<number> = Type({
  name: "number",
  getAtom: () => number,
})

export const string: Type<string> = Type({
  name: "string",
  getAtom: () => string,
})

export { const_ as const }
export function const_<V extends number | string>(value: V): Type<V> {
  return Type({
    name: "const",
    factory: const_,
    args: [value],
  })
}
Object.defineProperty(const_, "name", { value: "const" })

export function array<E extends AnyType>(
  Element: E,
): Type<Array<E["T"]>, E["P"]> {
  return Type({
    name: "array",
    factory: array,
    args: [Element],
  })
}

export function object<F extends Record<number | string, AnyType>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["P"]> {
  return Type({
    name: "object",
    factory: object,
    args: [fields],
  })
}

export function option<X extends AnyType>(
  Some: X,
): Type<X["T"] | undefined, X["P"]> {
  return Type({
    name: "option",
    factory: option,
    args: [Some],
  })
}

export { enum_ as enum }
function enum_<K extends string>(...members: Array<K>): Type<K> {
  return Type({
    name: "enum",
    factory: enum_,
    args: members,
  })
}
Object.defineProperty(enum_, "name", { value: "enum" })

export function taggedUnion<
  K extends number | string,
  M extends Record<number | string, AnyType | undefined>,
>(
  tagKey: K,
  members: M,
): Type<
  {
    [V in keyof M]: Expand<
      ({ [_ in K]: V } & (M[V] extends AnyType ? { value: M[V]["T"] } : {}))
    >
  }[keyof M],
  Extract<M[keyof M], AnyType>["P"]
> {
  return Type({
    name: "taggedUnion",
    factory: taggedUnion,
    args: [tagKey, members],
  })
}

export function transform<F, P extends keyof any, T>(
  From: Type<F, P>,
  f: (value: F) => T,
): Type<T, P> {
  return Type({
    name: "transform",
    factory: transform,
    args: [From, f],
  })
}

export function deferred<T, P extends keyof any>(
  getType: () => Type<T, P>,
): Type<T, P> {
  return Type({
    name: "deferred",
    factory: deferred,
    args: [getType],
  })
}