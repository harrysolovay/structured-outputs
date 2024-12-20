import "@std/dotenv/load"
import { assert, L, Liminal, OllamaAdapter, type Type } from "liminal"
import { max, min } from "./asserts.ts"

const $ = Liminal(OllamaAdapter({
  defaultModel: "llama3.2",
}))

const LDate: Type<Date> = L.transform(
  L.Tuple(
    L.number`Year.`,
    L.number`Month.`(min(0), max(11)),
    L.number`Day.`(min(1), max(31)),
  )(
    L.assert("Ensure the day is valid for corresponding year and month.", ([y, m, d]) => {
      const date = new Date(y, m, d)
      return date.getFullYear() === y && date.getMonth() === m && date.getDate() === d
    }),
  ),
  ([y, m, d]) => new Date(y, m, d),
)

const date = await $(LDate)

await assert(LDate, date)
