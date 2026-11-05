import { IconArrowRight, IconBox } from '@tabler/icons-react'
import { useCustomerLinks } from '../../../components/customer'
import AppLink from '../../../components/ui/AppLink'
import Avatar from '../../../components/ui/Avatar'
import { toneFor } from '../../../components/ui/avatar-tone'
import { buttonClasses } from '../../../components/ui/button-styles'
import { shopInitials } from '../../../utils/format'
import type { SellerSummary } from '../types'

function SellerAvatar({ seller, size }: { seller: SellerSummary; size: 'm' | 'l' }) {
  return (
    <Avatar
      size={size}
      initials={shopInitials(seller.sellerName)}
      imageUrl={seller.logoUrl}
      tone={toneFor(seller.sellerId)}
    />
  )
}

/** "Thời trang basic · 48 sản phẩm" — count hidden while the API lacks it. */
function sellerSubtitle(seller: SellerSummary) {
  return [seller.description, seller.productCount != null && `${seller.productCount} sản phẩm`].filter(Boolean).join(' · ')
}

/** II.1 "Người bán mới tham gia": compact card linking to the shop. */
export function SellerTile({ seller }: { seller: SellerSummary }) {
  const links = useCustomerLinks()
  return (
    <AppLink
      href={links.seller(seller.sellerId)}
      className="group flex items-center gap-3.5 rounded-card border border-line bg-surface px-[18px] py-4 transition-colors hover:border-line-strong"
    >
      <SellerAvatar seller={seller} size="m" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-body font-medium text-text">{seller.sellerName}</p>
        <p className="line-clamp-2 text-caption text-text-3">{sellerSubtitle(seller)}</p>
      </div>
      <IconArrowRight aria-hidden size={18} className="shrink-0 text-text-3 transition-transform group-hover:translate-x-0.5" />
    </AppLink>
  )
}

/** II.2 "Người bán liên quan" row: avatar, name, subtitle, "Xem shop". */
export function SellerInline({ seller }: { seller: SellerSummary }) {
  const links = useCustomerLinks()
  return (
    <div className="flex items-center gap-3.5">
      <SellerAvatar seller={seller} size="m" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-body font-medium text-text">{seller.sellerName}</p>
        <p className="truncate text-caption text-text-3">{sellerSubtitle(seller)}</p>
      </div>
      <AppLink href={links.seller(seller.sellerId)} className={buttonClasses({ variant: 'secondary', size: 's' })}>
        Xem shop
      </AppLink>
    </div>
  )
}

/** II.3 result row: large avatar, name + description, product count, "Xem shop". */
export function SellerRow({ seller }: { seller: SellerSummary }) {
  const links = useCustomerLinks()
  return (
    <li className="flex items-center gap-4 border-b border-line py-[18px] last:border-b-0">
      <SellerAvatar seller={seller} size="l" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <AppLink href={links.seller(seller.sellerId)} className="truncate text-h3 text-text hover:underline">
          {seller.sellerName}
        </AppLink>
        {seller.description && <p className="line-clamp-2 text-small text-text-2">{seller.description}</p>}
      </div>
      {seller.productCount != null && (
        <p className="hidden shrink-0 items-center gap-1.5 text-small text-text-2 sm:flex">
          <IconBox aria-hidden size={16} />
          {seller.productCount} sản phẩm
        </p>
      )}
      <AppLink href={links.seller(seller.sellerId)} className={buttonClasses({ variant: 'secondary', size: 's' })}>
        Xem shop
      </AppLink>
    </li>
  )
}
