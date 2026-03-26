import React, { useEffect, useState } from 'react'
import { NotificationToast } from './NotificationToast'
import type { NotificationToastClassNames } from './NotificationToast'

// ============================================================================
// Types
// ============================================================================

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface ToastItem {
  id: string
  title: string
  body: string
  iconUrl?: string
  actionUrl?: string
}

export interface NotificationContainerProps {
  /** Toasts currently visible */
  toasts: ToastItem[]
  /** Called when a toast should be dismissed */
  onDismiss: (id: string) => void
  /** Called when user clicks a toast */
  onAction?: (id: string, actionUrl?: string) => void
  /** Screen position (default: 'top-right') */
  position?: ToastPosition
  /** Auto-hide duration in ms per toast (default: 5000, 0 = sticky) */
  autoHideDuration?: number
  /** Custom class names for the container */
  classNames?: NotificationContainerClassNames
  /** Custom class names for individual toasts */
  toastClassNames?: NotificationToastClassNames
  /** Custom toast renderer — overrides default NotificationToast */
  renderToast?: (toast: ToastItem, helpers: { dismiss: () => void }) => React.ReactNode
}

export interface NotificationContainerClassNames {
  root?: string
}

// ============================================================================
// Position styles
// ============================================================================

const positionStyles: Record<ToastPosition, React.CSSProperties> = {
  'top-right': { top: '16px', right: '16px' },
  'top-left': { top: '16px', left: '16px' },
  'bottom-right': { bottom: '16px', right: '16px' },
  'bottom-left': { bottom: '16px', left: '16px' },
}

const containerBase: React.CSSProperties = {
  position: 'fixed',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  zIndex: 99999,
  pointerEvents: 'none',
  maxHeight: 'calc(100vh - 32px)',
  overflow: 'hidden',
}

const toastWrapper: React.CSSProperties = {
  pointerEvents: 'auto',
}

// ============================================================================
// Component
// ============================================================================

export function NotificationContainer({
  toasts,
  onDismiss,
  onAction,
  position = 'top-right',
  autoHideDuration = 5000,
  classNames,
  toastClassNames,
  renderToast,
}: NotificationContainerProps) {
  // Track entering toasts for animation
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const newIds = new Set(toasts.map((t) => t.id))
    setVisibleIds(newIds)
  }, [toasts])

  if (toasts.length === 0) return null

  // Use a portal target if available, otherwise render inline
  const style = {
    ...containerBase,
    ...positionStyles[position],
    // Reverse order for bottom positions so newest appears at the edge
    ...(position.startsWith('bottom') ? { flexDirection: 'column-reverse' as const } : {}),
  }

  return (
    <div className={classNames?.root} style={classNames?.root ? undefined : style}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            ...toastWrapper,
            animation: visibleIds.has(toast.id) ? 'sm-toast-enter 0.3s ease-out' : undefined,
          }}
        >
          {renderToast ? (
            renderToast(toast, { dismiss: () => onDismiss(toast.id) })
          ) : (
            <NotificationToast
              id={toast.id}
              title={toast.title}
              body={toast.body}
              iconUrl={toast.iconUrl}
              actionUrl={toast.actionUrl}
              autoHideDuration={autoHideDuration}
              onDismiss={onDismiss}
              onAction={onAction}
              classNames={toastClassNames}
            />
          )}
        </div>
      ))}

      {/* Inject keyframe animation */}
      <style>{`
        @keyframes sm-toast-enter {
          from {
            opacity: 0;
            transform: translateX(${position.includes('right') ? '100%' : '-100%'});
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
