import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type AlertTone = 'danger' | 'warn' | 'info' | 'success'

const toneClasses: Record<AlertTone, string> = {
  danger: 'bg-danger-soft text-danger',
  warn: 'bg-warn-soft text-warn',
  info: 'bg-info-soft text-info',
  success: 'bg-accent-soft text-accent-dark',
}

/** Inline message block for form-level feedback. */
export default function Alert({
  tone = 'danger',
  className,
  children,
}: {
  tone?: AlertTone
  className?: string
  children: ReactNode
}) {
  return (
    <div
      role={tone === 'danger' || tone === 'warn' ? 'alert' : 'status'}
      className={cn('w-full rounded-field px-3.5 py-2.5 text-small', toneClasses[tone], className)}
    >
      {children}
    </div>
  )
}
