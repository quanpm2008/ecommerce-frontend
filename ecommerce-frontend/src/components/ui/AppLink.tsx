import type { AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router'

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  /** In-app path ("/login") or absolute URL to another domain ("https://…"). */
  href: string
}

/**
 * Uses client-side navigation for in-app paths and a normal anchor for
 * absolute URLs, so links can point to another role's domain.
 */
export default function AppLink({ href, ...rest }: AppLinkProps) {
  if (/^[a-z][a-z\d+.-]*:/i.test(href)) {
    return <a href={href} {...rest} />
  }
  return <Link to={href} {...rest} />
}
