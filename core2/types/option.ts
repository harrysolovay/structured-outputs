import { declareType } from "./declareType.ts"
import type { Type, TypeLike, UnwrapTypeLike } from "./Type.ts"

export function option<X extends TypeLike>(
  some: X,
): Type<UnwrapTypeLike<X>["T"] | undefined, UnwrapTypeLike<X>["P"]> {
  return declareType((ctx) => ({
    type: "option",
    value: {
      some: ctx.ref(some),
    },
  }))
}
