import { describe, test, expect } from 'vitest'
import { detectCountryFromE164, findPhoneCountryByCode, findPhoneCountryByDialCode } from '../../phone/detect'

describe('detectCountryFromE164', () => {
  test('detect GB', () => {
    const result = detectCountryFromE164('+447911123456')
    expect(result).not.toBeNull()
    expect(result!.country.code).toBe('GB')
    expect(result!.local).toBe('7911123456')
  })

  test('detect US (ambiguous +1 defaults to US)', () => {
    const result = detectCountryFromE164('+14155551234')
    expect(result).not.toBeNull()
    expect(result!.country.code).toBe('US')
    expect(result!.local).toBe('4155551234')
  })

  test('detect HK (+852 vs +8x)', () => {
    const result = detectCountryFromE164('+85212345678')
    expect(result).not.toBeNull()
    expect(result!.country.code).toBe('HK')
    expect(result!.local).toBe('12345678')
  })

  test('detect Singapore', () => {
    const result = detectCountryFromE164('+6512345678')
    expect(result).not.toBeNull()
    expect(result!.country.code).toBe('SG')
    expect(result!.local).toBe('12345678')
  })

  test('detect Germany', () => {
    const result = detectCountryFromE164('+491701234567')
    expect(result).not.toBeNull()
    expect(result!.country.code).toBe('DE')
    expect(result!.local).toBe('1701234567')
  })

  test('strips non-digits from formatted paste input', () => {
    const result = detectCountryFromE164('+44 7911 123456')
    expect(result).not.toBeNull()
    expect(result!.country.code).toBe('GB')
    expect(result!.local).toBe('7911123456')
  })

  test('returns null for empty string', () => {
    expect(detectCountryFromE164('')).toBeNull()
  })

  test('returns null for non-E.164', () => {
    expect(detectCountryFromE164('4155551234')).toBeNull()
  })

  test('returns null for just plus sign', () => {
    expect(detectCountryFromE164('+')).toBeNull()
  })

  test('returns null for dial code only (no local digits)', () => {
    expect(detectCountryFromE164('+1')).toBeNull()
  })
})

describe('findPhoneCountryByCode', () => {
  test('finds US', () => {
    expect(findPhoneCountryByCode('US')?.name).toBe('United States')
  })

  test('case insensitive', () => {
    expect(findPhoneCountryByCode('gb')?.name).toBe('United Kingdom')
  })

  test('returns undefined for unknown code', () => {
    expect(findPhoneCountryByCode('XX')).toBeUndefined()
  })

  test('returns undefined for empty', () => {
    expect(findPhoneCountryByCode('')).toBeUndefined()
  })
})

describe('findPhoneCountryByDialCode', () => {
  test('finds by +44', () => {
    expect(findPhoneCountryByDialCode('+44')?.code).toBe('GB')
  })

  test('finds by 44 (without +)', () => {
    expect(findPhoneCountryByDialCode('44')?.code).toBe('GB')
  })

  test('returns undefined for unknown', () => {
    expect(findPhoneCountryByDialCode('+999')).toBeUndefined()
  })
})
