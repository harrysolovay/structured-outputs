import { _, T } from "./mod.ts"

const NationalityKey = Symbol()
const nationality = _(NationalityKey, (v: string) => v)

const x = T.string`We could use it here: ${nationality}`

const Dog = T.object({
  name: T.string,
  favoriteToy: T.string`We could use it here: ${nationality}`,
  x,
})

console.log(JSON.stringify(Dog, null, 2))
