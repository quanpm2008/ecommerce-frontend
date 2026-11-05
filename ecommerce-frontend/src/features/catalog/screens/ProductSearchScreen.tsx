import { IconAdjustmentsHorizontal, IconArrowRight, IconChevronLeft, IconChevronRight, IconSearch } from '@tabler/icons-react'
import { useState, type ReactNode } from 'react'
import { PageContainer, useCustomerLinks } from '../../../components/customer'
import AppLink from '../../../components/ui/AppLink'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import Pagination from '../../../components/ui/Pagination'
import type { Category, PageMeta, ProductCard, ProductQuery } from '../../../types'
import { cn } from '../../../utils/cn'
import ProductFilters from '../components/ProductFilters'
import ProductGrid from '../components/ProductGrid'
import { SellerInline } from '../components/SellerCards'
import SortChips from '../components/SortChips'
import type { ListStatus, SellerSummary } from '../types'

export type ProductSearchScreenProps = ListStatus & {
  /** Current GET /products query (usually mirrored in the URL). */
  query: ProductQuery
  /** Any change (filter, sort, page). Filter/sort changes reset page to 1. */
  onQueryChange: (next: ProductQuery) => void
  products: ProductCard[]
  /** `meta` of the list response; undefined while the first page loads. */
  meta?: PageMeta
  categories: Category[]
  /** Top match of GET /identity/sellers?q= — "Người bán liên quan" (hidden when null). */
  relatedSeller?: SellerSummary | null
  /** Mock/preview only. */
  placeholderFor?: (productId: string) => ReactNode
}

/** II.2 Kết quả tìm kiếm sản phẩm · UC-B01, B02. */
export default function ProductSearchScreen({
  query,
  onQueryChange,
  products,
  meta,
  categories,
  relatedSeller,
  loading,
  error,
  onRetry,
  placeholderFor,
}: ProductSearchScreenProps) {
  const links = useCustomerLinks()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const page = query.page ?? 1
  const totalPages = meta?.totalPages ?? 1
  const category = categories.find((c) => c.categoryId === query.categoryId)
  const hasFilters = query.categoryId != null || query.minPriceVnd != null || query.maxPriceVnd != null
  const title = query.q ? `Kết quả cho “${query.q}”` : (category?.categoryName ?? 'Tất cả sản phẩm')
  const goTo = (next: number) => onQueryChange({ ...query, page: next })

  return (
    <PageContainer className="flex flex-col gap-6 pb-14 pt-8">
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <h1 className="text-h1 text-text">{title}</h1>
        {meta && <p className="text-body text-text-3">{meta.totalItems} sản phẩm</p>}
        <button
          type="button"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="ml-auto flex items-center gap-1.5 self-center text-small font-medium text-text-2 lg:hidden"
        >
          <IconAdjustmentsHorizontal aria-hidden size={18} />
          Bộ lọc{hasFilters && ' •'}
        </button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <ProductFilters
          key={`${query.categoryId}|${query.minPriceVnd}|${query.maxPriceVnd}`}
          categories={categories}
          value={query}
          onApply={(filters) => {
            // Set all three explicitly so clearing ({}) removes previous values.
            onQueryChange({
              ...query,
              categoryId: filters.categoryId,
              minPriceVnd: filters.minPriceVnd,
              maxPriceVnd: filters.maxPriceVnd,
              page: 1,
            })
            setFiltersOpen(false)
          }}
          className={cn('w-full shrink-0 lg:sticky lg:top-[92px] lg:w-[248px]', !filtersOpen && 'max-lg:hidden')}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {relatedSeller && (
            <section aria-label="Người bán liên quan" className="flex flex-col gap-3 rounded-card border border-line bg-surface px-[22px] py-[18px]">
              <div className="flex items-center gap-3">
                <h2 className="text-small font-medium text-text-2">Người bán liên quan</h2>
                <AppLink
                  href={links.search({ q: query.q, tab: 'sellers' })}
                  className="ml-auto flex items-center gap-1 text-small font-medium text-accent hover:text-accent-dark"
                >
                  Xem thêm người bán
                  <IconArrowRight aria-hidden size={16} />
                </AppLink>
              </div>
              <SellerInline seller={relatedSeller} />
            </section>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <SortChips value={query.sort} onChange={(sort) => onQueryChange({ ...query, sort, page: 1 })} />
            {totalPages > 1 && (
              <div className="ml-auto flex items-center gap-2">
                <span className="text-small text-text-2">
                  {page}/{totalPages}
                </span>
                <MiniPageButton label="Trang trước" disabled={page <= 1} onClick={() => goTo(page - 1)}>
                  <IconChevronLeft size={16} />
                </MiniPageButton>
                <MiniPageButton label="Trang sau" disabled={page >= totalPages} onClick={() => goTo(page + 1)}>
                  <IconChevronRight size={16} />
                </MiniPageButton>
              </div>
            )}
          </div>

          <ProductGrid
            columns={3}
            skeletonCount={6}
            products={products}
            loading={loading}
            error={error}
            onRetry={onRetry}
            placeholderFor={placeholderFor}
            empty={
              <EmptyState
                icon={<IconSearch size={26} />}
                title="Không tìm thấy sản phẩm phù hợp"
                description="Thử từ khóa khác ngắn gọn hơn, kiểm tra chính tả hoặc bỏ bớt bộ lọc."
                action={
                  hasFilters && (
                    <Button variant="secondary" size="s" onClick={() => onQueryChange({ q: query.q, sort: query.sort, page: 1 })}>
                      Xóa bộ lọc
                    </Button>
                  )
                }
              />
            }
          />
          {!error && <Pagination page={page} totalPages={totalPages} onPageChange={goTo} />}
        </div>
      </div>
    </PageContainer>
  )
}

function MiniPageButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-full border border-line bg-surface text-text hover:border-line-strong disabled:cursor-not-allowed disabled:text-placeholder"
    >
      {children}
    </button>
  )
}
