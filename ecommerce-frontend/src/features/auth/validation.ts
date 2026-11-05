/**
 * Client-side checks only, for fast feedback. The backend must validate again.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^0\d{9}$/

export const PASSWORD_HINT = 'Tối thiểu 8 ký tự, có chữ hoa, chữ thường, chữ số'

export function normalizePhone(phone: string) {
  return phone.replace(/[\s.-]/g, '')
}

export function validateEmail(email: string) {
  if (!email.trim()) return 'Vui lòng nhập email.'
  if (!EMAIL_PATTERN.test(email.trim())) return 'Email không hợp lệ.'
}

export function validateRequired(value: string, message: string) {
  if (!value.trim()) return message
}

export function validatePhone(phone: string) {
  if (!phone.trim()) return 'Vui lòng nhập số điện thoại.'
  if (!PHONE_PATTERN.test(normalizePhone(phone))) return 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.'
}

export function validateNewPassword(password: string) {
  if (!password) return 'Vui lòng nhập mật khẩu.'
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
    return `Mật khẩu chưa đạt yêu cầu: ${PASSWORD_HINT.toLowerCase()}.`
  }
}

export function validateConfirmPassword(password: string, confirm: string) {
  if (!confirm) return 'Vui lòng nhập lại mật khẩu.'
  if (password !== confirm) return 'Mật khẩu nhập lại không khớp.'
}
