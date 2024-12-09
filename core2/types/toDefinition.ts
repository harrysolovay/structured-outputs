import type { TypeNode } from "../Node.ts"
import type { Type, TypeLike } from "./Type.ts"

export class SerializeToDefContext {
  defs: Map<Type, TypeNode> = new Map()

  ref = (typeLike: TypeLike): TypeNode => {
    const type = "type" in typeLike ? typeLike : typeLike()
    let def = this.defs.get(type)
    if (!def) {
      def = type.def(this)
    }
    return def
  }
}
