import type { IsoDateTime } from '../../types'
import type { SellerPublic } from '../../types'

/**
 * Seller as drawn in II.1/II.2/II.3/II.4/II.5.
 *
 * API gap: GET /identity/sellers returns only SellerPublic (id, name,
 * description, logo). Product count, rating and join date are optional here —
 * each is hidden when the backend does not provide it.
 */
export type SellerSummary = SellerPublic & {
  productCount?: number
  ratingAverage?: number | null
  /** SellerSelfProfile.registeredAt / reviewedAt — shown as "MM/YYYY". */
  joinedAt?: IsoDateTime
}

/** Common list-loading props shared by the catalog screens. */
export type ListStatus = {
  /** First load / page change in flight → skeleton. */
  loading?: boolean
  /** Request failed → error message with a retry button. */
  error?: string
  onRetry?: () => void
}
