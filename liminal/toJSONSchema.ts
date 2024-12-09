import { formatDescriptionParts } from "./DescriptionPart.ts"
import type { AnyType } from "./Type.ts"
import { TypeVisitor } from "./TypeVisitor.ts"

export type Schema = Record<string, unknown>

export function toJSONSchema(type: AnyType): Schema {
  const $defs = get$defs(type)
  const root = $defs[0]!
  if (!("type" in root && root.type === "object")) {
    return {
      type: "object",
      properties: {
        value: root,
      },
      additionalProperties: false,
      required: ["value"],
      $defs,
    }
  }
  return {
    $ref: `#/$defs/0`,
    $defs,
  }
}

function get$defs(type: AnyType) {
  const ids: Map<AnyType, number> = new Map()
  const $defs: Record<number, undefined | Schema> = {}
  const visit = TypeVisitor<Record<symbol, string>, Schema>(
    {
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
      array(state, _0, element): Schema {
        return {
          type: "array",
          items: visit(state, element),
        }
      },
      object(state, _1, fields): Schema {
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
      option(state, _0, some): Schema {
        return {
          anyOf: [
            { type: "null" },
            visit(state, some),
          ],
        }
      },
      taggedUnion(state, _0, tagKey, members): Schema {
        return {
          discriminator: tagKey,
          anyOf: Object.entries(members).map(([tag, member]) => ({
            type: "object",
            properties: {
              [tagKey]: {
                type: "string",
                const: tag,
              },
              ...member === null ? {} : { value: visit(state, member) },
            },
            required: [tagKey, ...member === null ? [] : ["value"]],
            additionalProperties: false,
          })),
        }
      },
      ref(state, type): Schema {
        return visit(state, type)
      },
    },
    (next, state, type, ...args) => {
      let id = ids.get(type)
      if (id === undefined) {
        id = ids.size
        ids.set(type, id)
      }
      if (!(id in $defs)) {
        $defs[id] = undefined
        state = { ...state }
        const description = formatDescriptionParts(type.description, state)
        $defs[id] = {
          ...description ? { description } : {},
          ...next(state, type, args),
        }
      }
      return { $ref: `#/$defs/${id}` }
    },
  )
  visit({}, type)
  return $defs
}
