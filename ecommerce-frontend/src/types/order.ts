/**
 * Order Service (§6.4) and Payment Service (§6.5) DTOs used by customer screens.
 *
 * One checkout (CheckoutSession, code "TT-…") = N orders (one per seller,
 * code "DH-…"), paid once. Order state machine: database.docx §8.2B.
 */
import type { IsoDateTime, Uuid, Vnd } from './common'
import type { Address, SellerRef } from './identity'

export type CheckoutSource = 'CART' | 'BUY_NOW'

export type CheckoutSessionStatus = 'AWAITING_PAYMENT' | 'PAID' | 'PAYMENT_FAILED' | 'EXPIRED' | 'CANCELLED'

/**
 * AWAITING_PAYMENT "Chờ thanh toán", PAYMENT_FAILED "Thanh toán thất bại",
 * EXPIRED "Hết hạn", PAID "Chờ xử lý", PACKING "Đang đóng gói",
 * DELIVERED "Đã giao — chờ khách xác nhận", CONFIRMED "Đã xác nhận", CANCELLED "Đã hủy".
 */
export type OrderStatus =
  | 'AWAITING_PAYMENT'
  | 'PAYMENT_FAILED'
  | 'EXPIRED'
  | 'PAID'
  | 'PACKING'
  | 'DELIVERED'
  | 'CONFIRMED'
  | 'CANCELLED'

export type CancelledBy = 'CUSTOMER' | 'SELLER' | 'SYSTEM' | 'ADMIN'

/** P-21a — not final yet. */
export type CustomerCancelReason = 'CHANGED_MIND' | 'ORDERED_BY_MISTAKE' | 'FOUND_BETTER_PRICE' | 'ADDRESS_CHANGE' | 'OTHER'

/** P-21b — not final yet. */
export type SellerRejectReason = 'DEFECTIVE' | 'OUT_OF_STOCK_ACTUAL' | 'CANNOT_DELIVER' | 'OTHER'

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED'
export type RefundStatus = 'PENDING' | 'SUCCESS' | 'FAILED'
export type RefundScope = 'ORDER' | 'FULL_CHECKOUT'
export type RefundReason = 'CUSTOMER_CANCEL' | 'SELLER_REJECT' | 'SELLER_CANCEL' | 'SELLER_TIMEOUT' | 'LATE_PAYMENT'
export type PaymentRefundState = 'NONE' | 'PARTIALLY_REFUNDED' | 'REFUNDED'

/** Hint for enabling buttons; the API re-checks every action. */
export type SessionAction = 'PAY' | 'CANCEL'
export type OrderAction = 'PAY' | 'CANCEL_SESSION' | 'CANCEL' | 'CONFIRM_RECEIPT' | 'REVIEW'

/** Address snapshot stored on the checkout/orders. */
export type ShippingAddress = Pick<
  Address,
  'recipientName' | 'recipientPhone' | 'provinceCode' | 'provinceName' | 'wardCode' | 'wardName' | 'addressDetail'
>

/* ---------- Checkout (II.7, II.7b) ---------- */

export type CheckoutPreviewItem = {
  productId: Uuid
  productName: string
  coverImageUrl: string | null
  unitPriceVnd: Vnd
  quantity: number
  lineTotalVnd: Vnd
}

export type CheckoutPreviewOrder = {
  seller: SellerRef
  items: CheckoutPreviewItem[]
  orderTotalVnd: Vnd
}

/** Per-line problem: the order cannot be placed until fixed. */
export type CheckoutIssue = {
  productId: Uuid
  cartItemId: Uuid | null
  code: 'PRODUCT_NOT_SELLABLE' | 'INSUFFICIENT_STOCK' | 'QUANTITY_LIMIT_EXCEEDED'
  availableQuantity?: number
}

/** Whole-checkout blocker. CHECKOUT_PENDING_EXISTS carries checkoutSessionId. */
export type CheckoutBlocker = {
  code: 'PROFILE_INCOMPLETE' | 'CHECKOUT_PENDING_EXISTS' | 'CUSTOMER_PAYMENT_BLOCKED'
  checkoutSessionId?: Uuid
  [key: string]: unknown
}

/** POST /orders/checkout/preview */
export type CheckoutPreviewRequest =
  | { source: 'CART'; cartItemIds: Uuid[] }
  | { source: 'BUY_NOW'; buyNowItem: { productId: Uuid; quantity: number } }

export type CheckoutPreview = {
  source: CheckoutSource
  orders: CheckoutPreviewOrder[]
  /** Always 0. */
  shippingFeeVnd: Vnd
  totalAmountVnd: Vnd
  defaultAddress: Address | null
  issues: CheckoutIssue[]
  blockers: CheckoutBlocker[]
  canPlaceOrder: boolean
  isSimulated: boolean
}

/** POST /orders/checkout-sessions (Idempotency-Key required). */
export type CreateCheckoutSessionRequest = CheckoutPreviewRequest & { addressId: Uuid }

/* ---------- Orders (II.8, II.9, II.9b) ---------- */

