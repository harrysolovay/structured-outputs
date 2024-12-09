export interface Persistence {
  has: () => boolean
  set: () => void
  get: () => unknown
}
