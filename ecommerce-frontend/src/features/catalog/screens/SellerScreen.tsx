import { IconBox, IconBuildingStore } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { PageContainer, useCustomerLinks } from '../../../components/customer'
import AppLink from '../../../components/ui/AppLink'
import Avatar from '../../../components/ui/Avatar'
import { toneFor } from '../../../components/ui/avatar-tone'
import { buttonClasses } from '../../../components/ui/button-styles'
import EmptyState from '../../../components/ui/EmptyState'
import Pagination from '../../../components/ui/Pagination'
import type { PageMeta, ProductCard, ProductSort } from '../../../types'
import { formatMonthYear, formatRating, shopInitials } from '../../../utils/format'
import ProductGrid from '../components/ProductGrid'
import SortChips from '../components/SortChips'
import type { ListStatus, SellerSummary } from '../types'

export type SellerScreenProps = ListStatus & {
  /**
   * GET /identity/sellers/{id}. `null` = 404: not approved, rejected or banned
   * → "không tồn tại" (II.5 note).
   */
  seller: SellerSummary | null
  /** GET /products?sellerId=&sort=&page= */
  products: ProductCard[]
  meta?: PageMeta
  sort?: ProductSort
  onSortChange: (sort: ProductSort) => void
  page: number
  onPageChange: (page: number) => void
  /** Mock/preview only. */
  placeholderFor?: (productId: string) => ReactNode
}

/** II.5 Trang người bán · UC-B02. No follow / chat / shop vouchers. */
export default function SellerScreen({
  seller,
  products,
  meta,
  sort,
  onSortChange,
  page,
  onPageChange,
  loading,
  error,
  onRetry,
  placeholderFor,
}: SellerScreenProps) {
  const links = useCustomerLinks()

  if (!seller) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          icon={<IconBuildingStore size={26} />}
          title="Người bán không tồn tại"
          description="Cửa hàng này không còn hoạt động hoặc đường dẫn không đúng."
          action={
            <AppLink href={links.home} className={buttonClasses({ variant: 'secondary', size: 's' })}>
              Về trang chủ
            </AppLink>
          }
        />
      </PageContainer>
    )
  }

  const stats = [
    seller.productCount != null && { value: String(seller.productCount), label: 'Sản phẩm' },
    seller.ratingAverage !== undefined && { value: formatRating(seller.ratingAverage), label: 'Đánh giá' },
    seller.joinedAt && { value: formatMonthYear(seller.joinedAt), label: 'Tham gia' },
  ].filter((stat): stat is { value: string; label: string } => Boolean(stat))

  return (
    <PageContainer className="flex flex-col gap-6 pb-14 pt-6">
      <section className="overflow-hidden rounded-[20px] border border-line bg-surface">
        <div className="h-24 bg-accent-soft sm:h-[140px]" />
        <div className="flex flex-col gap-4 px-5 pb-6 sm:flex-row sm:items-end sm:gap-5 sm:px-8 sm:pb-7">
          <div className="-mt-12 flex size-24 shrink-0 items-center justify-center rounded-full bg-surface p-1">
            <Avatar
              size="l"
              initials={shopInitials(seller.sellerName)}
              imageUrl={seller.logoUrl}
              tone={toneFor(seller.sellerId)}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h1 className="text-h1 text-text">{seller.sellerName}</h1>
            {seller.description && <p className="text-body text-text-2">{seller.description}</p>}
          </div>
          {stats.length > 0 && (
            <dl className="flex shrink-0 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse items-center">
                  <dt className="text-caption text-text-3">{stat.label}</dt>
                  <dd className="text-h2 text-text">{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        <h2 className="mr-auto text-h2 text-text">Tất cả sản phẩm</h2>
        <SortChips value={sort} onChange={onSortChange} />
      </div>

      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onRetry={onRetry}
        placeholderFor={placeholderFor}
        empty={
          <EmptyState
            icon={<IconBox size={26} />}
            title="Cửa hàng chưa có sản phẩm"
            description="Người bán chưa đăng sản phẩm nào. Hãy quay lại sau nhé."
          />
        }
      />
      {!error && <Pagination page={page} totalPages={meta?.totalPages ?? 1} onPageChange={onPageChange} />}
    </PageContainer>
  )
}
