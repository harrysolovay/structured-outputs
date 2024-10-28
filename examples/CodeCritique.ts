import * as T from "../mod.ts"

export class Suggestion extends T.object(
  "A container for information related to a replacement suggestion.",
  {
    file: T.string(
      "The file containing the span to be potentially replaced.",
    ),
    startLine: T.number(
      "The line on which the potentially-to-be-replaced span starts.",
    ),
    endLine: T.number(
      "The line on which the potentially-to-be-replaced span ends.",
    ),
    what: T.string(
      "The suggestion for the replacement.",
    ),
    why: T.string(
      "The reason for suggesting the replacement",
    ),
    code: T.string(
      "The replacement code.",
    ),
  },
) {}

export default class extends T.object(
  undefined,
  {
    suggestions: T.array(
      "A list of replacement suggestions.",
      Suggestion,
    ),
  },
) {}
