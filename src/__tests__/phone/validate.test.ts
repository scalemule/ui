import { describe, test, expect } from 'vitest'
import { isValidE164Phone } from '../../phone/validate'

describe('isValidE164Phone', () => {
  test('valid US number', () => {
    expect(isValidE164Phone('+14155551234')).toBe(true)
  })

  test('valid UK number', () => {
    expect(isValidE164Phone('+447911123456')).toBe(true)
  })

  test('valid HK number', () => {
    expect(isValidE164Phone('+85212345678')).toBe(true)
  })

  test('valid Singapore number', () => {
    expect(isValidE164Phone('+6512345678')).toBe(true)
  })

  test('too short', () => {
    expect(isValidE164Phone('+1415')).toBe(false)
  })

  test('no plus prefix', () => {
    expect(isValidE164Phone('4155551234')).toBe(false)
  })

  test('leading zero after plus', () => {
    expect(isValidE164Phone('+0155551234')).toBe(false)
  })

  test('just plus sign', () => {
    expect(isValidE164Phone('+')).toBe(false)
  })

  test('empty string', () => {
    expect(isValidE164Phone('')).toBe(false)
  })

  test('max length (15 digits)', () => {
    expect(isValidE164Phone('+123456789012345')).toBe(true)
  })

  test('too long (16 digits)', () => {
    expect(isValidE164Phone('+1234567890123456')).toBe(false)
  })

  test('min length (7 digits)', () => {
    expect(isValidE164Phone('+1234567')).toBe(true)
  })
})
