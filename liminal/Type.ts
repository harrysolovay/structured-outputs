import type { DescriptionPart, ReduceD } from "./DescriptionPart.ts"
import type { TypeDefContext } from "./TypeDef.ts"

export interface Type<T, D extends symbol> {
  <P extends Array<DescriptionPart>>(
    template: TemplateStringsArray,
    ...parts: P
  ): Type<T, ReduceD<D, P>>
  <P extends Array<DescriptionPart>>(...parts: P): Type<T, ReduceD<D, P>>

  T: T
  D: D

  declaration: TypeDeclaration
  toJSON: () => TypeDefContext
  description: Array<DescriptionPart>
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
