import type { Type } from "../Type.ts"
import { declare, TypeInfo } from "./declare.ts"

export class StringInfo extends TypeInfo("string") {}

export const string: Type<string> = declare(new StringInfo())
