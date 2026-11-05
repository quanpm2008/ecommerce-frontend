import { IconMinus, IconPlus } from '@tabler/icons-react'
import { cn } from '../../utils/cn'

/**
 * Figma: 0. Design system › Qty. Quantity stepper bounded by [min, max]
 * (max = min(availableQuantity, maxPerOrder) on product/cart screens).
 */
export default function QtyStepper({
  value,
  onChange,
  min = 1,
  max = Infinity,
  disabled,
  label = 'Số lượng',
  className,
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  /** Accessible name for the group. */
  label?: string
  className?: string
}) {
  const step = (delta: number) => onChange(Math.min(max, Math.max(min, value + delta)))
  const buttonClass =
    'flex size-6 items-center justify-center rounded-full text-text transition-colors hover:bg-soft disabled:cursor-not-allowed disabled:text-placeholder disabled:hover:bg-transparent'

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'inline-flex h-[38px] shrink-0 items-center gap-2 rounded-full border border-line-strong bg-surface px-2',
        disabled && 'opacity-60',
        className,
      )}
    >
      <button type="button" aria-label="Giảm" className={buttonClass} disabled={disabled || value <= min} onClick={() => step(-1)}>
        <IconMinus size={16} />
      </button>
      <span aria-live="polite" className="min-w-5 text-center text-body font-medium text-text">
        {value}
      </span>
      <button type="button" aria-label="Tăng" className={buttonClass} disabled={disabled || value >= max} onClick={() => step(1)}>
        <IconPlus size={16} />
      </button>
    </div>
  )
}
