/**
 * Convert ISO 3166-1 alpha-2 country code to Unicode flag emoji.
 * Uses regional indicator symbols: each letter maps to 0x1F1E6 + (charCode - 65).
 */
export function countryFlag(code: string): string {
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('')
}
