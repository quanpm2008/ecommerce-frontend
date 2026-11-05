import type {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  RegisterSellerRequest,
  ResetPasswordRequest,
  UserSelfProfile,
} from '../../types'
import { session } from '../session'
import { apiRequest } from './client'

/** Identity & Seller Service (api.docx §6.1) — auth endpoints. */
const AUTH = '/v1/identity/auth'

/** POST /auth/login — any role; the caller decides who may enter which app. */
export function login(body: LoginRequest) {
  return apiRequest<AuthTokens>(`${AUTH}/login`, { body, auth: false })
}

/** POST /auth/register → 201 UserSelfProfile (no tokens: user signs in afterwards). */
export function register(body: RegisterRequest) {
  return apiRequest<UserSelfProfile>(`${AUTH}/register`, { body, auth: false })
}

/** POST /auth/register-seller → 201, sellerProfile.approvalStatus = PENDING. */
export function registerSeller(body: RegisterSellerRequest) {
  return apiRequest<UserSelfProfile>(`${AUTH}/register-seller`, { body, auth: false })
}

/** POST /auth/password/forgot → 202, same answer whether the email exists or not. */
export function forgotPassword(email: string) {
  return apiRequest<{ message: string }>(`${AUTH}/password/forgot`, { body: { email }, auth: false })
}

/** POST /auth/password/reset → 204; revokes every session of the user. */
export function resetPassword(body: ResetPasswordRequest) {
  return apiRequest<void>(`${AUTH}/password/reset`, { body, auth: false })
}

/** POST /auth/logout for one refresh token, without touching the stored session. */
export function revoke(refreshToken: string) {
  return apiRequest<void>(`${AUTH}/logout`, { body: { refreshToken }, auth: false })
}

/** Sign out this device: revoke its refresh token, then forget the session locally. */
export async function logout() {
  const refreshToken = session.get()?.refreshToken
  try {
    if (refreshToken) await revoke(refreshToken)
  } finally {
    session.clear()
  }
}

/** GET /users/me */
export function getMe() {
  return apiRequest<UserSelfProfile>('/v1/identity/users/me')
}
