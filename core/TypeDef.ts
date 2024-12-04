import type { Expand } from "../util/mod.ts"
import { Record, Union } from "./derived/mod.ts"
import { described } from "./described.ts"
import type { Type } from "./Type.ts"
import {
  array,
  boolean,
  deferred,
  enum as enum_,
  number,
  object,
  option,
  string,
  taggedUnion,
} from "./types.ts"

export type TypeDef = {
  [K in keyof TypeDef.Metadata]: {
    type: K
    value: Expand<
      & { description: string }
      & ([TypeDef.Metadata[K]] extends [never] ? {} : TypeDef.Metadata[K])
    >
  }
}[keyof TypeDef.Metadata]
namespace TypeDef {
  export type Metadata = {
    boolean: never
    number: never
    string: never
    array: {
      element: TypeDef
    }
    object: {
      fields: Record<number | string, TypeDef>
    }
    option: {
      Some: TypeDef
    }
    enum: {
      values: Array<string>
    }
    taggedUnion: {
      tag: number | string
      members: Record<number | string, TypeDef | undefined>
    }
  }
}

export const TypeDef: Type<TypeDef, never> = taggedUnion("type", {
  boolean: typeDefValue({}),
  number: typeDefValue({}),
  string: typeDefValue({}),
  array: typeDefValue({
    element: deferred(() => TypeDef),
  }),
  object: typeDefValue({
    fields: Record(deferred(() => TypeDef)),
  }),
  option: typeDefValue({
    Some: deferred(() => TypeDef),
  }),
  enum: typeDefValue({
    values: array(string),
  }),
  taggedUnion: typeDefValue({
    tag: Union(number, string),
    members: Record(option(deferred(() => TypeDef))),
  }),
})`Type def.`

function typeDefValue<F extends Record<string, Type<unknown>>>(
  fields: F,
): Type<{ description: string } & { [K in keyof F]: F[K]["T"] }, F[keyof F]["P"]> {
  return object({
    description: string,
    ...fields,
  })
}

export function hydrateType(def: TypeDef): Type<unknown> {
  return described(
    (() => {
      switch (def.type) {
        case "boolean": {
          return boolean
        }
        case "number": {
          return number
        }
        case "string": {
          return string
        }
        case "array": {
          return array(hydrateType(def.value.element))
        }
        case "object": {
          return object(
            Object.fromEntries(
              Object.entries(def.value.fields).map((
                [k, v],
              ) => [k, hydrateType(v)]),
            ),
          )
        }
        case "option": {
          return option(hydrateType(def.value.Some))
        }
        case "enum": {
          return enum_(...def.value.values)
        }
        case "taggedUnion": {
          return taggedUnion(
            def.value.tag,
            Object.fromEntries(
              Object
                .entries(def.value.members)
                .map(([k, v]) => [k, v ? hydrateType(v) : undefined]),
            ),
          )
        }
      }
    })(),
    def.value.description,
  )
}