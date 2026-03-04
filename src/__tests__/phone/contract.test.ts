import { describe, test, expect } from 'vitest'
import { isValidE164Phone } from '../../phone/validate'
import fixtures from '../../phone/fixtures.json'

describe('E.164 contract parity (shared fixtures)', () => {
  test.each(fixtures.accepted)('accepts %s', (phone) => {
    expect(isValidE164Phone(phone)).toBe(true)
  })

  test.each(fixtures.rejected)('rejects %s', (phone) => {
    expect(isValidE164Phone(phone)).toBe(false)
  })
})
