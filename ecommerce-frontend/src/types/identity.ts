/**
 * Identity & Seller Service DTOs (api.docx §6.1) used by customer screens.
 */
import type { IsoDateTime, Uuid } from './common'

export type AuthMethod = 'LOCAL' | 'GOOGLE'
export type RoleCode = 'CUSTOMER' | 'SELLER' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'DISABLED'
export type ProfileStatus = 'ACTIVE' | 'BANNED'
export type CustomerAccessMode = 'FULL' | 'PAYMENT_BLOCKED' | 'BLOCKED'

export type CustomerProfile = {
  customerId: Uuid
  status: ProfileStatus
  banReason: string | null
  /** Banned after having paid orders: can still view/cancel/confirm, cannot pay. */
  paymentBlocked: boolean
  accessMode: CustomerAccessMode
  /** false when the phone number is missing (e.g. Google sign-up). */
  profileComplete: boolean
  createdAt: IsoDateTime
}

/** GET /identity/users/me. MVP has no avatar field — UI shows initials. */
export type UserSelfProfile = {
  userId: Uuid
  email: string
  authMethod: AuthMethod
  fullName: string
  phoneNumber: string | null
  userStatus: UserStatus
  roles: RoleCode[]
  permissions: string[]
  authzVersion: number
  customerProfile: CustomerProfile | null
  sellerProfile: SellerSelfProfile | null
  createdAt: IsoDateTime
}

export type SellerApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

/** The signed-in user's own seller profile (embedded in UserSelfProfile). */
export type SellerSelfProfile = {
  sellerId: Uuid
  sellerName: string
  description: string | null
  logoUrl: string | null
  contactPhone: string
  approvalStatus: SellerApprovalStatus
  status: ProfileStatus
  rejectionReason: string | null
  banReason: string | null
  registeredAt: IsoDateTime
  reviewedAt: IsoDateTime | null
}

/** POST /identity/auth/login, /refresh. */
export type AuthTokens = {
  accessToken: string
  /** Seconds. */
  accessTokenExpiresIn: number
  refreshToken: string
  tokenType: 'Bearer'
  profile: UserSelfProfile
}

export type LoginRequest = { email: string; password: string }

/** POST /identity/auth/register (customer). */
export type RegisterRequest = {
  email: string
  fullName: string
  phoneNumber: string
  password: string
  confirmPassword: string
}

/** POST /identity/auth/register-seller. */
export type RegisterSellerRequest = {
  email: string
  sellerName: string
  /** users.full_name — the team decided a seller has one name: the shop name. */
  fullName: string
  contactPhone: string
  password: string
  confirmPassword: string
}

/** POST /identity/auth/password/reset */
export type ResetPasswordRequest = {
  token: string
  newPassword: string
  confirmPassword: string
}

/** PATCH /identity/users/me (allowlist). */
export type UpdateUserProfileRequest = {
  fullName?: string
  phoneNumber?: string
}

/** PUT /identity/users/me/password (LOCAL accounts only). */
export type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/** GET /identity/sellers, GET /identity/sellers/{sellerId}. */
export type SellerPublic = {
  sellerId: Uuid
  sellerName: string
  description: string | null
  logoUrl: string | null
}

/** Minimal seller reference embedded in cart/order DTOs. */
export type SellerRef = {
  sellerId: Uuid
  sellerName: string
}

/** Address book entry (GET /identity/customers/me/addresses). */
export type Address = {
  addressId: Uuid
  recipientName: string
  recipientPhone: string
  provinceCode: string
  provinceName: string
  wardCode: string
  wardName: string
  addressDetail: string
  lastUsedAt: IsoDateTime | null
  isDefault: boolean
  createdAt: IsoDateTime
}

/** POST / PUT address body. */
export type AddressRequest = {
  recipientName: string
  recipientPhone: string
  provinceCode: string
  wardCode: string
  addressDetail: string
}

/** Address list meta: `{ data: Address[], meta: { maxAddresses } }`. */
export type AddressListMeta = {
  maxAddresses: number
}

/** GET /identity/regions/provinces */
export type Province = {
  code: string
  name: string
}

/** GET /identity/regions/provinces/{provinceCode}/wards */
export type Ward = {
  code: string
  name: string
  provinceCode: string
}
