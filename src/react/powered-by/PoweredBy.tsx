import React from 'react'
import type { PoweredByProps } from './types'

const POSITION_STYLES: Record<string, React.CSSProperties> = {
  'bottom-left': { position: 'fixed', bottom: 16, left: 16, zIndex: 40 },
  'bottom-center': { position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 40 },
  'bottom-right': { position: 'fixed', bottom: 16, right: 16, zIndex: 40 },
  inline: {},
}

const DEFAULT_LINK_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  color: '#9ca3af',
  textDecoration: 'none',
}

export function PoweredBy({
  brandName,
  href,
  logo,
  position = 'inline',
  newTab = true,
  classNames,
  onClick,
}: PoweredByProps) {
  const positionStyle = POSITION_STYLES[position] || POSITION_STYLES.inline

  const logoElement =
    typeof logo === 'string' ? (
      <img src={logo} alt="" className={classNames?.logo} style={{ height: '14px', width: 'auto' }} />
    ) : logo ? (
      <span className={classNames?.logo}>{logo}</span>
    ) : null

  return (
    <div className={classNames?.root} style={!classNames?.root ? positionStyle : undefined}>
      <a
        href={href}
        className={classNames?.link}
        style={!classNames?.link ? DEFAULT_LINK_STYLE : undefined}
        onClick={onClick}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        aria-label={`Powered by ${brandName}`}
      >
        <span className={classNames?.text}>Powered by</span>
        {logoElement}
        <span className={classNames?.text}>{brandName}</span>
      </a>
    </div>
  )
}
