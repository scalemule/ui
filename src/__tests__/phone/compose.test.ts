import { describe, test, expect } from 'vitest'
import { composePhoneNumber } from '../../phone/compose'

describe('composePhoneNumber', () => {
  test('compose basic US number', () => {
    expect(composePhoneNumber('+1', '4155551234')).toBe('+14155551234')
  })

  test('compose strips formatting from local number', () => {
    expect(composePhoneNumber('+44', '20-1234-5678')).toBe('+442012345678')
  })

  test('compose with spaces in local number', () => {
    expect(composePhoneNumber('+49', '170 123 4567')).toBe('+491701234567')
  })

  test('returns empty for empty dial code', () => {
    expect(composePhoneNumber('', '4155551234')).toBe('')
  })

  test('returns empty for empty local number', () => {
    expect(composePhoneNumber('+1', '')).toBe('')
  })

  test('returns empty for both empty', () => {
    expect(composePhoneNumber('', '')).toBe('')
  })

  test('compose with HK dial code', () => {
    expect(composePhoneNumber('+852', '12345678')).toBe('+85212345678')
  })
})
