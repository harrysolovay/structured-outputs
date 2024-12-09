import type { Expand } from "../util/mod.ts"

export type TypeNode<K extends keyof TypeLookup = keyof TypeLookup> = {
  [K2 in K]: Expand<
    & { type: K2 }
    & ([TypeLookup[K2]] extends [never] ? {} : { value: TypeLookup[K2] })
  >
}[K]

export interface AssertionNode {
  type: "Assertion"
  name: string
  description: string
  args: unknown[]
}

export type TypeLookup = {
  boolean: never
  number: never
  integer: never
  string: never
  array: {
    element: TypeNode
  }
  object: {
    fields: Record<string, TypeNode>
  }
  option: {
    some: TypeNode
  }
  enum: {
    values: Array<string>
  }
  taggedUnion: {
    tagKey: number | string
    members: Record<number | string, TypeNode | undefined>
  }
}
