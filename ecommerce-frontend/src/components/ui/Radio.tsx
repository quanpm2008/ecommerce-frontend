import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: ReactNode
}

/** Figma: 0. Design system › Radio (On = 5px accent ring). */
export default function Radio({ label, className, ...inputProps }: RadioProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 text-body text-text',
        inputProps.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className,
      )}
    >
      <input
        type="radio"
        className={cn(
          'size-[18px] shrink-0 appearance-none rounded-full border-[1.5px] border-line-strong bg-surface transition-[border]',
          'checked:border-[5px] checked:border-accent',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        )}
        {...inputProps}
      />
      {label}
    </label>
  )
}
