import { IconPhoto } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { cn } from '../../../utils/cn'

/**
 * Product image on the soft background. Without `src` (no cover image yet)
 * it shows `placeholder` — Figma draws a category icon there.
 */
export default function ProductImage({
  src,
  alt = '',
  placeholder,
  iconSize = 56,
  className,
  children,
}: {
  src?: string | null
  alt?: string
  placeholder?: ReactNode
  /** Placeholder icon size: 56 on cards, 24 on thumbnails. */
  iconSize?: number
  className?: string
  /** Overlays such as the "Hết hàng" badge. */
  children?: ReactNode
}) {
  return (
    <div className={cn('relative flex items-center justify-center overflow-hidden bg-soft text-placeholder', className)}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" className="size-full object-cover" />
      ) : (
        (placeholder ?? <IconPhoto aria-hidden size={iconSize} />)
      )}
      {children}
    </div>
  )
}
