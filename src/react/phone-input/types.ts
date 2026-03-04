export interface PhoneInputClassNames {
  root?: string
  trigger?: string
  dropdown?: string
  search?: string
  list?: string
  option?: string
  optionActive?: string
  optionSelected?: string
  numberInput?: string
}

export interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  defaultCountry?: string
  classNames?: PhoneInputClassNames
  disabled?: boolean
  autoFocus?: boolean
  id?: string
  placeholder?: string
}
