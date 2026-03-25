import React, { useState, useCallback } from 'react'
import { getShareIntentUrl, canUseNativeShare, triggerNativeShare } from '../../share'
import type { SharePlatform } from '../../share'
import type { ShareButtonsProps } from './types'
import { getPlatformIcon, getPlatformLabel, CheckIcon } from './icons'

const DEFAULT_PLATFORMS: SharePlatform[] = ['copy', 'whatsapp', 'x', 'native']

const ICON_SIZES: Record<string, number> = {
  sm: 16,
  md: 20,
  lg: 24,
}

export function ShareButtons({
  url,
  text,
  title,
  platforms,
  onShare,
  onCopied,
  classNames,
  renderButton,
  layout = 'row',
  size = 'md',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  // Filter out native when not available
  const resolvedPlatforms = (platforms || DEFAULT_PLATFORMS).filter(
    (p) => p !== 'native' || canUseNativeShare()
  )

  const iconSize = ICON_SIZES[size] || ICON_SIZES.md

  const handleClick = useCallback(
    async (platform: SharePlatform) => {
      if (platform === 'copy') {
        try {
          await navigator.clipboard.writeText(url)
        } catch {
          // Fallback for older browsers
          const textarea = document.createElement('textarea')
          textarea.value = url
          textarea.style.position = 'fixed'
          textarea.style.opacity = '0'
          document.body.appendChild(textarea)
          textarea.select()
          document.execCommand('copy')
          document.body.removeChild(textarea)
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        onCopied?.()
        onShare?.('copy')
        return
      }

      if (platform === 'native') {
        const shared = await triggerNativeShare({ url, text, title })
        if (shared) {
          onShare?.('native')
        }
        return
      }

      // External platform — open in new tab
      const intentUrl = getShareIntentUrl(platform, { url, text, title })
      if (intentUrl) {
        window.open(intentUrl, '_blank', 'noopener,noreferrer')
        onShare?.(platform)
      }
    },
    [url, text, title, onShare, onCopied]
  )

  const rootStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: layout === 'column' ? 'column' : 'row',
    gap: '8px',
    alignItems: layout === 'column' ? 'stretch' : 'center',
  }

  return (
    <div className={classNames?.root} style={!classNames?.root ? rootStyle : undefined}>
      {resolvedPlatforms.map((platform) => {
        if (renderButton) {
          return (
            <React.Fragment key={platform}>
              {renderButton(platform, () => handleClick(platform))}
            </React.Fragment>
          )
        }

        const Icon = platform === 'copy' && copied ? CheckIcon : getPlatformIcon(platform)
        const label = platform === 'copy' && copied ? 'Copied!' : getPlatformLabel(platform)

        return (
          <button
            key={platform}
            type="button"
            onClick={() => handleClick(platform)}
            className={classNames?.button}
            aria-label={`Share via ${getPlatformLabel(platform)}`}
            title={getPlatformLabel(platform)}
          >
            {Icon && <Icon className={classNames?.icon} size={iconSize} />}
            {classNames?.label !== undefined && (
              <span className={classNames.label}>{label}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
