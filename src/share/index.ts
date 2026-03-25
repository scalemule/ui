/**
 * Share Intents — framework-agnostic URL generation for social sharing
 *
 * Generates platform-specific share URLs. Returns null for platforms
 * that require browser APIs (copy, native share).
 */

export type SharePlatform =
  | 'whatsapp'
  | 'x'
  | 'facebook'
  | 'telegram'
  | 'email'
  | 'sms'
  | 'copy'
  | 'native'

export interface ShareIntentParams {
  /** The URL to share (must be absolute for external platforms) */
  url: string
  /** Share text/message body */
  text?: string
  /** Share title (used for email subject and native share) */
  title?: string
}

/**
 * Generate a platform-specific share intent URL.
 *
 * Returns null for 'copy' and 'native' — these are handled via browser APIs,
 * not URL navigation.
 */
export function getShareIntentUrl(
  platform: SharePlatform,
  params: ShareIntentParams
): string | null {
  const { url, text, title } = params
  const encodedUrl = encodeURIComponent(url)
  const shareText = text ? `${text} ${url}` : url

  switch (platform) {
    case 'whatsapp':
      return `https://wa.me/?text=${encodeURIComponent(shareText)}`

    case 'x':
      return `https://x.com/intent/tweet?url=${encodedUrl}${text ? `&text=${encodeURIComponent(text)}` : ''}`

    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`

    case 'telegram':
      return `https://t.me/share/url?url=${encodedUrl}${text ? `&text=${encodeURIComponent(text)}` : ''}`

    case 'email': {
      const subject = encodeURIComponent(title || '')
      const body = encodeURIComponent(shareText)
      return `mailto:?subject=${subject}&body=${body}`
    }

    case 'sms': {
      // iOS uses '&' separator, Android uses '?' separator
      const separator = detectiOS() ? '&' : '?'
      return `sms:${separator}body=${encodeURIComponent(shareText)}`
    }

    case 'copy':
    case 'native':
      return null
  }
}

/**
 * Check if the Web Share API is available in the current environment.
 */
export function canUseNativeShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator
}

/**
 * Trigger native share dialog via the Web Share API.
 *
 * Returns true if the share completed, false if cancelled or unavailable.
 */
export async function triggerNativeShare(
  params: ShareIntentParams
): Promise<boolean> {
  if (!canUseNativeShare()) return false
  try {
    await navigator.share({
      title: params.title,
      text: params.text,
      url: params.url,
    })
    return true
  } catch {
    // User cancelled or share failed
    return false
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function detectiOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}
