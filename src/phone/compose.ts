import { normalizePhoneNumber } from './normalize'

/**
 * Build E.164 number from country picker dial code + local number input.
 */
export function composePhoneNumber(countryDialCode: string, localNumber: string): string {
  const normalizedDial = normalizePhoneNumber(countryDialCode)
  if (!normalizedDial) return ''
  const localDigits = typeof localNumber === 'string' ? localNumber.replace(/\D/g, '') : ''
  if (!localDigits) return ''
  return `${normalizedDial}${localDigits}`
}
