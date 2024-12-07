import type { AnyType, Type } from "../Type.ts"
import { declare, TypeInfo } from "./declare.ts"

export class ObjectInfo extends TypeInfo("object")<{
  fields: Record<string, AnyType>
}> {}

export function object<F extends Record<string, AnyType>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["C"]> {
  return declare(new ObjectInfo({ fields }))
}
