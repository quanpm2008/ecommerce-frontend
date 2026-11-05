import type { ReactNode } from 'react'
import AppLink from '../../../components/ui/AppLink'
import Button from '../../../components/ui/Button'
import arrowLeftIcon from '../../../assets/icons/arrow-left.svg'
import googleIcon from '../../../assets/icons/brand-google.svg'

/** "──── hoặc ────" */
export function OrDivider() {
  return (
    <div className="flex w-full items-center gap-3" role="separator" aria-label="hoặc">
      <span className="h-px flex-1 bg-line" />
      <span className="text-small text-text-3">hoặc</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}

export function GoogleButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <Button
      variant="secondary"
      size="l"
      block
      onClick={onClick}
      disabled={disabled}
      icon={<img src={googleIcon} alt="" width={20} height={20} />}
    >
      {label}
    </Button>
  )
}

/** "Đã có tài khoản? Đăng nhập" row at the bottom of a card. */
export function CardFooterLink({ text, linkText, href }: { text: string; linkText: string; href: string }) {
  return (
    <p className="flex w-full flex-wrap items-center justify-center gap-1.5 text-small">
      <span className="text-text-2">{text}</span>
      <AppLink href={href} className="font-medium text-accent hover:text-accent-dark">
        {linkText}
      </AppLink>
    </p>
  )
}

/** Right-aligned "Quên mật khẩu?" link under the password field. */
export function ForgotPasswordLink({ href }: { href: string }) {
  return (
    <div className="flex w-full justify-end">
      <AppLink href={href} className="text-small font-medium text-accent hover:text-accent-dark">
        Quên mật khẩu?
      </AppLink>
    </div>
  )
}

/** "← Quay lại đăng nhập" */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="flex w-full justify-center">
      <AppLink href={href} className="inline-flex items-center gap-1.5 text-small text-text-2 hover:text-text">
        <img src={arrowLeftIcon} alt="" width={16} height={16} />
        {children}
      </AppLink>
    </div>
  )
}
