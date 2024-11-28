import type { ChatCompletion } from "openai/resources/chat/completions"
import type { ResponseFormatJSONSchema } from "openai/resources/shared"
import type { Type } from "../Type.ts"
import { assert } from "../util/assert.ts"
import { recombine } from "../util/recombine.ts"
import { Visit } from "../Visit.ts"

export interface ResponseFormat<T> extends FinalResponseFormat<T> {
  (template: TemplateStringsArray, ...values: Array<unknown>): FinalResponseFormat<T>
}

export function ResponseFormat<T>(name: string, type: Type<T, any, never>): ResponseFormat<T> {
  return Object.assign(
    (template: TemplateStringsArray, ...values: unknown[]) =>
      FinalResponseFormat(name, type, recombine(template, values)),
    FinalResponseFormat(name, type),
  )
}

interface FinalResponseFormat<T> {
  type: "json_schema"
  /** The desired return type in JSON Schema. */
  json_schema: ResponseFormatJSONSchema.JSONSchema
  /** Transform the content of the first choice into a typed object. */
  into(completion: ChatCompletion): T
}

function FinalResponseFormat<T>(
  name: string,
  type: Type<T, any, never>,
  description?: string,
): FinalResponseFormat<T> {
  return {
    type: "json_schema",
    json_schema: {
      name,
      description,
      schema: type.schema(),
      strict: true,
    },
    into: (completion: ChatCompletion) =>
      Visit<T>()(JSON.parse(unwrap(completion)), type, "ResponseFormat"),
    ...{
      /** Prevents `JSON.stringify` from attempting to serialize `into`. */
      toJSON() {
        const { type, json_schema } = this
        return { type, json_schema }
      },
    },
  }
}

export function unwrap(completion: ChatCompletion): string {
  const { choices: [firstChoice] } = completion
  assert(firstChoice, "No choices contained within the completion response.")
  const { finish_reason, message } = firstChoice
  assert(
    finish_reason === "stop",
    `Completion responded with "${finish_reason}" as finish reason; ${message}`,
  )
  const { content, refusal } = message
  assert(!refusal, `Openai refused to fulfill completion request; ${refusal}`)
  assert(content, "First response choice contained no content.")
  return content
}
