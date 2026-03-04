import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PhoneInput } from '../../react/phone-input'

describe('PhoneInput', () => {
  test('default render shows US flag and +1', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} />)

    const trigger = screen.getByRole('button', { name: /select country/i })
    expect(trigger).toHaveTextContent('+1')
    expect(screen.getByRole('textbox', { name: /phone number/i })).toHaveValue('')
  })

  test('controlled value parses E.164 to country + local', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="+447911123456" onChange={onChange} />)

    const trigger = screen.getByRole('button', { name: /select country/i })
    expect(trigger).toHaveTextContent('+44')
    expect(screen.getByRole('textbox', { name: /phone number/i })).toHaveValue('7911123456')
  })

  test('country select recomposes E.164', async () => {
    const onChange = vi.fn()
    render(<PhoneInput value="+14155551234" onChange={onChange} />)

    // Open dropdown
    fireEvent.click(screen.getByRole('button', { name: /select country/i }))

    // Search for Germany
    const searchInput = screen.getByRole('searchbox', { name: /filter countries/i })
    fireEvent.change(searchInput, { target: { value: 'Germany' } })

    // Click Germany option
    const germany = screen.getByRole('option', { name: /germany/i })
    fireEvent.click(germany)

    // Should recompose with +49
    expect(onChange).toHaveBeenCalledWith('+494155551234')
  })

  test('search by name filters options', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: /select country/i }))

    const searchInput = screen.getByRole('searchbox', { name: /filter countries/i })
    fireEvent.change(searchInput, { target: { value: 'United K' } })

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent('United Kingdom')
  })

  test('search by dial code', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: /select country/i }))

    const searchInput = screen.getByRole('searchbox', { name: /filter countries/i })
    fireEvent.change(searchInput, { target: { value: '+49' } })

    const options = screen.getAllByRole('option')
    expect(options.length).toBeGreaterThanOrEqual(1)
    expect(options[0]).toHaveTextContent('Germany')
  })

  test('number input emits composed E.164', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} />)

    const input = screen.getByRole('textbox', { name: /phone number/i })
    fireEvent.change(input, { target: { value: '4155551234' } })

    expect(onChange).toHaveBeenCalledWith('+14155551234')
  })

  test('paste full E.164 auto-detects country', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} />)

    const input = screen.getByRole('textbox', { name: /phone number/i })
    fireEvent.change(input, { target: { value: '+447911123456' } })

    expect(onChange).toHaveBeenCalledWith('+447911123456')
    // Trigger should now show UK
    const trigger = screen.getByRole('button', { name: /select country/i })
    expect(trigger).toHaveTextContent('+44')
  })

  test('paste formatted E.164 strips non-digits and emits clean value', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} />)

    const input = screen.getByRole('textbox', { name: /phone number/i })
    fireEvent.change(input, { target: { value: '+44 7911 123456' } })

    // Must emit strict E.164 (no spaces), not the raw paste
    expect(onChange).toHaveBeenCalledWith('+447911123456')
    // Local state should be digits only
    expect(input).toHaveValue('7911123456')
  })

  test('ambiguous +1 defaults to US', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="+14155551234" onChange={onChange} />)

    const trigger = screen.getByRole('button', { name: /select country/i })
    expect(trigger).toHaveTextContent('+1')
    expect(trigger.getAttribute('aria-label')).toContain('United States')
  })

  test('external reset to empty restores default country', () => {
    const onChange = vi.fn()
    const { rerender } = render(<PhoneInput value="+447911123456" onChange={onChange} />)

    // Verify it parsed as GB
    expect(screen.getByRole('button', { name: /select country/i })).toHaveTextContent('+44')

    // Rerender with empty value
    rerender(<PhoneInput value="" onChange={onChange} />)

    const trigger = screen.getByRole('button', { name: /select country/i })
    expect(trigger).toHaveTextContent('+1')
    expect(screen.getByRole('textbox', { name: /phone number/i })).toHaveValue('')
  })

  test('keyboard: Enter on trigger opens dropdown', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} />)

    const trigger = screen.getByRole('button', { name: /select country/i })
    fireEvent.keyDown(trigger, { key: 'Enter' })

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('searchbox', { name: /filter countries/i })).toBeInTheDocument()
  })

  test('keyboard: ArrowDown navigates options', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: /select country/i }))

    const searchInput = screen.getByRole('searchbox', { name: /filter countries/i })
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' })

    const listbox = screen.getByRole('listbox')
    const activeId = listbox.getAttribute('aria-activedescendant')
    // After one ArrowDown from index 0, should be on the second country (CA)
    expect(activeId).toBe('phone-opt-CA')
  })

  test('keyboard: Enter selects option and closes', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: /select country/i }))

    const searchInput = screen.getByRole('searchbox', { name: /filter countries/i })
    // Navigate to GB (index 2)
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
    fireEvent.keyDown(searchInput, { key: 'Enter' })

    // Dropdown should be closed
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
    // GB should be selected
    const trigger = screen.getByRole('button', { name: /select country/i })
    expect(trigger).toHaveTextContent('+44')
  })

  test('keyboard: Escape closes without selecting', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: /select country/i }))

    const searchInput = screen.getByRole('searchbox', { name: /filter countries/i })
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
    fireEvent.keyDown(searchInput, { key: 'Escape' })

    // Dropdown should be closed
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
    // Still US (original)
    const trigger = screen.getByRole('button', { name: /select country/i })
    expect(trigger).toHaveTextContent('+1')
  })

  test('disabled state prevents interaction', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} disabled />)

    const trigger = screen.getByRole('button', { name: /select country/i })
    expect(trigger).toBeDisabled()

    const input = screen.getByRole('textbox', { name: /phone number/i })
    expect(input).toBeDisabled()

    // Clicking trigger should not open dropdown
    fireEvent.click(trigger)
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
  })

  test('aria-expanded reflects dropdown state', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} />)

    const trigger = screen.getByRole('button', { name: /select country/i })
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  test('aria-label updates after country selection', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} />)

    const trigger = screen.getByRole('button', { name: /select country/i })
    expect(trigger.getAttribute('aria-label')).toContain('United States')
    expect(trigger.getAttribute('aria-label')).toContain('+1')

    // Select GB
    fireEvent.click(trigger)
    const searchInput = screen.getByRole('searchbox', { name: /filter countries/i })
    fireEvent.change(searchInput, { target: { value: 'United Kingdom' } })
    fireEvent.click(screen.getByRole('option', { name: /united kingdom/i }))

    expect(trigger.getAttribute('aria-label')).toContain('United Kingdom')
    expect(trigger.getAttribute('aria-label')).toContain('+44')
  })

  test('aria-selected marks current country', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="+447911123456" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: /select country/i }))

    const gbOption = screen.getByRole('option', { name: /united kingdom/i })
    expect(gbOption.getAttribute('aria-selected')).toBe('true')

    const usOption = screen.getByRole('option', { name: /united states/i })
    expect(usOption.getAttribute('aria-selected')).toBe('false')
  })

  test('live region announces country selection', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: /select country/i }))
    const searchInput = screen.getByRole('searchbox', { name: /filter countries/i })
    fireEvent.change(searchInput, { target: { value: 'United Kingdom' } })
    fireEvent.click(screen.getByRole('option', { name: /united kingdom/i }))

    const liveRegion = document.querySelector('[aria-live="polite"]')
    expect(liveRegion?.textContent).toContain('United Kingdom')
    expect(liveRegion?.textContent).toContain('+44')
  })

  test('defaultCountry prop sets initial country', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="" onChange={onChange} defaultCountry="DE" />)

    const trigger = screen.getByRole('button', { name: /select country/i })
    expect(trigger).toHaveTextContent('+49')
    expect(trigger.getAttribute('aria-label')).toContain('Germany')
  })
})
