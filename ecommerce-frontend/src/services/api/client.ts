import type { ApiError as ApiErrorBody } from '../../types'
import { session } from '../session'

/**
 * The one place that talks HTTP. Every response uses the envelope from
 * api.docx §3.3: `{ data, meta? }` on success, `{ error: { code, message,
 * details, requestId } }` on failure. Callers get `data` back or an ApiError.
 */
const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '')

export class ApiError extends Error {
  readonly status: number
  /** Stable code from api.docx §4.1, e.g. "EMAIL_ALREADY_USED"; "NETWORK_ERROR" when offline. */
  readonly code: string
  readonly details: NonNullable<ApiErrorBody['details']>
  readonly requestId?: string

  constructor(status: number, body: ApiErrorBody) {
    super(body.message)
    this.name = 'ApiError'
    this.status = status
    this.code = body.code
    this.details = body.details ?? []
    this.requestId = body.requestId
  }

  /** `details[].field` → issue list, for field-level validation errors. */
  fieldIssues() {
    return this.details.filter((detail): detail is typeof detail & { field: string } => typeof detail.field === 'string')
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  /** Send the access token (default true; auth endpoints pass false). */
  auth?: boolean
  headers?: Record<string, string>
  signal?: AbortSignal
}

/** Returns the `data` of the envelope (undefined for 204). */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true } = options
  if (auth && session.isExpired()) await session.refresh()
  let response = await send(path, options, auth ? session.accessToken() : null)

  // Access token expired or its permissions changed → refresh once and retry.
  if (auth && response.status === 401 && session.accessToken()) {
    const code = await peekCode(response)
    if (code === 'TOKEN_EXPIRED' || code === 'TOKEN_STALE') {
      if (await session.refresh()) response = await send(path, options, session.accessToken())
    }
  }

  return parse<T>(response)
}

async function send(path: string, options: RequestOptions, token: string | null) {
  const headers: Record<string, string> = { Accept: 'application/json', ...options.headers }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  try {
    return await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? (options.body === undefined ? 'GET' : 'POST'),
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, { code: 'NETWORK_ERROR', message: 'Không kết nối được máy chủ.' })
  }
}

async function peekCode(response: Response) {
  try {
    return ((await response.clone().json()) as { error?: ApiErrorBody }).error?.code
  } catch {
    return undefined
  }
}

async function parse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T
  let body: { data?: T; error?: ApiErrorBody } | undefined
  try {
    body = await response.json()
  } catch {
    body = undefined
  }
  if (response.ok) return body?.data as T
  throw new ApiError(
    response.status,
    body?.error ?? { code: response.status >= 500 ? 'INTERNAL_ERROR' : 'UNKNOWN', message: response.statusText },
  )
}
