import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import type { CountrySelectProps, Country } from './types'
import { COUNTRIES } from './countries'
import { countryFlag } from '../../phone/flags'

const DEFAULT_VALUE = 'US'

export function CountrySelect({
  value,
  onChange,
  countries,
  label,
  disabled = false,
  id,
  classNames = {},
  placeholder = 'Select country',
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const instanceId = useMemo(() => id ?? `country-${Math.random().toString(36).slice(2, 8)}`, [id])
  const listboxId = `country-listbox-${instanceId}`

  const list = countries ?? COUNTRIES
  const selected = value || DEFAULT_VALUE
  const selectedCountry = list.find((c) => c.code === selected)

  const filtered = useMemo(() => {
    if (!search) return list
    const q = search.toLowerCase()
    return list.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    )
  }, [search, list])

  // Reset active index when filtered list changes
  useEffect(() => {
    setActiveIndex(0)
  }, [filtered.length])

  const openDropdown = useCallback(() => {
    if (disabled) return
    setIsOpen(true)
    setSearch('')
    setActiveIndex(0)
    requestAnimationFrame(() => searchRef.current?.focus())
  }, [disabled])

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
    setSearch('')
  }, [])

  const selectCountry = useCallback(
    (country: Country) => {
      onChange(country.code)
      setIsOpen(false)
      setSearch('')
      requestAnimationFrame(() => triggerRef.current?.focus())
    },
    [onChange]
  )

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
  }, [isOpen, closeDropdown])

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
    const count = filtered.length
    if (count === 0 && e.key !== 'Escape') return

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
        if (filtered[activeIndex]) selectCountry(filtered[activeIndex])
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
    const active = filtered[activeIndex]
    if (!active) return
    const el = document.getElementById(`country-opt-${instanceId}-${active.code}`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, isOpen, filtered, instanceId])

  const activeCountry = filtered[activeIndex]

  // -- Inline styles (zero external CSS) --

  const S = {
    root: {
      position: 'relative' as const,
      display: 'inline-block',
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '14px',
      fontWeight: 500 as const,
      color: '#374151',
    },
    trigger: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 14px',
      fontSize: '15px',
      lineHeight: '1.4',
      fontFamily: 'inherit',
      color: '#1f2937',
      backgroundColor: '#fff',
      border: '1px solid #d1d5db',
      borderRadius: '10px',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'border-color 0.15s, box-shadow 0.15s',
      outline: 'none',
      minWidth: 0,
      whiteSpace: 'nowrap' as const,
    },
    triggerFlag: {
      fontSize: '20px',
      lineHeight: 1,
    },
    triggerName: {
      fontSize: '15px',
      fontWeight: 500 as const,
      color: '#1f2937',
    },
    triggerChevron: {
      marginLeft: '2px',
      color: '#9ca3af',
      transition: 'transform 0.15s',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      flexShrink: 0,
    },
    dropdown: {
      position: 'absolute' as const,
      top: 'calc(100% + 6px)',
      left: 0,
      zIndex: 100,
      width: '300px',
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      animation: 'none',
    },
    searchWrap: {
      padding: '10px 12px',
      borderBottom: '1px solid #f3f4f6',
    },
    search: {
      display: 'block',
      width: '100%',
      padding: '8px 12px',
      fontSize: '14px',
      lineHeight: '1.4',
      fontFamily: 'inherit',
      color: '#1f2937',
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      outline: 'none',
      boxSizing: 'border-box' as const,
      transition: 'border-color 0.15s, box-shadow 0.15s',
    },
    list: {
      maxHeight: '240px',
      overflow: 'auto',
      margin: 0,
      padding: '4px',
      listStyle: 'none',
    },
    option: (isActive: boolean, isSelected: boolean) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 10px',
      cursor: 'pointer',
      borderRadius: '8px',
      fontSize: '14px',
      lineHeight: '1.4',
      color: isSelected ? '#065f46' : '#1f2937',
      backgroundColor: isActive ? '#f0fdf4' : 'transparent',
      fontWeight: isSelected ? (600 as const) : (400 as const),
      transition: 'background-color 0.1s',
    }),
    optionFlag: {
      fontSize: '18px',
      lineHeight: 1,
      flexShrink: 0,
    },
    optionName: {
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    },
    optionCode: {
      fontSize: '12px',
      color: '#9ca3af',
      fontFamily: 'monospace',
      flexShrink: 0,
    },
    optionCheck: {
      fontSize: '14px',
      color: '#059669',
      flexShrink: 0,
      width: '18px',
      textAlign: 'center' as const,
    },
    empty: {
      padding: '16px',
      textAlign: 'center' as const,
      color: '#9ca3af',
      fontSize: '14px',
    },
  }

  return (
    <div data-country-select="" className={classNames.root} style={S.root}>
      {label && (
        <label htmlFor={instanceId} className={classNames.label} style={S.label}>
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        id={instanceId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={selectedCountry ? `Country: ${selectedCountry.name}` : placeholder}
        disabled={disabled}
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#a7f3d0'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.15)'
        }}
        onBlur={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = '#d1d5db'
            e.currentTarget.style.boxShadow = 'none'
          }
        }}
        className={classNames.trigger}
        style={S.trigger}
      >
        {selectedCountry ? (
          <>
            <span style={S.triggerFlag}>{countryFlag(selectedCountry.code)}</span>
            <span style={S.triggerName}>{selectedCountry.name}</span>
          </>
        ) : (
          <span style={{ ...S.triggerName, color: '#9ca3af' }}>{placeholder}</span>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={S.triggerChevron}
          aria-hidden="true"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div ref={dropdownRef} data-country-dropdown="" className={classNames.dropdown} style={S.dropdown}>
          <div style={S.searchWrap}>
            <input
              ref={searchRef}
              type="text"
              role="searchbox"
              aria-label="Search countries"
              aria-controls={listboxId}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#a7f3d0'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.12)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.boxShadow = 'none'
              }}
              placeholder="Search countries..."
              className={classNames.search}
              style={S.search}
            />
          </div>

          <ul
            id={listboxId}
            role="listbox"
            aria-label="Countries"
            aria-activedescendant={
              activeCountry ? `country-opt-${instanceId}-${activeCountry.code}` : undefined
            }
            className={classNames.list}
            style={S.list}
          >
            {filtered.map((country, i) => {
              const isActive = i === activeIndex
              const isSelected = country.code === selected
              let optClass = classNames.option ?? ''
              if (isActive && classNames.optionActive) optClass += ` ${classNames.optionActive}`
              if (isSelected && classNames.optionSelected)
                optClass += ` ${classNames.optionSelected}`

              return (
                <li
                  key={country.code}
                  id={`country-opt-${instanceId}-${country.code}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectCountry(country)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={optClass || undefined}
                  style={S.option(isActive, isSelected)}
                >
                  <span style={S.optionFlag}>{countryFlag(country.code)}</span>
                  <span style={S.optionName}>{country.name}</span>
                  <span style={S.optionCode}>{country.code}</span>
                  <span style={S.optionCheck}>{isSelected ? '\u2713' : ''}</span>
                </li>
              )
            })}
            {filtered.length === 0 && (
              <li style={S.empty}>No countries found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
