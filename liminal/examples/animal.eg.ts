import { L, toJSONSchema } from "../mod.ts"

const Sup = Symbol()
const sup = L._(Sup)

const Animal = L.taggedUnion("animal", {
  Dog: {
    bark: L.string,
    favoriteToy: L.enum("Shoes", "Homework", "Cat")`Hello there ${sup}`,
  },
  Elephant: {
    troopId: L.integer,
    remembersYourFace: L.boolean`Usually true.`,
  },
  SlowLoris: null,
})(sup("HELLO!"))

console.log(JSON.stringify(toJSONSchema(Animal), null, 2))
