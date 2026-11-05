import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

/** Figma: 0. Design system › Chip. Filter/sort pill; dark when active. */
export default function Chip({
  active = false,
  className,
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        'inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-small transition-colors',
        active
          ? 'bg-text font-medium text-white'
          : 'border border-line bg-surface text-text-2 hover:border-line-strong hover:text-text',
        className,
      )}
      {...rest}
    />
  )
}
