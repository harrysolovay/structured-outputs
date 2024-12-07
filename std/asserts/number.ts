import { assert } from "../../util/assert.ts"

export function min(value: number, min: number) {
  assert(value >= min, `Must be gte ${min}; received ${value}.`)
}

export function max(value: number, max: number) {
  assert(value <= max, `Must be lte ${max}; received ${value}.`)
}
