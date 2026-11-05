import shieldCheckIcon from '../../../assets/icons/shield-check.svg'
import AuthShell from '../components/AuthShell'
import LoginForm, { type LoginFormProps } from '../components/LoginForm'

/**
 * I.5 Đăng nhập quản trị · UC-A03 (admin domain).
 * No register page (admin accounts are pre-created). Wrong credentials:
 * one generic `formError`. Success: IV.1 Tổng quan.
 * Plain soft background, no decorative cards (internal tool).
 */
export default function AdminLoginScreen(props: LoginFormProps) {
  return (
    <AuthShell tag="Quản trị">
      <LoginForm
        {...props}
        title="Đăng nhập quản trị"
        emailPlaceholder="admin@nentang.vn"
        submitVariant="dark"
        footer={
          <p className="flex w-full items-center justify-center gap-2 text-caption text-text-3">
            <img src={shieldCheckIcon} alt="" width={16} height={16} />
            Chỉ dành cho tài khoản quản trị được cấp sẵn.
          </p>
        }
      />
    </AuthShell>
  )
}
