export interface PhoneCountry {
  code: string
  name: string
  dialCode: string
}

export interface PhoneNormalizationResult {
  input: string
  normalized: string | null
  valid: boolean
  error: string | null
}

export interface DetectedPhone {
  country: PhoneCountry
  local: string
}
