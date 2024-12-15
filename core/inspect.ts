import { signature } from "./signature.ts"
import type { AnyType } from "./Type.ts"

export const inspect = {
  [Symbol.for("Deno.customInspect")](
    this: AnyType,
    _inspect: (value: unknown, opts: unknown) => string,
    _opts: unknown,
  ): string {
    return `LiminalType ${signature.call(this)}`
  },
}
