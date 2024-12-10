import { unreachable } from "@std/assert"
import type { AnyType } from "./Type.ts"
import * as T from "./types/mod.ts"

type T = typeof T

export type TypeVisitorArms<S, R> = {
  [K in keyof T]: (
    state: S,
    type: T[K] extends AnyType ? T[K] : ReturnType<T[K]>,
    ...args: T[K] extends AnyType ? [] : Parameters<T[K]>
  ) => R
}

export function TypeVisitor<S, R>(
  arms: TypeVisitorArms<S, R>,
  middleware?: (
    next: (state: S, type: AnyType, ...args: unknown[]) => R,
    state: S,
    type: AnyType,
    ...args: unknown[]
  ) => R,
): (state: S, type: AnyType) => R {
  if (middleware) {
    return (state, type, ...args) => middleware(next, state, type, ...args)
  }
  return next
  function next(state: S, type: AnyType): R {
    const [factoryOrAtom, args] = type.declaration.getAtom
      ? [type.declaration.getAtom(), []]
      : [type.declaration.factory, type.declaration.args]
    return (() => {
      switch (factoryOrAtom) {
        case T.boolean: {
          return arms.boolean
        }
        case T.integer: {
          return arms.integer
        }
        case T.number: {
          return arms.number
        }
        case T.string: {
          return arms.string
        }
        case T.array: {
          return arms.array
        }
        case T.object: {
          return arms.object
        }
        case T.enum: {
          return arms.enum
        }
        case T.option: {
          return arms.option
        }
        case T.union: {
          return arms.union
        }
        case T.ref: {
          return arms.ref
        }
        default: {
          unreachable(`No handler implemented for declaration ${type.declaration}.`)
        }
      }
    })()(state, type as never, ...args as Array<never>)
  }
}
