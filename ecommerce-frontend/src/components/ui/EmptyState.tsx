import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

/** Centered message for empty lists, errors and "not found" pages. */
export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  /** Tabler icon at ~28px. */
  icon?: ReactNode
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center gap-3 px-6 py-14 text-center', className)}>
      {icon && <span className="flex size-14 items-center justify-center rounded-full bg-soft text-text-3">{icon}</span>}
      <p className="text-h3 text-text">{title}</p>
      {description && <div className="max-w-[420px] text-body text-text-2">{description}</div>}
      {action && <div className="pt-1">{action}</div>}
    </div>
  )
}
