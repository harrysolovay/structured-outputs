import type { Expand } from "../../util/mod.ts"
import { declareType } from "./declareType.ts"
import type { Type, TypeLike, UnwrapTypeLike } from "./Type.ts"

export function taggedUnion<
  K extends number | string,
  M extends Record<number | string, TypeLike | undefined>,
>(
  tagKey: K,
  members: M,
): Type<
  {
    [V in keyof M]: Expand<
      (
        & { [_ in K]: V }
        & (M[V] extends TypeLike ? { value: UnwrapTypeLike<M[V]>["T"] } : {})
      )
    >
  }[keyof M],
  UnwrapTypeLike<Extract<M[keyof M], TypeLike>>["P"]
> {
  return declareType((ctx) => ({
    type: "taggedUnion",
    value: {
      tagKey,
      members: Object.fromEntries(
        Object.entries(members).map(([k, v]) => [k, v === undefined ? v : ctx.ref(v)]),
      ),
    },
  }))
}
