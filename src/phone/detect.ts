import type { PhoneCountry, DetectedPhone } from './types'
import { PHONE_COUNTRIES } from './countries'

/**
 * Find a country by ISO alpha-2 code.
 */
export function findPhoneCountryByCode(code: string): PhoneCountry | undefined {
  if (!code) return undefined
  const upperCode = code.toUpperCase()
  return PHONE_COUNTRIES.find((country) => country.code === upperCode)
}

/**
 * Find a country by dial code (e.g. "+44").
 */
export function findPhoneCountryByDialCode(dialCode: string): PhoneCountry | undefined {
  if (!dialCode) return undefined
  const normalized = dialCode.startsWith('+') ? dialCode : `+${dialCode}`
  return PHONE_COUNTRIES.find((country) => country.dialCode === normalized)
}

// Dial codes sorted by length descending so +852 matches before +8x
const DIAL_CODES_DESC = [...PHONE_COUNTRIES]
  .sort((a, b) => b.dialCode.length - a.dialCode.length)

/**
 * Parse an E.164 number into country + local digits.
 * Defaults to US for ambiguous +1 codes.
 */
export function detectCountryFromE164(e164: string): DetectedPhone | null {
  if (!e164 || !e164.startsWith('+')) return null

  // Strip non-digits (except leading +) so "+44 7911 123456" is handled like "+447911123456"
  const normalized = '+' + e164.slice(1).replace(/\D/g, '')

  for (const country of DIAL_CODES_DESC) {
    const prefix = country.dialCode
    if (normalized.startsWith(prefix)) {
      const local = normalized.slice(prefix.length)
      if (local.length > 0) {
        return { country, local }
      }
    }
  }

  return null
}
