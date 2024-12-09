export interface Assertion {
  type: "Assertion"
  name: string
  description?: string | ((...args: any[]) => string)
  args: unknown[]
  f: (value: any, ...args: any[]) => void | Promise<void>
}
