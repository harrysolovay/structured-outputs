import { formatDescription } from "../annotations/Annotation.ts"
import type { AnyType } from "../Type.ts"
import { boolean, integer, number, string } from "../types/mod.ts"
import { TypeVisitor } from "../TypeVisitor.ts"
import { JSONRefType, type JSONSchema, type JSONType } from "./Schema.ts"

export function serialize(this: AnyType): JSONSchema {
  const ids: Map<AnyType, number> = new Map()
  const $defs: Record<number, undefined | JSONType> = {}
  const visit = TypeVisitor<Record<symbol, string>, JSONType>({
    null() {
      return { type: "null" }
    },
    boolean() {
      return { type: "boolean" }
    },
    integer() {
      return { type: "integer" }
    },
    number() {
      return { type: "number" }
    },
    string() {
      return { type: "string" }
    },
    array(state, _0, element): JSONType {
      return {
        type: "array",
        items: visit(state, element),
      }
    },
    object(state, _1, fields): JSONType {
      const keys = Object.keys(fields)
      return {
        type: "object",
        properties: Object.fromEntries(keys.map((key) => [key, visit(state, fields[key]!)])),
        additionalProperties: false,
        required: keys,
      }
    },
    enum(_0, _1, ...values) {
      return {
        type: "string",
        enum: values,
      }
    },
    option(state, _0, some): JSONType {
      return {
        anyOf: [
          { type: "null" },
          visit(state, some),
        ],
      }
    },
    union(state, _0, members): JSONType {
      return {
        discriminator: "type",
        anyOf: Object.entries(members).map(([tag, member]) => ({
          type: "object",
          properties: {
            type: {
              type: "string",
              const: tag,
            },
            ...member === null ? {} : { value: visit(state, member) },
          },
          required: ["type", ...member === null ? [] : ["value"]] as never,
          additionalProperties: false,
        })),
      }
    },
    ref(state, type): JSONType {
      return visit(state, type)
    },
  }, (next, state, type, ...args) => {
    const description = formatDescription(type.annotations, state)
    if (type.declaration.getAtom) {
      switch (type.declaration.getAtom()) {
        case boolean:
        case integer:
        case number:
        case string: {
          return {
            description,
            ...next(state, type, ...args),
          }
        }
      }
    }
    let id = ids.get(type)
    if (id === undefined) {
      id = ids.size
      ids.set(type, id)
    }
    if (!(id in $defs)) {
      $defs[id] = undefined
      state = { ...state }
      $defs[id] = {
        description,
        ...next(state, type, args),
      }
    }
    return { $ref: `#/$defs/${id}` }
  })
  visit({}, this)
  return {
    type: "object",
    properties: {
      root: {
        $ref: JSONRefType.Root,
      },
    },
    additionalProperties: false,
    required: ["root"],
    $defs: $defs as never,
  }
}
