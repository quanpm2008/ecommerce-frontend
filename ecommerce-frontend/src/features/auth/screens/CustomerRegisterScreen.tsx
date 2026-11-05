import { useEffect, useRef, useState } from 'react'
import Alert from '../../../components/ui/Alert'
import AppLink from '../../../components/ui/AppLink'
import Button from '../../../components/ui/Button'
import { buttonClasses } from '../../../components/ui/button-styles'
import Modal from '../../../components/ui/Modal'
import TextField from '../../../components/ui/TextField'
import circleCheckIcon from '../../../assets/icons/circle-check.svg'
import AuthShell, { AuthCard, HeaderPrompt } from '../components/AuthShell'
import FloatingProducts from '../components/FloatingProducts'
import { CardFooterLink, GoogleButton, OrDivider } from '../components/FormBits'
import { useAuthForm } from '../hooks/useAuthForm'
import type { CustomerRegisterFields, CustomerRegisterValues, SubmitHandler } from '../types'
import {
  PASSWORD_HINT,
  normalizePhone,
  validateConfirmPassword,
  validateEmail,
  validateNewPassword,
  validatePhone,
  validateRequired,
} from '../validation'

const SUCCESS_POPUP_MS = 1000

/**
 * I.1 Đăng ký khách hàng · UC-A01 (customer domain).
 * - Success: "Đăng ký thành công" popup ~1s, then `onSuccess` (go to the main
 *   screen; the user is already signed in).
 * - Email / phone already used: return `{ fieldErrors: { email | phone } }`.
 * - Email registered with another method (e.g. Google): return `{ formError }`
 *   telling the user which method to use; accounts are never merged.
 * - Google sign-up (Should): user must add a phone number before ordering.
 */
export default function CustomerRegisterScreen({
  onSubmit,
  onSuccess,
  onGoogleSignIn,
  loginHref,
}: {
  onSubmit: SubmitHandler<CustomerRegisterValues, CustomerRegisterFields>
  onSuccess?: () => void
  /** Omit to hide the Google button. */
  onGoogleSignIn?: () => void
  loginHref: string
}) {
  const [succeeded, setSucceeded] = useState(false)
  const form = useAuthForm<CustomerRegisterFields>({
    initialValues: { email: '', fullName: '', phone: '', password: '', confirmPassword: '' },
    validate: (values) => ({
      email: validateEmail(values.email),
      fullName: validateRequired(values.fullName, 'Vui lòng nhập họ và tên.'),
      phone: validatePhone(values.phone),
      password: validateNewPassword(values.password),
      confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
    }),
    submit: (values) =>
      onSubmit({
        email: values.email.trim(),
        fullName: values.fullName.trim(),
        phone: normalizePhone(values.phone),
        password: values.password,
      }),
  })

  // Keep the latest callback without restarting the popup timer on re-render.
  const onSuccessRef = useRef(onSuccess)
  useEffect(() => {
    onSuccessRef.current = onSuccess
  })

  useEffect(() => {
    if (!succeeded) return
    const timer = window.setTimeout(() => onSuccessRef.current?.(), SUCCESS_POPUP_MS)
    return () => window.clearTimeout(timer)
  }, [succeeded])

  return (
    <AuthShell
      headerRight={
        <HeaderPrompt text="Đã có tài khoản?">
          <AppLink href={loginHref} className={buttonClasses({ variant: 'secondary', size: 's' })}>
            Đăng nhập
          </AppLink>
        </HeaderPrompt>
      }
      background={<FloatingProducts layout="tall" />}
    >
      <AuthCard title="Tạo tài khoản" subtitle="Mua sắm trên sàn chỉ mất một phút.">
        <form noValidate onSubmit={form.handleSubmit(() => setSucceeded(true))} className="flex w-full flex-col gap-4">
          {form.formError && <Alert>{form.formError}</Alert>}
          <TextField label="Email" type="email" autoComplete="email" placeholder="vidu@gmail.com" {...form.field('email')} />
          <TextField label="Họ và tên" autoComplete="name" placeholder="Nguyễn Văn A" {...form.field('fullName')} />
          <TextField
            label="Số điện thoại"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="09xx xxx xxx"
            {...form.field('phone')}
          />
          <TextField
            label="Mật khẩu"
            type="password"
            autoComplete="new-password"
            placeholder={PASSWORD_HINT}
            {...form.field('password')}
          />
          <TextField
            label="Xác nhận mật khẩu"
            type="password"
            autoComplete="new-password"
            placeholder="Nhập lại mật khẩu"
            {...form.field('confirmPassword')}
          />
          <Button type="submit" size="l" block loading={form.submitting}>
            Đăng ký
          </Button>
        </form>
        {onGoogleSignIn && (
          <>
            <OrDivider />
            <GoogleButton label="Tiếp tục với Google" onClick={onGoogleSignIn} disabled={form.submitting} />
          </>
        )}
        <CardFooterLink text="Đã có tài khoản?" linkText="Đăng nhập" href={loginHref} />
      </AuthCard>

      <Modal open={succeeded} onClose={() => onSuccess?.()} title="Đăng ký thành công">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-accent-soft">
            <img src={circleCheckIcon} alt="" width={24} height={24} />
          </span>
          <p className="text-h2 text-accent-dark">Đăng ký thành công</p>
          <p className="text-body text-text-2">Đang chuyển đến trang chủ…</p>
        </div>
      </Modal>
    </AuthShell>
  )
}
