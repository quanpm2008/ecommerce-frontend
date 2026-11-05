import { cn } from '../../utils/cn'

/**
 * Figma: 0. Design system › Button.
 * Primary = main action (max 1 per screen), Secondary = secondary action,
 * Dark = buy now, Danger = irreversible action, Ghost = link-like button.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'danger' | 'ghost'
export type ButtonSize = 's' | 'm' | 'l'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-dark',
  secondary: 'border border-line-strong bg-surface text-text hover:bg-soft',
  dark: 'bg-text text-white hover:bg-text/90',
  danger: 'bg-danger text-white hover:bg-danger/90',
  ghost: 'text-text-2 hover:bg-soft hover:text-text',
}

const sizeClasses: Record<ButtonSize, string> = {
  s: 'h-8 px-3.5 text-small',
  m: 'h-[42px] px-5 text-body',
  l: 'h-[50px] px-6 text-body',
}

export function buttonClasses({
  variant = 'primary',
  size = 'm',
  block = false,
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  block?: boolean
  className?: string
} = {}) {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-60',
    variantClasses[variant],
    sizeClasses[size],
    block && 'w-full',
    className,
  )
}
