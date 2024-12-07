import type { TypeLike } from "./Type.ts"

export class BooleanInfo extends TypeInfo("boolean") {}
export class IntegerInfo extends TypeInfo("integer") {}
export class NumberInfo extends TypeInfo("number") {}
export class StringInfo extends TypeInfo("string") {}
export class ArrayInfo extends TypeInfo("array")<{
  element: TypeLike
}> {}
export class ObjectInfo extends TypeInfo("object")<{
  fields: Record<string, TypeLike>
}> {}
export class OptionInfo extends TypeInfo("option")<{
  some: TypeLike
}> {}
export class EnumInfo extends TypeInfo("enum")<{
  values: Array<string>
}> {}
export class TaggedUnionInfo extends TypeInfo("taggedUnion")<{
  tagKey: number | string
  members: Record<number | string, unknown>
}> {}

export interface TypeInfoBase {
  kind: string
  value: unknown
}

function TypeInfo<K extends string>(kind: K) {
  return class<V = void> implements TypeInfoBase {
    readonly kind = kind
    constructor(readonly value: V) {}
  }
}
