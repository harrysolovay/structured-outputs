import { nationality, string } from "./Type.ts"

string

const string2 = string`${nationality}`

const v = string2(nationality, nationality(""))
