import type { ReactNode } from 'react'
import Alert from '../../../components/ui/Alert'
import Button from '../../../components/ui/Button'
import TextField from '../../../components/ui/TextField'
import { useAuthForm } from '../hooks/useAuthForm'
import type { LoginValues, SubmitHandler } from '../types'
import { validateEmail, validateRequired } from '../validation'
import { AuthCard } from './AuthShell'
import { ForgotPasswordLink, GoogleButton, OrDivider } from './FormBits'

export type LoginFormProps = {
  /**
   * Resolve with nothing on success. Return `{ formError }` for wrong
   * credentials (one generic message — never reveal whether the account
   * exists), banned accounts, seller applications pending/rejected, etc.
   */
  onSubmit: SubmitHandler<LoginValues>
  /** Called after a successful login; the integrator decides where to go. */
  onSuccess?: () => void
  forgotPasswordHref: string
}

/** Shared email + password card for I.3, I.4 and I.5. */
export default function LoginForm({
  title,
  subtitle,
  emailPlaceholder,
  submitVariant = 'primary',
  google,
  footer,
  onSubmit,
  onSuccess,
  forgotPasswordHref,
}: LoginFormProps & {
  title: string
  subtitle?: string
  emailPlaceholder: string
  submitVariant?: 'primary' | 'dark'
  google?: { label: string; onClick: () => void }
  footer?: ReactNode
}) {
  const form = useAuthForm({
    initialValues: { email: '', password: '' },
    validate: (values) => ({
      email: validateEmail(values.email),
      password: validateRequired(values.password, 'Vui lòng nhập mật khẩu.'),
    }),
    submit: (values) => onSubmit({ email: values.email.trim(), password: values.password }),
  })

  return (
    <AuthCard title={title} subtitle={subtitle}>
      <form noValidate onSubmit={form.handleSubmit(onSuccess)} className="flex w-full flex-col gap-4">
        {form.formError && <Alert>{form.formError}</Alert>}
        <TextField label="Email" type="email" autoComplete="email" placeholder={emailPlaceholder} {...form.field('email')} />
        <TextField
          label="Mật khẩu"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...form.field('password')}
        />
        <ForgotPasswordLink href={forgotPasswordHref} />
        <Button type="submit" variant={submitVariant} size="l" block loading={form.submitting}>
          Đăng nhập
        </Button>
      </form>
      {google && (
        <>
          <OrDivider />
          <GoogleButton label={google.label} onClick={google.onClick} disabled={form.submitting} />
        </>
      )}
      {footer}
    </AuthCard>
  )
}
