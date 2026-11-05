/**
 * Catalog screens II.1, II.2, II.3, II.5 from Figma "[UET] Cloud Project — UI Design".
 * Presentational: data comes in through props typed with the API DTOs
 * (src/types); in-app links come from <CustomerLinksProvider>.
 * Render them inside <CustomerShell>.
 */
export { default as HomeScreen, type HomeScreenProps } from './screens/HomeScreen' // II.1
export { default as ProductSearchScreen, type ProductSearchScreenProps } from './screens/ProductSearchScreen' // II.2
export { default as SellerSearchScreen, type SellerSearchScreenProps } from './screens/SellerSearchScreen' // II.3
export { default as SellerScreen, type SellerScreenProps } from './screens/SellerScreen' // II.5
export { default as ProductCard } from './components/ProductCard'
export type * from './types'
