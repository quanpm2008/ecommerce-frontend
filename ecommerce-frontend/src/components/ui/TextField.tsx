import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { useId, useState, type InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: string
  /** Error message shown under the field; also marks the field invalid. */
  error?: string
  /** Helper text shown under the field when there is no error. */
  hint?: string
}

/**
 * Figma: 0. Design system › Input (Type=Text).
 * `type="password"` adds a show/hide toggle inside the field.
 */
export default function TextField({ label, error, hint, id, className, type, ...inputProps }: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const messageId = `${inputId}-message`
  const message = error ?? hint
  const isPassword = type === 'password'
  const [visible, setVisible] = useState(false)

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <label htmlFor={inputId} className="text-small font-medium text-text-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={isPassword && visible ? 'text' : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            'h-11 w-full rounded-field border bg-surface px-3.5 text-body text-text outline-none transition-colors',
            'placeholder:text-text-3 disabled:cursor-not-allowed disabled:bg-soft',
            isPassword && 'pr-11',
            error
              ? 'border-danger focus:ring-2 focus:ring-danger-soft'
              : 'border-line-strong focus:border-accent focus:ring-2 focus:ring-accent-soft',
          )}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            aria-pressed={visible}
            aria-controls={inputId}
            disabled={inputProps.disabled}
            onClick={() => setVisible(!visible)}
            className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-text-3 transition-colors hover:bg-soft hover:text-text disabled:pointer-events-none"
          >
            {visible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
          </button>
        )}
      </div>
      {message && (
        <p id={messageId} className={cn('text-caption', error ? 'text-danger' : 'text-text-3')}>
          {message}
        </p>
      )}
    </div>
  )
}
