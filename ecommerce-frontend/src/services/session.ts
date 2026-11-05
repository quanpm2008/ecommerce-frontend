import { useSyncExternalStore } from 'react'
import type { AuthTokens, UserSelfProfile } from '../types'
import { apiRequest } from './api/client'

/**
 * Signed-in session: tokens + the profile returned at login.
 *
 * Kept in localStorage so a reload stays signed in. Trade-off: readable by any
 * script on the page (XSS). An httpOnly refresh cookie would be safer but needs
 * backend support; revisit before production.
 */
export type Session = {
  accessToken: string
  refreshToken: string
  /** Epoch ms when the access token expires. */
  expiresAt: number
  profile: UserSelfProfile
}

const STORAGE_KEY = 'san.session'
/** Refresh this long before the real expiry to absorb clock skew. */
const EXPIRY_MARGIN_MS = 30_000

let current: Session | null = load()
const listeners = new Set<() => void>()
let refreshing: Promise<boolean> | null = null

function load(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function save(next: Session | null) {
  current = next
  try {
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage blocked (private mode): the session still lives in memory.
  }
  listeners.forEach((listener) => listener())
}

export const session = {
  get: () => current,

  accessToken: () => current?.accessToken ?? null,

  isExpired: () => !!current && Date.now() >= current.expiresAt - EXPIRY_MARGIN_MS,

  /** Store the result of login / refresh. */
  start(tokens: AuthTokens) {
    save({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: Date.now() + tokens.accessTokenExpiresIn * 1000,
      profile: tokens.profile,
    })
  },

  /** Replace the cached profile (e.g. after PATCH /users/me). */
  setProfile(profile: UserSelfProfile) {
    if (current) save({ ...current, profile })
  },

  clear: () => save(null),

  /**
   * POST /auth/refresh with the stored refresh token. Concurrent callers share
   * one request. On failure the session is cleared (user must sign in again).
   */
  refresh(): Promise<boolean> {
    const refreshToken = current?.refreshToken
    if (!refreshToken) return Promise.resolve(false)
    refreshing ??= apiRequest<AuthTokens>('/v1/identity/auth/refresh', { body: { refreshToken }, auth: false })
      .then((tokens) => {
        session.start(tokens)
        return true
      })
      .catch(() => {
        save(null)
        return false
      })
      .finally(() => {
        refreshing = null
      })
    return refreshing
  },

  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

// Another tab signed in or out → follow it.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      current = load()
      listeners.forEach((listener) => listener())
    }
  })
}

/** React hook: the current session (null when signed out). */
export function useSession() {
  return useSyncExternalStore(session.subscribe, session.get, () => null)
}
