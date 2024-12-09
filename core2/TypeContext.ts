import type { TypeLookup } from "./Node.ts"
import type { TypeNode } from "./Node.ts"

export interface TypeContext {
  types: Array<TypeNode>
}

export type Visitors<C, R> = {
  [K in keyof TypeLookup]: (def: TypeLookup[K], ctx: C) => R
}

export function Visitor<C, R>(visitors: Visitors<C, R>) {
  return function visit(type: TypeLike) {}
}

export class TypeContext {
  ids: Map<TypeLike, number> = new Map()
  signatures: Map<TypeLike, string> = new Map()

  visit = <C, R>(type: TypeLike, ctx: C, visitors: Visitors<C, R>): R => {
  }
}
