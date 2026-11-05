import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

/**
 * Figma: 0. Design system › Tag.
 * Green = done/good, Info = in progress, Warn = needs attention,
 * Danger = error/irreversible, Sim = simulated data.
 */
export type TagTone = 'neutral' | 'green' | 'warn' | 'danger' | 'info' | 'outline' | 'sim'

const toneClasses: Record<TagTone, string> = {
  neutral: 'bg-soft text-text-2',
  green: 'bg-accent-soft text-accent-dark',
  warn: 'bg-warn-soft text-warn',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  outline: 'border border-line-strong bg-surface text-text-2',
  sim: 'gap-1.5 border border-dashed border-placeholder bg-soft text-text-2',
}

export default function Tag({
  tone = 'neutral',
  icon,
  className,
  children,
}: {
  tone?: TagTone
  icon?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-[3px] text-caption font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}
