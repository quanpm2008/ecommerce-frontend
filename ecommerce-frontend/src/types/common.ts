/**
 * Shared API conventions — mirrors ecommerce/docs/api.docx §3.3–3.6.
 *
 * Types in src/types/ describe the backend DTOs exactly (field names and
 * shapes). Screens take these types as props, so wiring the real API later
 * only means fetching and passing data — no renaming. Anything the UI needs
 * that the API does not return yet is passed as a separate, optional screen
 * prop (marked "API gap"), never added here.
 */

/** UUID v4 string. */
export type Uuid = string

/** ISO 8601 in UTC, e.g. "2026-10-18T08:30:00Z". UI converts to GMT+7. */
export type IsoDateTime = string

/** Integer amount in VND (fields end with `Vnd`). Never a float. */
export type Vnd = number

/** Pagination meta of list responses: `{ data: T[], meta }`. Pages start at 1. */
export type PageMeta = {
  page: number
  size: number
  totalItems: number
  totalPages: number
}

export type Page<T> = {
  data: T[]
  meta: PageMeta
}

/** Error envelope: `{ error: ApiError }`. `code` is stable; `message` is a Vietnamese fallback. */
export type ApiError = {
  code: string
  message: string
  details?: Array<Record<string, unknown> & { field?: string }>
  requestId?: string
}

/** Sort param format "field,asc|desc". */
export type SortDirection = 'asc' | 'desc'
