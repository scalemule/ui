export const E164_REGEX = /^\+[1-9]\d{6,14}$/

export function isValidE164Phone(input: string): boolean {
  return E164_REGEX.test(input)
}
