# Conventions

## Exposing Parameter Keys

If you are publishing a pattern library of parameterized types, you may want to specify parameter
keys as symbols, which you export from your library's entrypoint.

```ts
import { T } from "liminal"
// ---cut---
export namespace P {
  export const grade = Symbol()
}

export const SchoolCurriculumSubject = T.string`The school curriculum for grade ${P.grade}.`
```

> Note: a pattern library may include many parameter keys. To simplify end-developer usage, we place
> all keys under a single library-wide `P` namespace.

## Accounting For JSR Slow Types

JSR is a TypeScript package registry created by the Deno team. In the case that you wish to publish
your pattern library to JSR, be weary of [slow types](https://jsr.io/docs/about-slow-types).

In the previous code block––for example––we would need to add an explicit type to avoid static
analysis degradation.

```ts{2}
import { T, Type } from "liminal"

export namespace P {
  export const grade = Symbol()
}
// ---cut---
const SchoolCurriculumSubject_ = T.string`The school curriculum for grade ${P.grade}.`
export const SchoolCurriculumSubject: typeof SchoolCurriculumSubject_ = SchoolCurriculumSubject_
```

If we are creating a functional pattern, we explicitly return or unwrap type arguments.

In the following example, the return type is simply the sole parameter type.

```ts
import { T, Type } from "liminal"
// ---cut---
export function MostUnlikely<T, P extends keyof any>(
  ty: Type<T, P>,
): Type<T, P> {
  return ty`Ensure that this generated type is the most unlikely instance of itself.`
}
```

However, we may encounter cases which require us to unwrap the `Ty` type parameter(s) and explicitly
form a return `Ty` type.

```ts
import { T, Type } from "liminal"
// ---cut---
export namespace P {
  export const Tone = Symbol()
}

export function WithTone<T, P extends keyof any>(
  ty: Type<T, P>,
): Type<T, P | typeof P.Tone> {
  return ty`Generate with a tone of ${P.Tone}.`
}
```

## $-prefixing Liminal-Consuming Functions
