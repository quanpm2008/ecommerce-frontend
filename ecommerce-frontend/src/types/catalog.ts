/**
 * Product (Catalog) Service DTOs (api.docx §6.2) used by customer screens.
 */
import type { IsoDateTime, Uuid, Vnd } from './common'
import type { SellerPublic } from './identity'

export type StockStatus = 'IN_STOCK' | 'OUT_OF_STOCK'
export type MediaType = 'IMAGE' | 'VIDEO'

/** GET /categories (visible only). */
export type Category = {
  categoryId: Uuid
  categoryName: string
}

export type MediaItem = {
  mediaType: MediaType
  url: string
  sortOrder: number
  isCover: boolean
}

/** Item of GET /products, /products/{id}/related. */
export type ProductCard = {
  productId: Uuid
  productName: string
  priceVnd: Vnd
  coverImageUrl: string | null
  /** One decimal place. */
  ratingAverage: number | null
  ratingCount: number
  stockStatus: StockStatus
  sellerId: Uuid
  sellerName: string
}

/** GET /products/{productId}. Not sellable → 404. */
export type ProductDetail = ProductCard & {
  description: string
  category: Category
  media: MediaItem[]
  /** "Còn X sản phẩm"; caps the quantity input. */
  availableQuantity: number
  /** P-10: max quantity per cart line / buy-now. */
  maxPerOrder: number
  seller: SellerPublic
}

/** Allowed `sort` values for GET /products. */
export type ProductSort = 'createdAt,desc' | 'priceVnd,asc' | 'priceVnd,desc' | 'ratingAverage,desc'

/** Query of GET /products (home, search results, seller page). */
export type ProductQuery = {
  q?: string
  categoryId?: Uuid
  sellerId?: Uuid
  minPriceVnd?: Vnd
  maxPriceVnd?: Vnd
  sort?: ProductSort
  page?: number
  size?: number
}

/** Item of GET /products/{productId}/reviews. */
export type Review = {
  reviewId: Uuid
  productId: Uuid
  orderItemId: Uuid
  /** Integer 1–5. */
  rating: number
  content: string | null
  media: MediaItem[]
  /** Partially masked, e.g. "Nguyễn T***". */
  reviewerDisplayName: string
  isMine: boolean
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}

/** `summary` returned next to the review list. */
export type ReviewSummary = {
  ratingAverage: number | null
  ratingCount: number
  countByStar: Record<'1' | '2' | '3' | '4' | '5', number>
}
