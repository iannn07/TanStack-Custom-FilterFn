export default function dateNormalizer(d: Date | null) {
  if (!d) return null
  const normalized = new Date(d)

  normalized.setHours(0, 0, 0, 0)

  return normalized
}
