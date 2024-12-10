import { L } from "../mod.ts"

const NationalityKey = Symbol()
const nationality = L._(NationalityKey)

const char = L.array(L.object({
  name: L.object({
    first: L.string,
    last: L.string,
  })`Something ${nationality}`,
  hobbies: L.option(L.string`Hobbies.`),
  careers: L.option(L.string),
  secrets: L.array(L.object({
    severity: L.enum("Low", "Medium", "High"),
    overview: L.string,
    breakdown: L.string,
    friendsAffected: L.option(L.array(L.string())),
  })),
}))

console.log(char)
