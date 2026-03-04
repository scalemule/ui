import { describe, test, expect } from 'vitest'
import { normalizePhoneNumber, normalizeAndValidatePhone } from '../../phone/normalize'

describe('normalizePhoneNumber', () => {
  test('keeps E.164 format intact', () => {
    expect(normalizePhoneNumber('+14155551234')).toBe('+14155551234')
  })

  test('strips formatting from plus-prefixed number', () => {
    expect(normalizePhoneNumber('+44 20-1234-5678')).toBe('+442012345678')
  })

  test('handles 00-prefix international', () => {
    expect(normalizePhoneNumber('0044201234')).toBe('+44201234')
  })

  test('adds + for bare digits', () => {
    expect(normalizePhoneNumber('4155551234')).toBe('+4155551234')
  })

  test('strips parentheses and spaces', () => {
    expect(normalizePhoneNumber('(415) 555-1234')).toBe('+4155551234')
  })

  test('returns empty for empty input', () => {
    expect(normalizePhoneNumber('')).toBe('')
  })

  test('returns empty for whitespace only', () => {
    expect(normalizePhoneNumber('   ')).toBe('')
  })

  test('returns empty for non-digit input', () => {
    expect(normalizePhoneNumber('abc')).toBe('')
  })

  test('handles non-string gracefully', () => {
    expect(normalizePhoneNumber(null as any)).toBe('')
  })
})

describe('normalizeAndValidatePhone', () => {
  test('valid E.164 number', () => {
    const result = normalizeAndValidatePhone('+14155551234')
    expect(result.valid).toBe(true)
    expect(result.normalized).toBe('+14155551234')
    expect(result.error).toBeNull()
  })

  test('normalizes and validates formatted number', () => {
    const result = normalizeAndValidatePhone('+44 7911 123456')
    expect(result.valid).toBe(true)
    expect(result.normalized).toBe('+447911123456')
  })

  test('returns error for empty input', () => {
    const result = normalizeAndValidatePhone('')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Phone number is required')
  })

  test('returns error for too short number', () => {
    const result = normalizeAndValidatePhone('+1415')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('E.164')
  })
})
