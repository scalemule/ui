export interface PoweredByClassNames {
  root?: string
  link?: string
  logo?: string
  text?: string
}

export interface PoweredByProps {
  /** Brand name to display */
  brandName: string
  /** URL to link to when clicked */
  href: string
  /** Optional brand logo — img src string or React node */
  logo?: string | React.ReactNode
  /** Position variant. Default: 'inline' */
  position?: 'bottom-left' | 'bottom-center' | 'bottom-right' | 'inline'
  /** Open link in new tab. Default: true */
  newTab?: boolean
  /** Custom class names for styling */
  classNames?: PoweredByClassNames
  /** Called when the link is clicked */
  onClick?: () => void
}
