/** Shared frame for the customer screens (section II). */
export { default as CustomerShell, PageContainer } from './CustomerShell'
export { default as CustomerNavbar, type CustomerNavbarProps, type NavbarUser } from './CustomerNavbar'
export { default as CustomerFooter } from './CustomerFooter'
export {
  CustomerLinksProvider,
  defaultCustomerLinks,
  useCustomerLinks,
  type CustomerLinks,
  type SearchParams,
} from './links'
