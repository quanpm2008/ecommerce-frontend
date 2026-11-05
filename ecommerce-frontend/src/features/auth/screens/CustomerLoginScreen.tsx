import AppLink from '../../../components/ui/AppLink'
import { buttonClasses } from '../../../components/ui/button-styles'
import AuthShell, { HeaderPrompt } from '../components/AuthShell'
import FloatingProducts from '../components/FloatingProducts'
import { CardFooterLink } from '../components/FormBits'
import LoginForm, { type LoginFormProps } from '../components/LoginForm'

/**
 * I.3 Đăng nhập khách hàng · UC-A03 (customer domain).
 * Success: go back to the previous page or Home (II.1) — handled in `onSuccess`.
 * Banned customer without paid orders: return `{ formError }`.
 */
export default function CustomerLoginScreen({
  registerHref,
  onGoogleSignIn,
  ...formProps
}: LoginFormProps & {
  registerHref: string
  /** Omit to hide the Google button. */
  onGoogleSignIn?: () => void
}) {
  return (
    <AuthShell
      headerRight={
        <HeaderPrompt text="Chưa có tài khoản?">
          <AppLink href={registerHref} className={buttonClasses({ variant: 'secondary', size: 's' })}>
            Đăng ký
          </AppLink>
        </HeaderPrompt>
      }
      background={<FloatingProducts />}
    >
      <LoginForm
        {...formProps}
        title="Chào mừng trở lại"
        subtitle="Đăng nhập để tiếp tục mua sắm."
        emailPlaceholder="vidu@gmail.com"
        google={onGoogleSignIn && { label: 'Đăng nhập với Google', onClick: onGoogleSignIn }}
        footer={<CardFooterLink text="Chưa có tài khoản?" linkText="Đăng ký" href={registerHref} />}
      />
    </AuthShell>
  )
}
