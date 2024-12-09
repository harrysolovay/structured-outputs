import type { Type } from "../Type.ts"
import { declare } from "./declare.ts"

export const boolean: Type<boolean, never> = declare({ getAtom: () => boolean })
export const integer: Type<number, never> = declare({ getAtom: () => integer })
export const number: Type<number, never> = declare({ getAtom: () => number })
export const string: Type<string, never> = declare({ getAtom: () => string })
