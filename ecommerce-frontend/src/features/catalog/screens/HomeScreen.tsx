import { IconArrowRight, IconSearch } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { PageContainer, useCustomerLinks } from '../../../components/customer'
import AppLink from '../../../components/ui/AppLink'
import Button from '../../../components/ui/Button'
import Chip from '../../../components/ui/Chip'
import Pagination from '../../../components/ui/Pagination'
import type { Category, ProductCard } from '../../../types'
import ProductGrid from '../components/ProductGrid'
import { SellerTile } from '../components/SellerCards'
import type { ListStatus, SellerSummary } from '../types'

export type HomeScreenProps = ListStatus & {
  /** GET /categories */
  categories: Category[]
  /** GET /products?sort=createdAt,desc&page= — "Mới lên kệ". */
  products: ProductCard[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  /** GET /identity/sellers — "Người bán mới tham gia" (block hidden when empty). */
  sellers: SellerSummary[]
  /** Defaults to navigating to the search page (II.2). */
  onSearch?: (q: string) => void
  /** Mock/preview only. */
  placeholderFor?: (productId: string) => ReactNode
}

/**
 * II.1 Trang chủ · UC-B01. Same content for guests and customers; the shell
 * switches the navbar. No flash sale / vouchers / banners (out of FRD scope).
 */
export default function HomeScreen({
  categories,
  products,
  page,
  totalPages,
  onPageChange,
  sellers,
  onSearch,
  loading,
  error,
  onRetry,
  placeholderFor,
}: HomeScreenProps) {
  const links = useCustomerLinks()
  const navigate = useNavigate()
  const search = (q: string) => (onSearch ? onSearch(q) : navigate(links.search({ q })))

  return (
    <PageContainer className="flex flex-col gap-7 pb-14 pt-6">
      <section className="flex flex-col items-center gap-3.5 pb-2 pt-9 text-center">
        <h1 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.025em] text-text sm:text-display">
          Tìm thứ bạn cần,
          <br />
          không chen lấn.
        </h1>
        <p className="text-body text-text-2">
          Hàng từ những người bán đã được duyệt. Không flash sale, không mã giảm giá, chỉ có giá thật.
        </p>
        <form
          role="search"
          className="mt-0 flex w-full max-w-[640px] items-center gap-3 rounded-full border border-line bg-surface py-2 pl-6 pr-2 drop-shadow-[0_8px_12px_rgb(31_31_26/0.06)] focus-within:border-line-strong"
          onSubmit={(event) => {
            event.preventDefault()
            search(String(new FormData(event.currentTarget).get('q') ?? '').trim())
          }}
        >
          <IconSearch aria-hidden size={20} className="shrink-0 text-text-3" />
          <input
            name="q"
            type="search"
            maxLength={100}
            aria-label="Tìm sản phẩm hoặc người bán"
            placeholder="Áo thun, nồi chiên, Shop Minh Anh…"
            className="min-w-0 flex-1 bg-transparent text-body text-text outline-none placeholder:text-text-3"
          />
          <Button type="submit">Tìm kiếm</Button>
        </form>
        <nav aria-label="Danh mục" className="flex flex-wrap justify-center gap-2 pt-2.5">
          <Chip active>Tất cả</Chip>
          {categories.map((category) => (
            <Chip
              key={category.categoryId}
              onClick={() => navigate(links.search({ categoryId: category.categoryId }))}
            >
              {category.categoryName}
            </Chip>
          ))}
        </nav>
      </section>

      <section aria-labelledby="home-new" className="flex flex-col gap-7">
        <SectionHeader
          id="home-new"
          title="Mới lên kệ"
          hint="Sắp xếp: mới nhất"
          link={{ href: links.search({}), label: 'Xem tất cả' }}
        />
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onRetry={onRetry}
          placeholderFor={placeholderFor}
          empty={<p className="py-10 text-center text-body text-text-2">Chưa có sản phẩm nào được đăng bán.</p>}
        />
        {!error && <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />}
      </section>

      {sellers.length > 0 && (
        <section aria-labelledby="home-sellers" className="flex flex-col gap-7">
          <SectionHeader id="home-sellers" title="Người bán mới tham gia" link={{ href: links.sellers, label: 'Tất cả người bán' }} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sellers.slice(0, 4).map((seller) => (
              <SellerTile key={seller.sellerId} seller={seller} />
            ))}
          </div>
        </section>
      )}
    </PageContainer>
  )
}

function SectionHeader({
  id,
  title,
  hint,
  link,
}: {
  id: string
  title: string
  hint?: string
  link: { href: string; label: string }
}) {
  return (
    <div className="flex items-baseline gap-3 pt-6">
      <h2 id={id} className="text-h2 text-text">
        {title}
      </h2>
      {hint && <span className="hidden text-small text-text-3 sm:inline">{hint}</span>}
      <AppLink
        href={link.href}
        className="ml-auto flex shrink-0 items-center gap-1 text-body font-medium text-accent hover:text-accent-dark"
      >
        {link.label}
        <IconArrowRight aria-hidden size={16} />
      </AppLink>
    </div>
  )
}