export type OrderSummary = {
  orderId: Uuid
  orderCode: string
  checkoutSessionId: Uuid
  checkoutCode: string
  seller: SellerRef
  status: OrderStatus
  totalAmountVnd: Vnd
  itemCount: number
  firstItem: { productName: string; coverImageUrl: string | null }
  createdAt: IsoDateTime
  paidAt: IsoDateTime | null
  refundStatus: RefundStatus | null
}

/** GET /orders/checkout-sessions/{id}, /current, and POST create/cancel. */
export type CheckoutSession = {
  checkoutSessionId: Uuid
  checkoutCode: string
  source: CheckoutSource
  status: CheckoutSessionStatus
  paymentStatus: 'NONE' | PaymentStatus
  totalAmountVnd: Vnd
  shippingFeeVnd: Vnd
  /** Payment deadline (P-01) — drives the "còn mm:ss" countdown. */
  expiresAt: IsoDateTime
  paidAt: IsoDateTime | null
  shippingAddress: ShippingAddress
  orders: OrderSummary[]
  allowedActions: SessionAction[]
  isSimulated: boolean
}

export type OrderItem = {
  orderItemId: Uuid
  productId: Uuid
  productName: string
  coverImageUrl: string | null
  unitPriceVnd: Vnd
  quantity: number
  lineTotalVnd: Vnd
}

export type OrderTimelineEntry = {
  status: OrderStatus
  at: IsoDateTime
  actor: CancelledBy
}

/**
 * Shape not spelled out in api.docx; built from DB columns
 * cancel_reason, cancelled_by_type, cancelled_at (database.docx §3.6.2).
 */
export type OrderCancellation = {
  cancelledByType: CancelledBy
  reasonCode: CustomerCancelReason | SellerRejectReason | (string & {})
  reasonNote: string | null
  cancelledAt: IsoDateTime
}

export type Refund = {
  refundId: Uuid
  paymentId: Uuid
  /** null when scope is FULL_CHECKOUT. */
  orderId: Uuid | null
  scope: RefundScope
  amountVnd: Vnd
  reason: RefundReason
  status: RefundStatus
  retryCount: number
  providerRefundId: string | null
  createdAt: IsoDateTime
  completedAt: IsoDateTime | null
  isSimulated: boolean
}

export type OrderReviewSummaryItem = {
  orderItemId: Uuid
  productId: Uuid
  hasReviewed: boolean
  reviewId: Uuid | null
  canReview: boolean
}

/** GET /orders/me/{orderId} */
export type CustomerOrderDetail = OrderSummary & {
  shippingFeeVnd: Vnd
  items: OrderItem[]
  shippingAddress: ShippingAddress
  trackingNumber: string | null
  /** Seller must deliver or reject before this (7 days from paidAt). */
  sellerActionDueAt: IsoDateTime | null
  deliveredAt: IsoDateTime | null
  /** Auto-confirmed after this (7 days from deliveredAt). */
  customerConfirmDueAt: IsoDateTime | null
  confirmedAt: IsoDateTime | null
  cancellation: OrderCancellation | null
  refund: Refund | null
  /** Cancelled but the refund is still being created — poll again. */
  refundPendingCreation: boolean
  reviewSummary: OrderReviewSummaryItem[]
  timeline: OrderTimelineEntry[]
  allowedActions: OrderAction[]
  isSimulated: boolean
}

/** POST /orders/me/{orderId}/cancel. reasonNote required when OTHER. */
export type CancelOrderRequest = {
  reasonCode: CustomerCancelReason
  reasonNote?: string
}

/**
 * Status tabs of II.8 "Đơn mua" → `status` query (api.docx §4.2).
 * Empty array = all.
 */
export const CUSTOMER_ORDER_TABS = [
  { key: 'all', label: 'Tất cả', statuses: [] },
  { key: 'awaiting-payment', label: 'Chờ thanh toán', statuses: ['AWAITING_PAYMENT'] },
  { key: 'processing', label: 'Đang xử lý', statuses: ['PAID', 'PACKING'] },
  { key: 'delivered', label: 'Chờ xác nhận', statuses: ['DELIVERED'] },
  { key: 'confirmed', label: 'Hoàn tất', statuses: ['CONFIRMED'] },
  { key: 'cancelled', label: 'Đã hủy / Thất bại', statuses: ['CANCELLED', 'PAYMENT_FAILED', 'EXPIRED'] },
] as const satisfies ReadonlyArray<{ key: string; label: string; statuses: readonly OrderStatus[] }>

/* ---------- Payment (II.P1) ---------- */

/** POST /payments → 201 SUCCESS/FAILED, 202 PENDING (poll). */
export type Payment = {
  paymentId: Uuid
  checkoutSessionId: Uuid
  amountVnd: Vnd
  currency: 'VND'
  provider: string
  status: PaymentStatus
  providerTransactionId: string | null
  errorCode: string | null
  refundedAmountVnd: Vnd
  refundState: PaymentRefundState
  createdAt: IsoDateTime
  completedAt: IsoDateTime | null
  isSimulated: boolean
}
