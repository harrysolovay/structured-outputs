import type { Annotation, ReduceD } from "./annotations/mod.ts"
import { deserialize } from "./json/deserialize.ts"
import type { JSONSchema } from "./json/Schema.ts"

export interface Type<T, D extends symbol> {
  <A extends Array<Annotation>>(
    template: TemplateStringsArray,
    ...parts: A
  ): Type<T, ReduceD<D, A>>
  <A extends Array<Annotation>>(...parts: A): Type<T, ReduceD<D, A>>

  T: T
  D: D

  declaration: TypeDeclaration
  annotations: Array<Annotation>
  toJSON: () => JSONSchema
}

export namespace Type {
  export function fromJSON(schema: JSONSchema) {
    return deserialize(schema)
  }
}

export type TypeDeclaration = {
  getAtom: () => AnyType
  factory?: never
  args?: never
} | {
  getAtom?: never
  factory: (...args: any) => AnyType
  args: unknown[]
}

export type AnyType = Type<any, symbol>
