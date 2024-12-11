import * as I from "../intrinsics/mod.ts"
import type { JSONType } from "../JSONSchema.ts"
import type { Type } from "../Type.ts"
import { Option } from "./Option.ts"
import { Record } from "./Record.ts"
import { TaggedUnion } from "./TaggedUnion.ts"

export type MetaType = Type<"union", JSONType, never>
export const MetaType: MetaType = I.ref(() =>
  I.union(...[
    I.transform(
      TaggedUnion({
        null: null,
        boolean: null,
        integer: null,
        number: null,
        string: I.object({
          enum: I.transform(
            Option(I.array(I.string)),
            (value) => value === null ? undefined : value,
          ),
        }),
        array: I.object({
          items: MetaType,
        }),
        object: I.transform(
          I.object({
            properties: Record(MetaType),
            additionalProperties: I.const(I.boolean, false),
          }),
          ({ properties, ...rest }) => ({
            properties,
            ...rest,
            required: Object.keys(properties),
          }),
        ),
      }),
      ({ type, value }) => ({ type, ...value ?? {} } as never),
    ),
    I.object({
      anyOf: I.array(MetaType),
    }),
  ])
)
