import type { Fqn, Metadata } from "./Annotation.ts"

export function metadata<T>(fqn: Fqn, serializer?: () => string): (value: T) => Metadata {
  return (value: T) => ({
    type: "Metadata",
    fqn,
    serializer,
    value,
  })
}
