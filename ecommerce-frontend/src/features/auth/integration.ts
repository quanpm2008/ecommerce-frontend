/**
 * Real `onSubmit` handlers for the auth screens (I.1–I.7): map form values to
 * the API, call identity-service, and turn API errors into the FormResult the
 * screens already know how to display.
 */
import { ApiError } from '../../services/api/client'
import * as identity from '../../services/api/identity'
import { session } from '../../services/session'
import type { UserSelfProfile } from '../../types'
import type {
  AuthRole,
  CustomerRegisterFields,
  CustomerRegisterValues,
  FieldErrors,
  ForgotPasswordValues,
  FormResult,
  LoginValues,
  ResetPasswordResult,
  ResetPasswordValues,
  SellerRegisterFields,
  SellerRegisterValues,
} from './types'

const MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng.',
  ACCOUNT_DISABLED: 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ.',
  WRONG_AUTH_METHOD: 'Email này đã đăng ký bằng Google. Vui lòng chọn "Tiếp tục với Google".',
  RATE_LIMITED: 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.',
  NETWORK_ERROR: 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.',
  SERVICE_UNAVAILABLE: 'Hệ thống đang bận. Vui lòng thử lại sau.',
}
const FALLBACK = 'Đã có lỗi xảy ra. Vui lòng thử lại.'

/** Codes that belong to one form field: code → [field, message]. */
const FIELD_CODES: Record<string, [string, string]> = {
  EMAIL_ALREADY_USED: ['email', 'Email đã được sử dụng.'],
  PHONE_ALREADY_USED: ['phone', 'Số điện thoại đã được sử dụng.'],
  SELLER_NAME_ALREADY_USED: ['sellerName', 'Tên người bán đã được sử dụng.'],
  PASSWORD_POLICY_VIOLATION: ['password', 'Mật khẩu chưa đạt yêu cầu: tối thiểu 8 ký tự, có chữ hoa, chữ thường, chữ số.'],
}

/** API field name → form field name (they differ only where the form is friendlier). */
const API_FIELDS: Record<string, string> = {
  phoneNumber: 'phone',
  contactPhone: 'phone',
  newPassword: 'password',
  fullName: 'fullName',
}

/** Any thrown error → what the form shows. */
export function toFormResult<F>(error: unknown): FormResult<F> {
  if (!(error instanceof ApiError)) return { formError: FALLBACK }

  const fieldCode = FIELD_CODES[error.code]
  if (fieldCode) return { fieldErrors: { [fieldCode[0]]: fieldCode[1] } as FieldErrors<F> }

  if (error.code === 'VALIDATION_ERROR') {
    const fieldErrors: Record<string, string> = {}
    for (const issue of error.fieldIssues()) {
      const field = API_FIELDS[issue.field] ?? issue.field
      fieldErrors[field] ??= 'Giá trị không hợp lệ.'
    }
    if (Object.keys(fieldErrors).length > 0) return { fieldErrors: fieldErrors as FieldErrors<F> }
  }

  return { formError: MESSAGES[error.code] ?? FALLBACK }
}

/**
 * Login succeeds for every account; whether it may enter a given app depends on
 * the profile (api.docx §3.2.1). Returns the reason to refuse, or undefined.
 */
export function accessDenied(role: AuthRole, profile: UserSelfProfile): string | undefined {
  if (role === 'admin') {
    return profile.roles.includes('ADMIN') ? undefined : 'Tài khoản không có quyền quản trị.'
  }

  if (role === 'seller') {
    const seller = profile.sellerProfile
    if (!seller) return 'Email này chưa đăng ký bán hàng. Vui lòng gửi hồ sơ đăng ký.'
    if (seller.status === 'BANNED') {
      return `Tài khoản người bán đã bị cấm${seller.banReason ? `: ${seller.banReason}` : ''}.`
    }
    if (seller.approvalStatus === 'PENDING') return 'Hồ sơ của bạn đang chờ duyệt. Kết quả sẽ được gửi qua email.'
    if (seller.approvalStatus === 'REJECTED') {
      return `Hồ sơ đã bị từ chối${seller.rejectionReason ? `: ${seller.rejectionReason}` : ''}. Vui lòng gửi hồ sơ mới.`
    }
    return profile.roles.includes('SELLER') ? undefined : 'Tài khoản người bán chưa được kích hoạt.'
  }

  const customer = profile.customerProfile
  if (!customer) return 'Tài khoản này chưa có hồ sơ mua hàng.'
  // Banned after paying (PAYMENT_BLOCKED) may still sign in to follow orders; the shell shows a banner.
  if (customer.accessMode === 'BLOCKED') {
    return `Tài khoản của bạn đã bị khóa${customer.banReason ? `: ${customer.banReason}` : ''}. Vui lòng liên hệ hỗ trợ.`
  }
  return undefined
}

/** I.3 / I.4 / I.5 */
export async function submitLogin(role: AuthRole, values: LoginValues): Promise<FormResult<LoginValues> | void> {
  try {
    const tokens = await identity.login(values)
    const denied = accessDenied(role, tokens.profile)
    if (denied) {
      // Revoke only the session this attempt opened; keep any existing one (e.g. signed in as customer).
      await identity.revoke(tokens.refreshToken).catch(() => undefined)
      return { formError: denied }
    }
    session.start(tokens)
  } catch (error) {
    return toFormResult(error)
  }
}

/**
 * I.1 — Figma: "Đăng ký thành công" popup, then the home page signed in.
 * Register returns no tokens (api.docx §6.1), so sign in right after with the
 * same credentials. If that second call fails the registration still counts;
 * the page then sends the user to the login screen (session stays empty).
 */
export async function submitCustomerRegister(
  values: CustomerRegisterValues,
): Promise<FormResult<CustomerRegisterFields> | void> {
  try {
    await identity.register({
      email: values.email,
      fullName: values.fullName,
      phoneNumber: values.phone,
      password: values.password,
      confirmPassword: values.password,
    })
  } catch (error) {
    return toFormResult(error)
  }
  await submitLogin('customer', { email: values.email, password: values.password })
}

/** I.2 — one name per seller: the shop name is also stored as users.full_name. */
export async function submitSellerRegister(
  values: SellerRegisterValues,
): Promise<FormResult<SellerRegisterFields> | void> {
  try {
    await identity.registerSeller({
      email: values.email,
      sellerName: values.sellerName,
      fullName: values.sellerName,
      contactPhone: values.phone,
      password: values.password,
      confirmPassword: values.password,
    })
  } catch (error) {
    return toFormResult(error)
  }
}

/** I.6 */
export async function submitForgotPassword(values: ForgotPasswordValues): Promise<FormResult<ForgotPasswordValues> | void> {
  try {
    await identity.forgotPassword(values.email)
  } catch (error) {
    return toFormResult(error)
  }
}

/** I.7 — `token` comes from the email link (?token=…). */
export async function submitResetPassword(token: string, values: ResetPasswordValues): Promise<ResetPasswordResult | void> {
  try {
    await identity.resetPassword({ token, newPassword: values.password, confirmPassword: values.password })
  } catch (error) {
    if (error instanceof ApiError && error.code === 'RESET_TOKEN_INVALID') return { linkInvalid: true }
    return toFormResult(error)
  }
}
