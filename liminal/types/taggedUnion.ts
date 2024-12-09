import type { Expand } from "../../util/mod.ts"
import type { AnyType, Type } from "../Type.ts"
import { declare } from "./declare.ts"

export function taggedUnion<
  K extends number | string,
  M extends Record<number | string, null | Record<number | string, AnyType>>,
>(
  tagKey: K,
  members: M,
): Type<
  {
    [K2 in keyof M]: Expand<
      & { [_ in K]: K2 }
      & (M[K2] extends null ? {} : {
        [K3 in keyof M[K2]]: M[K2][K3] extends Type<infer T, symbol> ? T : never
      })
    >
  }[keyof M],
  Extract<M[keyof M], AnyType>["D"]
> {
  const tags = Object.keys(members)
  tags.sort()
  return declare({
    factory: taggedUnion,
    args: [tagKey, Object.fromEntries(tags.map((tag) => [tag, members[tag]]))],
  })
}

// return {
//   type: "taggedUnion",
//   tagKey,
//   members: Object.fromEntries(tags.map((tag) => {
//     const member = members[tag]
//     return [tag, !member ? null : ctx.visit(member)]
//   })),
// }
