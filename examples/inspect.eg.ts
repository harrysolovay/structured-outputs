import "@std/dotenv/load"
import { display, T } from "structured-outputs"

const A = T.object({
  a: T.string,
})

const B = T.taggedUnion("type", {
  A,
  B: T.string,
})

const C = T.taggedUnion("type", {
  B,
  C: T.string,
})

console.log(display(C))
