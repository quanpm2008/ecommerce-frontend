import { IconChevronDown } from '@tabler/icons-react'
import { useId, type SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  options: Array<{ value: string; label: string }>
  /** Shown as a disabled first option while nothing is chosen. */
  placeholder?: string
  error?: string
  hint?: string
}

/** Figma: 0. Design system › Input (Type=Select). Native <select> for accessibility. */
export default function SelectField({
  label,
  options,
  placeholder,
  error,
  hint,
  id,
  className,
  value,
  ...selectProps
}: SelectFieldProps) {
  const autoId = useId()
  const selectId = id ?? autoId
  const messageId = `${selectId}-message`
  const message = error ?? hint
  const empty = value === '' || value == null

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <label htmlFor={selectId} className="text-small font-medium text-text-2">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            'h-11 w-full appearance-none rounded-field border bg-surface pl-3.5 pr-10 text-body outline-none transition-colors',
            'disabled:cursor-not-allowed disabled:bg-soft',
            empty ? 'text-text-3' : 'text-text',
            error
              ? 'border-danger focus:ring-2 focus:ring-danger-soft'
              : 'border-line-strong focus:border-accent focus:ring-2 focus:ring-accent-soft',
          )}
          {...selectProps}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-text">
              {option.label}
            </option>
          ))}
        </select>
        <IconChevronDown
          aria-hidden
          size={18}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-3"
        />
      </div>
      {message && (
        <p id={messageId} className={cn('text-caption', error ? 'text-danger' : 'text-text-3')}>
          {message}
        </p>
      )}
    </div>
  )
}
