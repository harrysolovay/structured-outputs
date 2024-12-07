export function isTemplateStringsArray(value: unknown): value is TemplateStringsArray {
  return Array.isArray(value) && "raw" in value && Array.isArray(value.raw)
}
