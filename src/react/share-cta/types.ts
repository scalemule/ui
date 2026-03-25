export interface ShareCTAClassNames {
  root?: string
  text?: string
  content?: string
  dismissButton?: string
}

export interface ShareCTAProps {
  /** Slot for the consumer's own CTA button/content */
  children: React.ReactNode
  /** CTA text displayed above the children */
  text: string
  /** Visual variant. Default: 'card' */
  variant?: 'banner' | 'card' | 'inline' | 'floating'
  /** Show dismiss button. Default: false */
  dismissible?: boolean
  /** Controlled dismissed state — consumer owns this */
  dismissed?: boolean
  /** Called when dismiss button is clicked */
  onDismiss?: () => void
  /** Custom class names for styling */
  classNames?: ShareCTAClassNames
}
