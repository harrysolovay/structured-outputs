import { L, Type } from "../mod.ts"

const Dog = L.object({
  bark: L.string,
  favoriteToy: L.enum("Shoes", "Homework", "Cat")`Hello there.`,
})

const Elephant = L.object({
  troopId: L.integer,
  remembersYourFace: L.boolean`Usually true.`,
})

const Animal = L.union({
  Dog,
  Elephant,
  SlowLoris: null,
})

const serialized = JSON.stringify(Animal.toJSON(), null, 2)
const deserialized = Type.fromJSON(JSON.parse(serialized))
console.log(JSON.stringify(deserialized, null, 2))
