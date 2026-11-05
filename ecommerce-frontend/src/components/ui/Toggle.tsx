import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

/** Figma: 0. Design system › Toggle. */
export default function Toggle({
  checked,
  onChange,
  label,
  disabled,
  className,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: ReactNode
  disabled?: boolean
  className?: string
}) {
  return (
    <label className={cn('inline-flex items-center gap-3 text-body text-text', disabled ? 'opacity-60' : 'cursor-pointer', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors',
          checked ? 'justify-end bg-accent' : 'bg-line-strong',
        )}
      >
        <span className="size-4 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.15)]" />
      </button>
      {label}
    </label>
  )
}
