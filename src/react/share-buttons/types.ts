import type { SharePlatform } from '../../share'

export interface ShareButtonsClassNames {
  root?: string
  button?: string
  buttonActive?: string
  icon?: string
  label?: string
}

export interface ShareButtonsProps {
  /** URL to share (should be absolute for external platforms) */
  url: string
  /** Share text/message body */
  text?: string
  /** Share title (for native share and email subject) */
  title?: string
  /** Which platforms to show. Default: ['copy', 'whatsapp', 'x', 'native'] */
  platforms?: SharePlatform[]
  /** Called when user initiates a share on any platform */
  onShare?: (platform: SharePlatform) => void
  /** Called after copy-to-clipboard succeeds */
  onCopied?: () => void
  /** Custom class names for zero-opinion styling */
  classNames?: ShareButtonsClassNames
  /** Render prop for full button customization */
  renderButton?: (platform: SharePlatform, onClick: () => void) => React.ReactNode
  /** Layout direction. Default: 'row' */
  layout?: 'row' | 'column'
  /** Size hint for default icons. Default: 'md' */
  size?: 'sm' | 'md' | 'lg'
}
