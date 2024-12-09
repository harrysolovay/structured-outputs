import type { Expand } from "../util/mod.ts"

// 1. MetaType
// 2. get a signature that embeddings can understand – aka. recursive + reference types need to be understood... maybe from root

export class TypeContext {
  ids: Map<Type, number> = new Map()
  paths: Map<Type, Array<number | string>> = new Map()

  signatures: Record<number, string | null> = {}

  register = (type: Type, path: Array<number | string> = []): void => {
    if (!this.ids.has(type)) {
      this.ids.set(type, this.ids.size)
      this.paths.set(type, path)
      switch (type.type) {
        case "array": {
          this.register(type.element, [...path, "number"])
          break
        }
        case "object": {
          Object.entries(type.fields).forEach(([key, value]) => {
            this.register(value, [...path, key])
          })
          break
        }
        case "option": {
          this.register(type.some, [...path, "Some"])
          break
        }
        case "taggedUnion": {
          Object.entries(type.members).forEach(([tag, value]) => {
            if (value) {
              this.register(value, [...path, tag])
            }
          })
          break
        }
      }
    }
  }

  signature = (type: Type): string => {
    switch (type.type) {
      case "boolean":
      case "integer":
      case "number":
      case "string": {
        return type.type
      }
    }
    const id = this.ids.get(type)!
    let signature = this.signatures[id]
    if (signature === null) {
      signature = `ref(${id})`
    } else if (signature === undefined) {
      this.signatures[id] = null
      signature = (() => {
        switch (type.type) {
          default: {
            switch (type.type) {
              case "array": {
                return `array(${this.signature(type.element)})`
              }
              case "object": {
                return this.objectSignature(type)
              }
              case "option": {
                return `option(${this.signature(type.some)})`
              }
              case "enum": {
                return this.enumSignature(type)
              }
              case "taggedUnion": {
                return this.taggedUnionSignature(type)
              }
            }
          }
        }
      })()
      this.signatures[id] = signature
    }
    return signature
  }

  enumSignature = (type: Types["enum"]): string => {
    const sorted = [...type.values]
    sorted.sort()
    const joined = sorted.join(`, `)
    return `enum(${joined})`
  }

  objectSignature = (type: Types["object"]): string => {
    const keys = Object.keys(type.fields)
    keys.sort()
    return `object({${
      keys.map((key) => `${key}: ${this.signature(type.fields[key]!)}`).join(", ")
    }})`
  }

  taggedUnionSignature = (type: Types["taggedUnion"]): string => {
    const tags = Object.keys(type.members)
    tags.sort()
    const members = tags
      .map((tag) =>
        `${tag}${
          type.members[tag] === null
            ? ""
            : `(${type.members[tag] === null ? "null" : this.signature(type.members[tag]!)})`
        }`
      )
      .join(", ")
    return `taggedUnion(${members})`
  }
}

export type Type = Types[keyof Types]
export type Types = Types.Make<{
  boolean: {}
  integer: {}
  number: {}
  string: {}
  array: {
    element: Type
  }
  object: {
    fields: Record<string, Type>
  }
  option: {
    some: Type
  }
  enum: {
    values: Array<string>
  }
  taggedUnion: {
    tagKey: number | string
    members: Record<number | string, Type | null>
  }
}>
namespace Types {
  export type Make<T> = {
    [K in keyof T]: Expand<
      {
        type: K
        description?: string
      } & T[K]
    >
  }
}

const type: Type = {
  type: "array",
  element: {
    type: "object",
    fields: {
      a: {
        type: "number",
      },
      b: {
        type: "boolean",
      },
      h: {
        type: "object",
        fields: {
          something: {
            type: "string",
          },
        },
      },
      c: {
        type: "array",
        element: {
          type: "number",
        },
      },
      e: {
        type: "enum",
        values: ["A", "B", "C"],
      },
      f: {
        type: "enum",
        values: ["B", "C", "A"],
      },
    },
  },
}
;(type.element as any).fields.d = type
const ctx = new TypeContext()
ctx.register(type)
console.log(ctx.signature(type))
console.log(ctx)
