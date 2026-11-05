import { useState } from 'react'
import Alert from '../../../components/ui/Alert'
import AppLink from '../../../components/ui/AppLink'
import Button from '../../../components/ui/Button'
import { buttonClasses } from '../../../components/ui/button-styles'
import TextField from '../../../components/ui/TextField'
import { AuthCard } from '../components/AuthShell'
import RoleAuthShell from '../components/RoleAuthShell'
import { useAuthForm } from '../hooks/useAuthForm'
import type { AuthRole, ResetPasswordFields, ResetPasswordResult, ResetPasswordValues } from '../types'
import { PASSWORD_HINT, validateConfirmPassword, validateNewPassword } from '../validation'

type Status = 'form' | 'invalid-link' | 'done'

/**
 * I.7 Đặt lại mật khẩu (đề xuất bổ sung) · UC-A05 — opened from the email link.
 * - The link is single-use and expires (P-05). If the integrator already knows
 *   the token is bad, pass `linkValid={false}`; otherwise return
 *   `{ linkInvalid: true }` from `onSubmit`. Either shows "request a new link" (→ I.6).
 * - Success: other sessions must sign in again; screen offers "Đăng nhập".
 */
export default function ResetPasswordScreen({
  role = 'customer',
  linkValid = true,
  onSubmit,
  loginHref,
  forgotPasswordHref,
}: {
  role?: AuthRole
  linkValid?: boolean
  /** The integrator adds the token from the URL when calling the API. */
  onSubmit: (values: ResetPasswordValues) => Promise<ResetPasswordResult | void>
  loginHref: string
  forgotPasswordHref: string
}) {
  const [status, setStatus] = useState<Status>(linkValid ? 'form' : 'invalid-link')
  const form = useAuthForm<ResetPasswordFields>({
    initialValues: { password: '', confirmPassword: '' },
    validate: (values) => ({
      password: validateNewPassword(values.password),
      confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
    }),
    submit: async (values) => {
      const result = await onSubmit({ password: values.password })
      if (result?.linkInvalid) {
        setStatus('invalid-link')
        // Stop the form from treating this as success.
        return { formError: 'Liên kết không còn hiệu lực.' }
      }
      return result
    },
  })

  return (
    <RoleAuthShell role={role}>
      {status === 'invalid-link' && (
        <AuthCard
          title="Liên kết không còn hiệu lực"
          subtitle="Liên kết đặt lại mật khẩu đã hết hạn hoặc đã được sử dụng. Hãy gửi lại yêu cầu để nhận liên kết mới."
        >
          <AppLink href={forgotPasswordHref} className={buttonClasses({ size: 'l', block: true })}>
            Gửi lại yêu cầu
          </AppLink>
        </AuthCard>
      )}

      {status === 'done' && (
        <AuthCard
          title="Đã đặt lại mật khẩu"
          subtitle="Bạn có thể đăng nhập bằng mật khẩu mới. Các thiết bị khác sẽ cần đăng nhập lại."
        >
          <AppLink href={loginHref} className={buttonClasses({ size: 'l', block: true })}>
            Đăng nhập
          </AppLink>
        </AuthCard>
      )}

      {status === 'form' && (
        <AuthCard title="Đặt mật khẩu mới">
          <form noValidate onSubmit={form.handleSubmit(() => setStatus('done'))} className="flex w-full flex-col gap-4">
            {form.formError && <Alert>{form.formError}</Alert>}
            <TextField
              label="Mật khẩu mới"
              type="password"
              autoComplete="new-password"
              placeholder={PASSWORD_HINT}
              {...form.field('password')}
            />
            <TextField
              label="Xác nhận mật khẩu mới"
              type="password"
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
              {...form.field('confirmPassword')}
            />
            <Button type="submit" size="l" block loading={form.submitting}>
              Đặt lại mật khẩu
            </Button>
          </form>
        </AuthCard>
      )}
    </RoleAuthShell>
  )
}
