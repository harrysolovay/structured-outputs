import { L, toJSONSchema } from "../mod.ts"

const Dog = L.object({
  bark: L.string,
  favoriteToy: L.enum("Shoes", "Homework", "Cat")`Hello there.`,
})

const Elephant = L.object({
  troopId: L.integer,
  remembersYourFace: L.boolean`Usually true.`,
})

const Animal = L.taggedUnion("animal", {
  Dog,
  Elephant,
  SlowLoris: null,
})

console.log(JSON.stringify(toJSONSchema(Animal), null, 2))
