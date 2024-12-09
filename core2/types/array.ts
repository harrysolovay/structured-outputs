import { declareType } from "./declareType.ts"
import type { Type, TypeLike, UnwrapTypeLike } from "./Type.ts"

export function array<E extends TypeLike>(
  element: E,
): Type<Array<UnwrapTypeLike<E>["T"]>, UnwrapTypeLike<E>["P"]> {
  return declareType((ctx) => ({
    type: "array",
    value: {
      element: ctx.ref(element),
    },
  }))
}
