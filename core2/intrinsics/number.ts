import type { Type } from "../Type.ts"
import { declare, TypeInfo } from "./declare.ts"

export class NumberInfo extends TypeInfo("number") {}

export const number: Type<number> = declare(new NumberInfo())
