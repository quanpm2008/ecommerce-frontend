import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './button-styles'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  block?: boolean
  loading?: boolean
  icon?: ReactNode
}

export default function Button({
  variant,
  size,
  block,
  loading = false,
  icon,
  className,
  disabled,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, block, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  )
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  )
}
