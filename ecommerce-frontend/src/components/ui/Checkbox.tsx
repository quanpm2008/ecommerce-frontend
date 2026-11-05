import { IconCheck } from '@tabler/icons-react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  /** Visible label; when omitted pass `aria-label`. */
  label?: ReactNode
}

/** Figma: 0. Design system › Checkbox (On / Off / Disabled). */
export default function Checkbox({ label, className, ...inputProps }: CheckboxProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 text-body text-text',
        inputProps.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      <span className="relative inline-flex size-[18px] shrink-0">
        <input
          type="checkbox"
          className={cn(
            'peer size-[18px] appearance-none rounded-[6px] border-[1.5px] border-line-strong bg-surface transition-colors',
            'checked:border-accent checked:bg-accent',
            'disabled:border-line disabled:bg-soft',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          )}
          {...inputProps}
        />
        <IconCheck
          aria-hidden
          size={14}
          stroke={2.5}
          className="pointer-events-none absolute inset-0.5 hidden text-white peer-checked:block"
        />
      </span>
      {label}
    </label>
  )
}
