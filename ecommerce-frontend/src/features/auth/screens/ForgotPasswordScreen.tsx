import { useState } from 'react'
import Alert from '../../../components/ui/Alert'
import Button from '../../../components/ui/Button'
import TextField from '../../../components/ui/TextField'
import { AuthCard } from '../components/AuthShell'
import { BackLink } from '../components/FormBits'
import RoleAuthShell from '../components/RoleAuthShell'
import { useAuthForm } from '../hooks/useAuthForm'
import type { AuthRole, ForgotPasswordValues, SubmitHandler } from '../types'
import { validateEmail } from '../validation'

/**
 * I.6 Quên mật khẩu (đề xuất bổ sung) · UC-A05 — needed on all 3 domains.
 * - Google accounts and sellers not approved / rejected: no link is sent.
 * - After sending, the screen always shows the same neutral message so it
 *   never reveals whether the email exists (rule G-05). NOTE: the FRD is
 *   inconsistent here (UC-A05 step 2 shows an error for unknown emails);
 *   if the team decides otherwise, return `{ fieldErrors: { email } }`.
 */
export default function ForgotPasswordScreen({
  role = 'customer',
  onSubmit,
  loginHref,
}: {
  role?: AuthRole
  onSubmit: SubmitHandler<ForgotPasswordValues>
  loginHref: string
}) {
  const [sentTo, setSentTo] = useState<string>()
  const form = useAuthForm<ForgotPasswordValues>({
    initialValues: { email: '' },
    validate: (values) => ({ email: validateEmail(values.email) }),
    submit: (values) => onSubmit({ email: values.email.trim() }),
  })

  return (
    <RoleAuthShell role={role}>
      {sentTo ? (
        <AuthCard
          title="Kiểm tra email của bạn"
          subtitle={
            <>
              Nếu <span className="font-medium text-text">{sentTo}</span> đã được đăng ký, chúng tôi đã gửi liên kết đặt
              lại mật khẩu. Liên kết chỉ dùng được một lần.
            </>
          }
        >
          <Button variant="secondary" size="l" block onClick={() => setSentTo(undefined)}>
            Gửi lại với email khác
          </Button>
          <BackLink href={loginHref}>Quay lại đăng nhập</BackLink>
        </AuthCard>
      ) : (
        <AuthCard
          title="Quên mật khẩu"
          subtitle="Nhập email đã đăng ký. Nếu tài khoản hợp lệ, chúng tôi sẽ gửi liên kết đặt lại mật khẩu."
        >
          <form
            noValidate
            onSubmit={form.handleSubmit(() => setSentTo(form.values.email.trim()))}
            className="flex w-full flex-col gap-4"
          >
            {form.formError && <Alert>{form.formError}</Alert>}
            <TextField label="Email" type="email" autoComplete="email" placeholder="vidu@gmail.com" {...form.field('email')} />
            <Button type="submit" size="l" block loading={form.submitting}>
              Gửi hướng dẫn
            </Button>
          </form>
          <BackLink href={loginHref}>Quay lại đăng nhập</BackLink>
        </AuthCard>
      )}
    </RoleAuthShell>
  )
}
