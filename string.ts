import { make, type Ty } from "./_base.ts"

export function string(description?: string): StringTy {
  return make<StringTy>(() => ({
    type: "string",
    description,
  }))
}

export type StringTy = Ty<string>
