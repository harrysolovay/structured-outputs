import { declareType } from "./declareType.ts"
import type { Type, TypeLike, UnwrapTypeLike } from "./Type.ts"

export function object<F extends Record<string, TypeLike>>(
  fields: F,
): Type<
  { [K in keyof F]: UnwrapTypeLike<F[K]>["T"] },
  UnwrapTypeLike<F[keyof F]>["P"]
> {
  return declareType((ctx) => ({
    type: "object",
    value: {
      fields: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, ctx.ref(v)])),
    },
  }))
}
