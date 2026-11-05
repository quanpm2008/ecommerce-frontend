import { IconBell, IconFileText, IconLogout, IconSearch, IconShoppingBag, IconUser } from '@tabler/icons-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { buttonClasses } from '../ui/button-styles'
import AppLink from '../ui/AppLink'
import Avatar from '../ui/Avatar'
import { cn } from '../../utils/cn'
import { initials } from '../../utils/format'
import { useCustomerLinks } from './links'

/** Signed-in customer shown in the navbar; null = guest (Navbar/Guest). */
export type NavbarUser = {
  fullName: string
}

export type CustomerNavbarProps = {
  user: NavbarUser | null
  /** Unread notifications (bell badge). Hidden when 0. */
  unreadCount?: number
  /** GET /cart/summary lineCount (bag badge). Hidden when 0. */
  cartCount?: number
  /** Prefills the search box; defaults to the `q` URL param (II.2/II.3). */
  searchQuery?: string
  /** Defaults to navigating to the search page. */
  onSearch?: (q: string) => void
  onLogout?: () => void
}

/**
 * Figma: Navbar/Customer (4:300) and Navbar/Guest (4:338).
 * Guest: login/register buttons. Customer: bell, bag and avatar menu.
 */
export default function CustomerNavbar({
  user,
  unreadCount = 0,
  cartCount = 0,
  searchQuery,
  onSearch,
  onLogout,
}: CustomerNavbarProps) {
  const links = useCustomerLinks()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const query = searchQuery ?? params.get('q') ?? ''

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <div className="mx-auto flex h-[68px] w-full max-w-[1120px] items-center gap-4 px-4 md:gap-7 xl:px-0">
        <AppLink href={links.home} className="shrink-0 text-h2 text-accent-dark">
          sàn<span className="text-accent">.</span>
        </AppLink>

        <nav aria-label="Khám phá" className="hidden shrink-0 items-center gap-[22px] text-body text-text-2 md:flex">
          <AppLink href={links.categories} className="transition-colors hover:text-text">
            Danh mục
          </AppLink>
          <AppLink href={links.sellers} className="transition-colors hover:text-text">
            Người bán
          </AppLink>
        </nav>

        <form
          role="search"
          className="min-w-0 flex-1"
          onSubmit={(event) => {
            event.preventDefault()
            const q = String(new FormData(event.currentTarget).get('q') ?? '').trim()
            if (onSearch) onSearch(q)
            else navigate(links.search({ q }))
          }}
        >
          <label className="flex h-[42px] items-center gap-2.5 rounded-full bg-soft px-[18px] focus-within:ring-2 focus-within:ring-accent-soft">
            <IconSearch aria-hidden size={18} className="shrink-0 text-text-3" />
            <input
              key={query}
              name="q"
              type="search"
              defaultValue={query}
              maxLength={100}
              aria-label="Tìm sản phẩm hoặc người bán"
              placeholder="Tìm sản phẩm hoặc người bán…"
              className="min-w-0 flex-1 bg-transparent text-body text-text outline-none placeholder:text-text-3"
            />
          </label>
        </form>

        <div className={cn('flex shrink-0 items-center', user ? 'gap-5' : 'gap-3.5')}>
          <AppLink
            href={links.sellerChannel}
            className="hidden text-small text-text-3 transition-colors hover:text-text lg:inline"
          >
            Bán hàng cùng sàn
          </AppLink>
          {user ? (
            <>
              <BadgeLink href={links.notifications} label="Thông báo" count={unreadCount} icon={<IconBell size={22} />} />
              <BadgeLink href={links.cart} label="Giỏ hàng" count={cartCount} icon={<IconShoppingBag size={22} />} />
              <AccountMenu user={user} onLogout={onLogout} />
            </>
          ) : (
            <>
              <BadgeLink href={links.login} label="Giỏ hàng" count={0} icon={<IconShoppingBag size={22} />} />
              <AppLink href={links.login} className={buttonClasses({ variant: 'secondary', size: 's' })}>
                Đăng nhập
              </AppLink>
              <AppLink href={links.register} className={cn(buttonClasses({ size: 's' }), 'max-sm:hidden')}>
                Đăng ký
              </AppLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function BadgeLink({ href, label, count, icon }: { href: string; label: string; count: number; icon: ReactNode }) {
  return (
    <AppLink
      href={href}
      aria-label={count > 0 ? `${label} (${count})` : label}
      className="relative flex size-[22px] items-center justify-center text-text"
    >
      {icon}
      {count > 0 && (
        <span className="absolute -top-[7px] left-3 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-[5px] text-caption font-medium text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </AppLink>
  )
}

/** Avatar opens the account menu (Figma component description). */
function AccountMenu({ user, onLogout }: { user: NavbarUser; onLogout?: () => void }) {
  const links = useCustomerLinks()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !ref.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  const itemClass = 'flex h-10 w-full items-center gap-2.5 rounded-field px-3 text-body text-text-2 hover:bg-soft hover:text-text'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Tài khoản: ${user.fullName}`}
        onClick={() => setOpen(!open)}
        className="flex rounded-full"
      >
        <Avatar initials={initials(user.fullName)} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-card border border-line bg-surface p-1.5 drop-shadow-card"
        >
          <p className="truncate px-3 pb-1.5 pt-1 text-small font-medium text-text">{user.fullName}</p>
          <AppLink role="menuitem" href={links.account} className={itemClass} onClick={() => setOpen(false)}>
            <IconUser size={18} /> Hồ sơ
          </AppLink>
          <AppLink role="menuitem" href={links.orders} className={itemClass} onClick={() => setOpen(false)}>
            <IconFileText size={18} /> Đơn mua
          </AppLink>
          {onLogout && (
            <button
              type="button"
              role="menuitem"
              className={itemClass}
              onClick={() => {
                setOpen(false)
                onLogout()
              }}
            >
              <IconLogout size={18} /> Đăng xuất
            </button>
          )}
        </div>
      )}
    </div>
  )
}
