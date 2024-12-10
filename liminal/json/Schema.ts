export interface JSONSchema {
  type: "object"
  properties: {
    root: {
      $ref: JSONRefType.Root
    }
  }
  additionalProperties: false
  required: ["root"]
  $defs?: Record<string, JSONType>
}

export type JSONType =
  | JSONNullType
  | JSONBooleanType
  | JSONIntegerType
  | JSONNumberType
  | JSONStringType
  | JSONArrayType
  | JSONObjectType
  | JSONOptionType
  | JSONUnionType
  | JSONRefType

export interface JSONNullType {
  description?: string
  type: "null"
}

export interface JSONBooleanType {
  description?: string
  type: "boolean"
}

export interface JSONIntegerType {
  description?: string
  type: "integer"
}

export interface JSONNumberType {
  description?: string
  type: "number"
}

export interface JSONStringType {
  description?: string
  type: "string"
  enum?: Array<string>
}

export interface JSONArrayType {
  description?: string
  type: "array"
  items: JSONType
}

export interface JSONObjectType {
  description?: string
  type: "object"
  properties: Record<string, JSONType>
  additionalProperties: false
  required: Array<string>
}

export interface JSONOptionType {
  description?: string
  anyOf: [JSONNullType, JSONType]
}

export interface JSONUnionType {
  description?: string
  discriminator: "type"
  anyOf: Array<JSONUnionMemberType>
}

export type JSONUnionMemberType =
  & {
    type: "object"
    additionalProperties: false
  }
  & ({
    properties: {
      type: {
        type: "string"
        const: string
      }
      value: JSONType
    }
    required: ["type", "value"]
  } | {
    properties: {
      type: {
        type: "string"
        const: string
      }
    }
    required: ["type"]
  })

export interface JSONRefType {
  description?: string
  $ref: `#/$defs/${string}`
}
export namespace JSONRefType {
  export const Root = "#/$defs/0"
  export type Root = typeof Root
}
