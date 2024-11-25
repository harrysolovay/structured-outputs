import * as path from "@std/path"
import Openai from "openai"
import "@std/dotenv/load"
import { ensureDir } from "@std/fs"
import { tap } from "../util/tap.ts"

export const openai = new Openai({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
})

const TMP_DIR = ".tmp"
await ensureDir(TMP_DIR)

export const dbg = tap(async (value) => {
  const dest = path.join(TMP_DIR, `${Date.now()}.json`)
  await Deno.writeTextFile(dest, JSON.stringify(value, null, 2))
  console.log(`Written to ${dest}.`)
})
