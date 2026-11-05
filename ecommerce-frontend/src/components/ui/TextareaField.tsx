import { useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  error?: string
  hint?: string
}

/** Figma: 0. Design system › Input (Type=Textarea), 96px tall. */
export default function TextareaField({ label, error, hint, id, className, ...textareaProps }: TextareaFieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const messageId = `${fieldId}-message`
  const message = error ?? hint

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <label htmlFor={fieldId} className="text-small font-medium text-text-2">
        {label}
      </label>
      <textarea
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={cn(
          'min-h-24 w-full resize-y rounded-field border bg-surface px-3.5 py-3 text-body text-text outline-none transition-colors',
          'placeholder:text-text-3 disabled:cursor-not-allowed disabled:bg-soft',
          error
            ? 'border-danger focus:ring-2 focus:ring-danger-soft'
            : 'border-line-strong focus:border-accent focus:ring-2 focus:ring-accent-soft',
        )}
        {...textareaProps}
      />
      {message && (
        <p id={messageId} className={cn('text-caption', error ? 'text-danger' : 'text-text-3')}>
          {message}
        </p>
      )}
    </div>
  )
}
