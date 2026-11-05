import { cn } from '../../utils/cn'
import type { AvatarTone } from './avatar-tone'

/**
 * Figma: 0. Design system › Avatar. Initials on a soft tone. The MVP stores no
 * user avatar, so this is the only avatar; sellers may pass their `logoUrl`.
 */
export type AvatarSize = 's' | 'm' | 'l'

const sizeClasses: Record<AvatarSize, string> = {
  s: 'size-[30px] text-caption font-medium',
  m: 'size-10 text-small font-medium',
  l: 'size-14 text-h3',
}

const toneClasses: Record<AvatarTone, string> = {
  green: 'bg-accent-soft text-accent-dark',
  sand: 'bg-warn-soft text-warn',
  blue: 'bg-info-soft text-info',
  gray: 'bg-soft-2 text-text-2',
}

export default function Avatar({
  initials,
  imageUrl,
  size = 's',
  tone = 'green',
  className,
}: {
  initials: string
  imageUrl?: string | null
  size?: AvatarSize
  tone?: AvatarTone
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        sizeClasses[size],
        toneClasses[tone],
        className,
      )}
    >
      {imageUrl ? <img src={imageUrl} alt="" className="size-full object-cover" /> : initials}
    </span>
  )
}
