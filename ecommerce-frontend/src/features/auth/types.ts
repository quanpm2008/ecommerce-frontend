/**
 * Integration contract for the auth screens (I.1–I.7).
 *
 * Every screen takes an async `onSubmit(values)` handler. The handler either:
 *  - resolves with nothing → success (the screen moves to its success state
 *    or calls `onSuccess`), or
 *  - resolves with a `FormResult` → the screen shows the errors.
 * If it throws, the screen shows a generic "please try again" message.
 */

export type FieldErrors<F> = Partial<Record<keyof F & string, string>>

export type FormResult<F> = {
  /** Errors shown under specific fields, e.g. { email: 'Email đã được sử dụng.' } */
  fieldErrors?: FieldErrors<F>
  /** Error shown at the top of the form, e.g. wrong credentials, banned account. */
  formError?: string
}

export type SubmitHandler<V, F = V> = (values: V) => Promise<FormResult<F> | void>

/** I.3, I.4, I.5 */
export type LoginValues = {
  email: string
  password: string
}

/** I.1 — UC-A01 */
export type CustomerRegisterValues = {
  email: string
  fullName: string
  phone: string
  password: string
}
export type CustomerRegisterFields = CustomerRegisterValues & { confirmPassword: string }

/** I.2 — UC-A02 */
export type SellerRegisterValues = {
  email: string
  sellerName: string
  phone: string
  password: string
}
export type SellerRegisterFields = SellerRegisterValues & { confirmPassword: string }

/** I.6 — UC-A05 */
export type ForgotPasswordValues = {
  email: string
}

/** I.7 — UC-A05. The reset token comes from the email link; the integrator adds it. */
export type ResetPasswordValues = {
  password: string
}
export type ResetPasswordFields = ResetPasswordValues & { confirmPassword: string }
export type ResetPasswordResult = FormResult<ResetPasswordFields> & {
  /** Link expired or already used → screen switches to the "request a new link" state. */
  linkInvalid?: boolean
}

/** Which domain the screen is rendered on; changes header tag and background. */
export type AuthRole = 'customer' | 'seller' | 'admin'
