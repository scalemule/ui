import React, { useEffect, useState, useCallback } from 'react'

// ============================================================================
// Types
// ============================================================================

export interface NotificationToastProps {
  /** Unique notification ID */
  id: string
  /** Notification title */
  title: string
  /** Notification body text */
  body: string
  /** Icon/thumbnail URL */
  iconUrl?: string
  /** Deep link URL — called on click */
  actionUrl?: string
  /** Auto-hide after this many ms (0 = no auto-hide) */
  autoHideDuration?: number
  /** Called when the toast should be dismissed */
  onDismiss: (id: string) => void
  /** Called when the user clicks the toast body/action */
  onAction?: (id: string, actionUrl?: string) => void
  /** Custom CSS class names for styling */
  classNames?: NotificationToastClassNames
}

export interface NotificationToastClassNames {
  root?: string
  icon?: string
  content?: string
  title?: string
  body?: string
  dismissButton?: string
  progressBar?: string
}

// ============================================================================
// Styles (CSS custom properties for theming)
// ============================================================================

const defaultStyles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px 16px',
    background: 'var(--sm-toast-bg, #ffffff)',
    color: 'var(--sm-toast-text, #1a1a1a)',
    borderRadius: 'var(--sm-toast-border-radius, 10px)',
    boxShadow: 'var(--sm-toast-shadow, 0 4px 20px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08))',
    fontFamily: 'var(--sm-toast-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    fontSize: '14px',
    lineHeight: '1.4',
    maxWidth: '380px',
    width: '100%',
    cursor: 'pointer',
    position: 'relative' as const,
    overflow: 'hidden',
    border: '1px solid var(--sm-toast-border, rgba(0, 0, 0, 0.06))',
    transition: 'opacity 0.2s ease, transform 0.3s ease',
  },
  icon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    objectFit: 'cover' as const,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontWeight: 600,
    marginBottom: '2px',
    color: 'var(--sm-toast-text, #1a1a1a)',
  },
  body: {
    color: 'var(--sm-toast-text-secondary, #666)',
    fontSize: '13px',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dismissButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    color: 'var(--sm-toast-text-secondary, #999)',
    fontSize: '18px',
    lineHeight: 1,
    flexShrink: 0,
  },
  progressBar: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    height: '3px',
    background: 'var(--sm-toast-accent, #3b82f6)',
    borderRadius: '0 0 0 var(--sm-toast-border-radius, 10px)',
    transition: 'width linear',
  },
}

// ============================================================================
// Component
// ============================================================================

export function NotificationToast({
  id,
  title,
  body,
  iconUrl,
  actionUrl,
  autoHideDuration = 5000,
  onDismiss,
  onAction,
  classNames,
}: NotificationToastProps) {
  const [progress, setProgress] = useState(100)
  const [paused, setPaused] = useState(false)

  const handleDismiss = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onDismiss(id)
    },
    [id, onDismiss]
  )

  const handleClick = useCallback(() => {
    if (onAction) {
      onAction(id, actionUrl)
    }
    onDismiss(id)
  }, [id, actionUrl, onAction, onDismiss])

  // Auto-hide timer with progress bar
  useEffect(() => {
    if (autoHideDuration <= 0 || paused) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / autoHideDuration) * 100)
      setProgress(remaining)

      if (remaining <= 0) {
        clearInterval(interval)
        onDismiss(id)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [id, autoHideDuration, paused, onDismiss])

  return (
    <div
      className={classNames?.root}
      style={classNames?.root ? undefined : defaultStyles.root}
      onClick={handleClick}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="alert"
    >
      {iconUrl && (
        <img
          src={iconUrl}
          alt=""
          className={classNames?.icon}
          style={classNames?.icon ? undefined : defaultStyles.icon}
        />
      )}

      <div
        className={classNames?.content}
        style={classNames?.content ? undefined : defaultStyles.content}
      >
        <div
          className={classNames?.title}
          style={classNames?.title ? undefined : defaultStyles.title}
        >
          {title}
        </div>
        <div
          className={classNames?.body}
          style={classNames?.body ? undefined : defaultStyles.body}
        >
          {body}
        </div>
      </div>

      <button
        className={classNames?.dismissButton}
        style={classNames?.dismissButton ? undefined : defaultStyles.dismissButton}
        onClick={handleDismiss}
        aria-label="Dismiss notification"
      >
        &times;
      </button>

      {autoHideDuration > 0 && (
        <div
          className={classNames?.progressBar}
          style={{
            ...(classNames?.progressBar ? {} : defaultStyles.progressBar),
            width: `${progress}%`,
            transitionDuration: paused ? '0ms' : '50ms',
          }}
        />
      )}
    </div>
  )
}
