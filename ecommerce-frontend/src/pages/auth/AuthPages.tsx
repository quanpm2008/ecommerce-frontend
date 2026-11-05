import { useLocation, useNavigate, useSearchParams } from 'react-router'
import {
  AdminLoginScreen,
  CustomerLoginScreen,
  CustomerRegisterScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
  SellerLoginScreen,
  SellerRegisterScreen,
  type AuthRole,
} from '../../features/auth'
import {
  submitCustomerRegister,
  submitForgotPassword,
  submitLogin,
  submitResetPassword,
  submitSellerRegister,
} from '../../features/auth/integration'
import { session } from '../../services/session'

/**
 * Route pages for section I. The three apps share one bundle in dev and are
 * split by path prefix: customer "/", seller "/seller", admin "/admin".
 */
const AUTH_BASE: Record<AuthRole, string> = { customer: '', seller: '/seller', admin: '/admin' }
const HOME: Record<AuthRole, string> = { customer: '/', seller: '/seller', admin: '/admin' }

/** Where a guarded page sent the user from (RequireRole puts it in location.state). */
function useReturnTo(role: AuthRole) {
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from
  return from && from.startsWith(HOME[role]) ? from : HOME[role]
}

export function CustomerLoginPage() {
  const navigate = useNavigate()
  const returnTo = useReturnTo('customer')
  return (
    <CustomerLoginScreen
      registerHref="/register"
      forgotPasswordHref="/forgot-password"
      // Google sign-in is not implemented by identity-service yet → button hidden.
      onSubmit={(values) => submitLogin('customer', values)}
      onSuccess={() => navigate(returnTo, { replace: true })}
    />
  )
}

export function CustomerRegisterPage() {
  const navigate = useNavigate()
  return (
    <CustomerRegisterScreen
      loginHref="/login"
      onSubmit={submitCustomerRegister}
      // Signed in right after registering → home; if that auto sign-in failed → login page.
      onSuccess={() => navigate(session.get() ? '/' : '/login', { replace: true })}
    />
  )
}

export function SellerLoginPage() {
  const navigate = useNavigate()
  const returnTo = useReturnTo('seller')
  return (
    <SellerLoginScreen
      registerHref="/seller/register"
      forgotPasswordHref="/seller/forgot-password"
      shopHref="/"
      onSubmit={(values) => submitLogin('seller', values)}
      onSuccess={() => navigate(returnTo, { replace: true })}
    />
  )
}

export function SellerRegisterPage() {
  return <SellerRegisterScreen loginHref="/seller/login" shopHref="/" onSubmit={submitSellerRegister} />
}

export function AdminLoginPage() {
  const navigate = useNavigate()
  const returnTo = useReturnTo('admin')
  return (
    <AdminLoginScreen
      forgotPasswordHref="/admin/forgot-password"
      onSubmit={(values) => submitLogin('admin', values)}
      onSuccess={() => navigate(returnTo, { replace: true })}
    />
  )
}

export function ForgotPasswordPage({ role }: { role: AuthRole }) {
  return <ForgotPasswordScreen role={role} loginHref={`${AUTH_BASE[role]}/login`} onSubmit={submitForgotPassword} />
}

/** Opened from the email: /reset-password?token=… */
export function ResetPasswordPage({ role }: { role: AuthRole }) {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  return (
    <ResetPasswordScreen
      key={token}
      role={role}
      linkValid={token !== ''}
      loginHref={`${AUTH_BASE[role]}/login`}
      forgotPasswordHref={`${AUTH_BASE[role]}/forgot-password`}
      onSubmit={(values) => submitResetPassword(token, values)}
    />
  )
}
