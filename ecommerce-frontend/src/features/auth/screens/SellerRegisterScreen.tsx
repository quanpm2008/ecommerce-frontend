import { useRef, useState } from 'react'
import Alert from '../../../components/ui/Alert'
import AppLink from '../../../components/ui/AppLink'
import Button from '../../../components/ui/Button'
import { buttonClasses } from '../../../components/ui/button-styles'
import Modal from '../../../components/ui/Modal'
import TextField from '../../../components/ui/TextField'
import circleCheckIcon from '../../../assets/icons/circle-check.svg'
import AuthShell, { AuthCard } from '../components/AuthShell'
import FloatingNotices from '../components/FloatingNotices'
import { CardFooterLink } from '../components/FormBits'
import { useAuthForm } from '../hooks/useAuthForm'
import type { SellerRegisterFields, SellerRegisterValues, SubmitHandler } from '../types'
import {
  PASSWORD_HINT,
  normalizePhone,
  validateConfirmPassword,
  validateEmail,
  validateNewPassword,
  validatePhone,
  validateRequired,
} from '../validation'

/**
 * I.2 Đăng ký người bán · UC-A02 (seller domain).
 * - Before sending: a popup summarises the info for the seller to confirm.
 * - Email / phone / seller name used by an active application: return
 *   `{ fieldErrors: { email | phone | sellerName } }`.
 * - No Google sign-up. Rejected applicants must send a new application.
 * - After sending: the form is replaced by the "Hồ sơ đã được gửi" card.
 */
export default function SellerRegisterScreen({
  onSubmit,
  loginHref,
  shopHref,
}: {
  onSubmit: SubmitHandler<SellerRegisterValues, SellerRegisterFields>
  loginHref: string
  /** Customer domain URL for "Về trang mua sắm". */
  shopHref: string
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [confirming, setConfirming] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const form = useAuthForm<SellerRegisterFields>({
    initialValues: { email: '', sellerName: '', phone: '', password: '', confirmPassword: '' },
    validate: (values) => ({
      email: validateEmail(values.email),
      sellerName: validateRequired(values.sellerName, 'Vui lòng nhập tên người bán.'),
      phone: validatePhone(values.phone),
      password: validateNewPassword(values.password),
      confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
    }),
    submit: (values) =>
      onSubmit({
        email: values.email.trim(),
        sellerName: values.sellerName.trim(),
        phone: normalizePhone(values.phone),
        password: values.password,
      }),
  })

  async function confirmAndSend() {
    const ok = await form.run()
    setConfirming(false)
    if (ok) setSubmitted(true)
  }

  return (
    <AuthShell
      tag="Kênh Người Bán"
      headerRight={
        <AppLink href={shopHref} className="text-small text-text-2 hover:text-text">
          Về trang mua sắm
        </AppLink>
      }
      background={<FloatingNotices layout="register" />}
    >
      {submitted ? (
        <SubmittedCard loginHref={loginHref} />
      ) : (
        <AuthCard title="Đăng ký bán hàng" subtitle="Gửi hồ sơ để quản trị viên xét duyệt.">
          <form
            ref={formRef}
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              if (form.validateAll(formRef.current)) setConfirming(true)
            }}
            className="flex w-full flex-col gap-4"
          >
            {form.formError && <Alert>{form.formError}</Alert>}
            <TextField label="Email" type="email" autoComplete="email" placeholder="shop@gmail.com" {...form.field('email')} />
            <TextField
              label="Tên người bán"
              autoComplete="organization"
              placeholder="Không thể đổi sau khi tạo"
              {...form.field('sellerName')}
            />
            <TextField
              label="Số điện thoại liên hệ"
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
            <Button type="submit" size="l" block>
              Gửi hồ sơ đăng ký
            </Button>
          </form>
          <CardFooterLink text="Đã có tài khoản người bán?" linkText="Đăng nhập" href={loginHref} />
        </AuthCard>
      )}

      <Modal open={confirming} onClose={() => !form.submitting && setConfirming(false)} title="Xác nhận hồ sơ đăng ký">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-h2 text-text">Xác nhận hồ sơ đăng ký</h2>
            <p className="text-body text-text-2">Kiểm tra lại thông tin trước khi gửi cho quản trị viên.</p>
          </div>
          <dl className="flex flex-col gap-3 rounded-field bg-soft p-4">
            <SummaryRow label="Email" value={form.values.email.trim()} />
            <SummaryRow label="Tên người bán" value={form.values.sellerName.trim()} />
            <SummaryRow label="Số điện thoại liên hệ" value={normalizePhone(form.values.phone)} />
          </dl>
          <p className="text-small text-warn">Tên người bán không thể thay đổi sau khi tạo.</p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setConfirming(false)} disabled={form.submitting}>
              Sửa lại
            </Button>
            <Button onClick={confirmAndSend} loading={form.submitting}>
              Xác nhận gửi
            </Button>
          </div>
        </div>
      </Modal>
    </AuthShell>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-caption text-text-3">{label}</dt>
      <dd className="text-body font-medium break-words text-text">{value}</dd>
    </div>
  )
}

function SubmittedCard({ loginHref }: { loginHref: string }) {
  return (
    <section
      role="status"
      className="flex w-full max-w-[360px] flex-col items-start gap-3.5 rounded-card bg-accent-soft p-7 drop-shadow-card"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-surface">
        <img src={circleCheckIcon} alt="" width={24} height={24} />
      </span>
      <h1 className="text-h2 text-accent-dark">Hồ sơ đã được gửi</h1>
      <p className="text-body text-accent-dark">
        Hồ sơ đang ở trạng thái Chờ duyệt. Kết quả duyệt hoặc từ chối sẽ được gửi qua email.
      </p>
      <AppLink href={loginHref} className={buttonClasses({ variant: 'secondary', size: 'm', block: true })}>
        Về trang đăng nhập
      </AppLink>
    </section>
  )
}
