import { describe, test, expect } from 'vitest'
import { countryFlag } from '../../phone/flags'

describe('countryFlag', () => {
  test('US flag', () => {
    expect(countryFlag('US')).toBe('\u{1F1FA}\u{1F1F8}')
  })

  test('GB flag', () => {
    expect(countryFlag('GB')).toBe('\u{1F1EC}\u{1F1E7}')
  })

  test('case insensitive', () => {
    expect(countryFlag('us')).toBe(countryFlag('US'))
  })

  test('JP flag', () => {
    expect(countryFlag('JP')).toBe('\u{1F1EF}\u{1F1F5}')
  })
})
