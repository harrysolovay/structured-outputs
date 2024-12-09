import type { Expand } from "../util/mod.ts"

export interface TypeDefContext {
  types: Array<{
    def: TypeDef
    description: Array<string>
  }>
}

export type TypeDef = TypeDefs[keyof TypeDefs]
export type TypeDefs = TypeDefs.Make<{
  boolean: {}
  integer: {}
  number: {}
  string: {}
  array: {
    element: TypeDef | number
  }
  object: {
    fields: Record<number | string, TypeDef | number>
  }
  option: {
    some: TypeDef | number
  }
  enum: {
    values: Array<string>
  }
  taggedUnion: {
    tagKey: number | string
    members: Record<number | string, TypeDef | number | null>
  }
}>
namespace TypeDefs {
  export type Make<T> = {
    [K in keyof T]: Expand<{ type: K } & T[K]>
  }
}
