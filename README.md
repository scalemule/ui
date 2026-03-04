# @scalemule/ui

Shared phone utilities and optional React input components for ScaleMule SDKs.

## Install

```bash
npm install @scalemule/ui
```

## Exports

`@scalemule/ui` and `@scalemule/ui/phone` export:

- `PHONE_COUNTRIES`
- `normalizePhoneNumber`, `normalizeAndValidatePhone`
- `composePhoneNumber`
- `isValidE164Phone`, `E164_REGEX`
- `findPhoneCountryByCode`, `findPhoneCountryByDialCode`, `detectCountryFromE164`
- `countryFlag`

`@scalemule/ui/react` exports:

- `PhoneInput`
- `CountrySelect`, `COUNTRIES`

## Usage

```ts
import { normalizeAndValidatePhone } from '@scalemule/ui/phone'

const result = normalizeAndValidatePhone('(415) 555-0123', 'US')
```

```tsx
import { PhoneInput } from '@scalemule/ui/react'

export function PhoneField() {
  return <PhoneInput value="" onChange={() => {}} />
}
```

## License

MIT
