import React from 'react'
import type { ShareCTAProps } from './types'

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  banner: { padding: '12px 16px', borderRadius: '12px' },
  card: { padding: '20px', borderRadius: '16px' },
  inline: { padding: '8px 0' },
  floating: { position: 'fixed', bottom: 80, left: 16, right: 16, padding: '16px', borderRadius: '16px', zIndex: 30 },
}

export function ShareCTA({
  children,
  text,
  variant = 'card',
  dismissible = false,
  dismissed = false,
  onDismiss,
  classNames,
}: ShareCTAProps) {
  if (dismissed) return null

  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.card

  return (
    <div className={classNames?.root} style={!classNames?.root ? variantStyle : undefined}>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className={classNames?.dismissButton}
          style={!classNames?.dismissButton ? {
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            fontSize: '18px',
            lineHeight: 1,
            color: 'inherit',
            opacity: 0.6,
          } : undefined}
          aria-label="Dismiss"
        >
          &times;
        </button>
      )}
      <p className={classNames?.text} style={!classNames?.text ? { margin: '0 0 12px', fontSize: '14px' } : undefined}>
        {text}
      </p>
      <div className={classNames?.content}>
        {children}
      </div>
    </div>
  )
}
