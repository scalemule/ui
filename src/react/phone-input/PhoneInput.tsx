import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import type { PhoneInputProps } from './types'
import type { PhoneCountry } from '../../phone/types'
import { PHONE_COUNTRIES } from '../../phone/countries'
import { composePhoneNumber } from '../../phone/compose'
import { detectCountryFromE164 } from '../../phone/detect'
import { findPhoneCountryByCode } from '../../phone/detect'
import { countryFlag } from '../../phone/flags'

const DEFAULT_COUNTRY = 'US'

export function PhoneInput({
  value,
  onChange,
  defaultCountry = DEFAULT_COUNTRY,
  classNames = {},
  disabled = false,
  autoFocus = false,
  id,
  placeholder = 'Phone number',
}: PhoneInputProps) {
  const defaultCtry = findPhoneCountryByCode(defaultCountry) ?? PHONE_COUNTRIES[0]
  const [selectedCountry, setSelectedCountry] = useState<PhoneCountry>(defaultCtry)
  const [localNumber, setLocalNumber] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [announcement, setAnnouncement] = useState('')

  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const numberRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const instanceId = useMemo(() => id ?? `phone-${Math.random().toString(36).slice(2, 8)}`, [id])
  const listboxId = `phone-listbox-${instanceId}`

  // Sync from external value prop
  const prevValueRef = useRef(value)
  useEffect(() => {
    if (value === prevValueRef.current) return
    prevValueRef.current = value

    if (!value) {
      setSelectedCountry(defaultCtry)
      setLocalNumber('')
      return
    }

    const detected = detectCountryFromE164(value)
    if (detected) {
      setSelectedCountry(detected.country)
      setLocalNumber(detected.local)
    }
  }, [value, defaultCtry])

  // Initial mount: detect from value
  const mountedRef = useRef(false)
  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true
    if (value) {
      const detected = detectCountryFromE164(value)
      if (detected) {
        setSelectedCountry(detected.country)
        setLocalNumber(detected.local)
      }
    }
  }, [value])

  const filteredCountries = useMemo(() => {
    if (!search) return PHONE_COUNTRIES
    const q = search.toLowerCase()
    return PHONE_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dialCode.includes(q)
    )
  }, [search])

  // Reset active index when filtered list changes
  useEffect(() => {
    setActiveIndex(0)
  }, [filteredCountries.length])

  const emitChange = useCallback(
    (country: PhoneCountry, local: string) => {
      const composed = composePhoneNumber(country.dialCode, local)
      onChange(composed)
    },
    [onChange]
  )

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value

    // Full E.164 paste detection: if input starts with +, auto-detect country
    if (raw.startsWith('+') && raw.length > 3) {
      const detected = detectCountryFromE164(raw)
      if (detected) {
        setSelectedCountry(detected.country)
        setLocalNumber(detected.local)
        // Emit via compose to guarantee strict E.164 (digits only)
        const composed = composePhoneNumber(detected.country.dialCode, detected.local)
        prevValueRef.current = composed
        onChange(composed)
        return
      }
    }

    const digits = raw.replace(/\D/g, '')
    setLocalNumber(digits)
    emitChange(selectedCountry, digits)
  }

  const selectCountry = (country: PhoneCountry) => {
    setSelectedCountry(country)
    setIsOpen(false)
    setSearch('')
    setAnnouncement(`${country.name} ${country.dialCode} selected`)
    emitChange(country, localNumber)
    // Focus number input after selection
    requestAnimationFrame(() => numberRef.current?.focus())
  }

  const openDropdown = () => {
    if (disabled) return
    setIsOpen(true)
    setSearch('')
    setActiveIndex(0)
    requestAnimationFrame(() => searchRef.current?.focus())
  }

  const closeDropdown = () => {
    setIsOpen(false)
    setSearch('')
  }

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (isOpen) closeDropdown()
      else openDropdown()
    } else if (e.key === 'Escape' && isOpen) {
      e.preventDefault()
      closeDropdown()
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    const count = filteredCountries.length
    if (count === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((i) => (i + 1) % count)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((i) => (i - 1 + count) % count)
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        e.preventDefault()
        setActiveIndex(count - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (filteredCountries[activeIndex]) {
          selectCountry(filteredCountries[activeIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        closeDropdown()
        triggerRef.current?.focus()
        break
    }
  }

  // Scroll active option into view
  useEffect(() => {
    if (!isOpen) return
    const active = filteredCountries[activeIndex]
    if (!active) return
    const el = document.getElementById(`phone-opt-${active.code}`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, isOpen, filteredCountries])

  const activeCountry = filteredCountries[activeIndex]
  const triggerLabel = `Select country: ${selectedCountry.name} ${selectedCountry.dialCode}`

  return (
    <div data-phone-input="" className={classNames.root} style={{ position: 'relative', display: 'flex', gap: '4px' }}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-controls={listboxId}
        aria-label={triggerLabel}
        disabled={disabled}
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
        className={classNames.trigger}
        style={{ whiteSpace: 'nowrap', cursor: disabled ? 'default' : 'pointer' }}
      >
        {countryFlag(selectedCountry.code)} {selectedCountry.dialCode}{' '}
        <span aria-hidden="true" style={{ fontSize: '0.6em' }}>&#9660;</span>
      </button>

      <input
        ref={numberRef}
        type="tel"
        inputMode="numeric"
        aria-label="Phone number"
        value={localNumber}
        onChange={handleNumberChange}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={classNames.numberInput}
        style={{ flex: 1 }}
      />

      {isOpen && (
        <div
          ref={dropdownRef}
          data-phone-dropdown=""
          className={classNames.dropdown}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 50,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginTop: '2px',
            width: '280px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <input
            ref={searchRef}
            type="text"
            role="searchbox"
            aria-label="Filter countries"
            aria-controls={listboxId}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search countries..."
            className={classNames.search}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px',
              borderBottom: '1px solid #eee',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label="Countries"
            aria-activedescendant={activeCountry ? `phone-opt-${activeCountry.code}` : undefined}
            className={classNames.list}
            style={{ maxHeight: '200px', overflow: 'auto', margin: 0, padding: 0, listStyle: 'none' }}
          >
            {filteredCountries.map((country, i) => {
              const isActive = i === activeIndex
              const isSelected = country.code === selectedCountry.code
              let optionClass = classNames.option ?? ''
              if (isActive && classNames.optionActive) optionClass += ` ${classNames.optionActive}`
              if (isSelected && classNames.optionSelected) optionClass += ` ${classNames.optionSelected}`
              return (
                <li
                  key={country.code}
                  id={`phone-opt-${country.code}`}
                  role="option"
                  aria-selected={isSelected ? 'true' : 'false'}
                  onClick={() => selectCountry(country)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={optionClass || undefined}
                  style={{
                    padding: '6px 8px',
                    cursor: 'pointer',
                    background: isActive ? '#f0f0f0' : 'transparent',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {countryFlag(country.code)} {country.name} ({country.dialCode})
                </li>
              )
            })}
            {filteredCountries.length === 0 && (
              <li style={{ padding: '8px', color: '#999', textAlign: 'center' }}>No countries found</li>
            )}
          </ul>
        </div>
      )}

      <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
        {announcement}
      </div>
    </div>
  )
}
