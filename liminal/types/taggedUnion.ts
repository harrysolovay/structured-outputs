import type { Expand } from "../../util/mod.ts"
import type { AnyType, Type } from "../Type.ts"
import { declare } from "./declare.ts"

export function union<M extends Record<string, null | AnyType>>(members: M): Type<
  {
    [K in keyof M]: Expand<
      { type: K } & (M[K] extends AnyType ? { value: M[K]["T"] } : {})
    >
  }[keyof M],
  Extract<M[keyof M], AnyType>["D"]
> {
  const tags = Object.keys(members)
  tags.sort()
  return declare({
    factory: union,
    args: [Object.fromEntries(tags.map((tag) => [tag, members[tag]]))],
  })
}
