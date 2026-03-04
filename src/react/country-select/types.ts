export interface Country {
  code: string
  name: string
}

export interface CountrySelectClassNames {
  root?: string
  label?: string
  trigger?: string
  dropdown?: string
  search?: string
  list?: string
  option?: string
  optionActive?: string
  optionSelected?: string
}

export interface CountrySelectProps {
  value: string
  onChange: (code: string) => void
  countries?: Country[]
  label?: string
  disabled?: boolean
  id?: string
  classNames?: CountrySelectClassNames
  /** Placeholder when no country selected */
  placeholder?: string
}
