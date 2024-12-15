// @egts
// unstable: `Liminal` and `OpenAIAdapter` are both WIP (and therefore not exposed as root exports).
// mock: Tool management is not yet implemented within `Session`.

import OpenAI from "openai"
import { Liminal } from "../client/Liminal.ts"
import { OpenAIAdapter } from "../client/openai/OpenAIAdapter.ts"
import "@std/dotenv/load"
import { L } from "liminal"
import { dbg } from "testing"

const liminal = new Liminal(OpenAIAdapter({
  openai: new OpenAI(),
}))

const session = liminal.session()

session.tool(
  L.object({
    latitude: L.number,
    longitude: L.number,
  }),
  {
    description: "Get the current weather for the specified latitude and longitude.",
    f: ({ latitude, longitude }) => fetchWeather(latitude, longitude),
  },
)

await session.value(L.number, {
  messages: [{
    role: "user",
    content: "What is the weather like in New York City?",
  }],
}).then(dbg)

function fetchWeather(latitude: number, longitude: number): Promise<unknown> {
  return fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`,
  ).then((v) => v.json())
}
