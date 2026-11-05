/**
 * Cart Service DTOs (api.docx §6.3). Cart requires login — no guest cart.
 * Which lines are selected for checkout is FE-only state (cartItemIds).
 */
import type { Uuid, Vnd } from './common'
import type { SellerRef } from './identity'

/** IN_STOCK "Còn hàng", INSUFFICIENT_STOCK "Chỉ còn X", OUT_OF_STOCK "Hết hàng". */
export type CartLineStatus = 'IN_STOCK' | 'INSUFFICIENT_STOCK' | 'OUT_OF_STOCK'

export type CartItem = {
  cartItemId: Uuid
  productId: Uuid
  productName: string
  coverImageUrl: string | null
  /** Current price, recalculated on every read. */
  unitPriceVnd: Vnd
  quantity: number
  availableQuantity: number
  lineStatus: CartLineStatus
  /** false → checkbox disabled. */
  selectable: boolean
  lineTotalVnd: Vnd
}

/** One group per seller; becomes one Order at checkout. */
export type CartGroup = {
  seller: SellerRef
  items: CartItem[]
}

/** Lines dropped because the product is no longer sellable. */
export type CartRemovedItem = {
  productId: Uuid
  productName: string
  reason: 'PRODUCT_NOT_SELLABLE' | (string & {})
}

/** GET /cart (also returned by add/update/delete item). */
export type Cart = {
  cartId: Uuid
  groups: CartGroup[]
  removedItems: CartRemovedItem[]
  summary: CartSummary
  paymentBlocked: boolean
}

/** GET /cart/summary — navbar badge. */
export type CartSummary = {
  lineCount: number
  totalQuantity: number
}
