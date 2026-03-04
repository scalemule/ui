import type { PhoneNormalizationResult } from './types'
import { E164_REGEX } from './validate'

/**
 * Remove formatting noise and normalize to `+<digits>`.
 * Examples:
 *   "(415) 555-1234" -> "+4155551234"
 *   "00 44 20 1234 5678" -> "+442012345678"
 */
export function normalizePhoneNumber(input: string): string {
  if (typeof input !== 'string') return ''
  const trimmed = input.trim()
  if (!trimmed) return ''

  const digitsOnly = trimmed.replace(/\D/g, '')
  if (!digitsOnly) return ''

  if (trimmed.startsWith('+')) {
    return `+${digitsOnly}`
  }

  if (trimmed.startsWith('00') && digitsOnly.length > 2) {
    return `+${digitsOnly.slice(2)}`
  }

  return `+${digitsOnly}`
}

/**
 * Validate and normalize phone number into E.164 format.
 */
export function normalizeAndValidatePhone(input: string): PhoneNormalizationResult {
  const normalized = normalizePhoneNumber(input)

  if (!normalized) {
    return {
      input,
      normalized: null,
      valid: false,
      error: 'Phone number is required',
    }
  }

  if (!E164_REGEX.test(normalized)) {
    return {
      input,
      normalized,
      valid: false,
      error: 'Phone number must be in E.164 format (+[country code][number])',
    }
  }

  return {
    input,
    normalized,
    valid: true,
    error: null,
  }
}
