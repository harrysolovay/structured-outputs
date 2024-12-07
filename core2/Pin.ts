import type { Type } from "./Type.ts"

export const PinKey: unique symbol = Symbol("Liminal:Pin")

export interface Pin<T> {
  [PinKey]: Type<T>
}

export function isPin(value: unknown): value is Pin<unknown> {
  return typeof value === "object" && value !== null && PinKey in value
}
