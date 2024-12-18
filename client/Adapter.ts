import type { Type } from "../core/mod.ts"

export interface AdapterConfig {
  M: string
  I: unknown
  O: unknown
}

export interface Adapter<C extends AdapterConfig> {
  formatInput: (raw: string) => C["I"]
  unwrapOutput: (message: C["O"]) => string
  complete: <T>(config: AdapterCompleteConfig<T, C>) => Promise<C["O"]>
  transform?: <T>(type: Type<T, never>) => Type<T>
}

export interface AdapterCompleteConfig<T, C extends AdapterConfig> {
  type: Type<T, never>
  messages?: Array<C["I" | "O"]>
  model?: C["M"]
}
