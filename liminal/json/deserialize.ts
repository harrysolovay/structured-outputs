import { splitLast } from "../../util/mod.ts"
import type { AnyType } from "../Type.ts"
import {
  array,
  boolean,
  enum as enum_,
  integer,
  null as null_,
  number,
  object,
  option,
  ref,
  string,
  union,
} from "../types/mod.ts"
import type { JSONSchema, JSONType, JSONUnionMemberType } from "./Schema.ts"

export function deserialize(schema: JSONSchema): AnyType {
  const defs: Record<string, AnyType> = {}
  if (schema.$defs) {
    Object.entries(schema.$defs).forEach(([id, v]) => {
      defs[id] = deserialize_(v)
    })
  }
  const root = deserialize_(schema)
  return root

  function deserialize_(jsonType: JSONType): AnyType {
    if ("$ref" in jsonType) {
      const id = splitLast(jsonType.$ref, "#/$defs/").pop()!
      return ref(() => defs[id]!)
    } else if ("anyOf" in jsonType) {
      if (jsonType.anyOf.length === 2) {
        const [maybeNull, e1] = jsonType.anyOf
        if (maybeNull.type === "null") {
          return option(deserialize_(e1))
        }
      }
      return union(
        Object.fromEntries(
          (jsonType.anyOf as Array<JSONUnionMemberType>).map((member) => [
            member.properties.type.const,
            "value" in member.properties ? deserialize_(member.properties.value) : null,
          ]),
        ),
      )
    } else {
      switch (jsonType.type) {
        case "null": {
          return null_
        }
        case "boolean": {
          return boolean
        }
        case "integer": {
          return integer
        }
        case "number": {
          return number
        }
        case "string": {
          if (jsonType.enum) {
            return enum_(...jsonType.enum)
          }
          return string
        }
        case "array": {
          return array(ref((): AnyType => deserialize_(jsonType.items)))
        }
        case "object": {
          return object(
            Object.fromEntries(
              Object.entries(jsonType.properties).map(([k, v]) => [k, deserialize_(v)]),
            ),
          )
        }
      }
    }
  }
}
