/* eslint-disable react-refresh/only-export-components -- context + hook live together */
import { createContext, useContext, type ReactNode } from 'react'

/**
 * Every in-app link used by the customer screens (section II), in one place.
 * Screens read links from context instead of taking a dozen `xxxHref` props.
 * The integrator wraps the app once with <CustomerLinksProvider value={…}> if
 * the real routes differ from the defaults below.
 */
export type SearchParams = {
  q?: string
  categoryId?: string
  /** II.2 products (default) or II.3 sellers. */
  tab?: 'products' | 'sellers'
}

export type CustomerLinks = {
  home: string
  /** Navbar "Danh mục". */
  categories: string
  /** Navbar "Người bán" → seller search. */
  sellers: string
  /** "Bán hàng cùng sàn" → seller domain (I.2/I.4); absolute URL in production. */
  sellerChannel: string
  login: string
  register: string
  cart: string
  notifications: string
  account: string
  addresses: string
  changePassword: string
  orders: string
  about: string
  contact: string
  policy: string
  search: (params: SearchParams) => string
  product: (productId: string) => string
  seller: (sellerId: string) => string
  /** II.9 shows one checkout session (all its orders). */
  checkout: (checkoutSessionId: string) => string
}

export const defaultCustomerLinks: CustomerLinks = {
  home: '/',
  categories: '/search',
  sellers: '/search?tab=sellers',
  sellerChannel: '/seller/login',
  login: '/login',
  register: '/register',
  cart: '/cart',
  notifications: '/account/notifications',
  account: '/account',
  addresses: '/account/addresses',
  changePassword: '/account/password',
  orders: '/account/orders',
  about: '/about',
  contact: '/contact',
  policy: '/policy',
  search: ({ q, categoryId, tab }) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (categoryId) params.set('categoryId', categoryId)
    if (tab && tab !== 'products') params.set('tab', tab)
    const query = params.toString()
    return query ? `/search?${query}` : '/search'
  },
  product: (productId) => `/products/${productId}`,
  seller: (sellerId) => `/sellers/${sellerId}`,
  checkout: (checkoutSessionId) => `/account/orders/${checkoutSessionId}`,
}

const CustomerLinksContext = createContext<CustomerLinks>(defaultCustomerLinks)

export function CustomerLinksProvider({ value, children }: { value: Partial<CustomerLinks>; children: ReactNode }) {
  return (
    <CustomerLinksContext.Provider value={{ ...defaultCustomerLinks, ...value }}>{children}</CustomerLinksContext.Provider>
  )
}

export function useCustomerLinks() {
  return useContext(CustomerLinksContext)
}
