import { _, Type } from "./Type.ts"

declare const string: Type<string>

const NationalityKey = Symbol()
const nationality = _(NationalityKey)<string>

const string2 = string`${nationality}`

const v = string2(nationality(1), nationality, nationality(""))
