import { type AnyType, Type } from "../Type.ts"

export function option<X extends AnyType>(some: X): Type<X["T"] | undefined, X["P"]> {
  return Type({
    kind: "option",
    factory: option,
    args: [some],
    argsLookup: { some },
  })
}
