import { Ty } from "./Ty.ts"

export type Vec<E extends Ty> = ReturnType<typeof Vec<E>>

export function Vec<E extends Ty>(element: E): Ty<Array<E[Ty.T]>, E[Ty.P]> {
  return Ty((description, ref) => ({
    type: "array",
    description,
    items: ref(element),
  }))
}