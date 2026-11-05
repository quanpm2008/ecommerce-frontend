import { useState } from 'react'
import { MemoryRouter, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { CustomerShell, PageContainer } from '../components/customer'
import Toggle from '../components/ui/Toggle'
import { HomeScreen, ProductSearchScreen, SellerScreen, SellerSearchScreen } from '../features/catalog'
import type { ProductQuery, ProductSort } from '../types'
import ComponentKit from './ComponentKit'
import { categories, getSeller, listProducts, listSellers, MAGIC, placeholderFor } from './mocks/catalog'
import { useMockQuery } from './useMockQuery'

/**
 * Section II preview. Each route plays the integrator's role: read params,
 * call the (mock) API, pass the results to the presentational screen.
 */
const SCREENS = [
  { path: '/', label: 'II.1 Trang chủ' },
  { path: '/search?q=áo thun', label: 'II.2 Tìm "áo thun"' },
  { path: `/search?q=${MAGIC.empty}`, label: 'II.2 · không có kết quả' },
  { path: `/search?q=${MAGIC.error}`, label: 'II.2 · lỗi tải (thử lại)' },
  { path: '/search?q=áo&tab=sellers', label: 'II.3 Người bán "áo"' },
  { path: `/search?q=${MAGIC.empty}&tab=sellers`, label: 'II.3 · không có kết quả' },
  { path: '/sellers/sel-minh-anh', label: 'II.5 Shop Minh Anh' },
  { path: '/sellers/sel-moi', label: 'II.5 · shop chưa có sản phẩm' },
  { path: `/sellers/${MAGIC.missingSeller}`, label: 'II.5 · không tồn tại' },
  { path: '/__kit', label: 'Bộ component (Đợt 0)' },
]

export default function StorefrontPreview() {
  const [signedIn, setSignedIn] = useState(true)
  const [paymentBlocked, setPaymentBlocked] = useState(false)

  return (
    <MemoryRouter initialEntries={['/']}>
      <CustomerShell
        user={signedIn ? { fullName: 'Nguyễn Văn A' } : null}
        unreadCount={2}
        cartCount={3}
        paymentBlocked={signedIn && paymentBlocked}
        onLogout={() => setSignedIn(false)}
      >
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/search" element={<SearchRoute />} />
          <Route path="/sellers/:sellerId" element={<SellerRoute />} />
          <Route path="/__kit" element={<ComponentKit />} />
          <Route path="*" element={<NavigatedTo />} />
        </Routes>
      </CustomerShell>
      <Toolbar
        signedIn={signedIn}
        onSignedIn={setSignedIn}
        paymentBlocked={paymentBlocked}
        onPaymentBlocked={setPaymentBlocked}
      />
    </MemoryRouter>
  )
}

function HomeRoute() {
  const [page, setPage] = useState(1)
  const products = useMockQuery(`home-${page}`, () => listProducts({ sort: 'createdAt,desc', page }))
  const sellers = useMockQuery('home-sellers', () => listSellers(undefined, 1, 4))
  return (
    <HomeScreen
      categories={categories}
      products={products.data?.data ?? []}
      page={page}
      totalPages={products.data?.meta.totalPages ?? 1}
      onPageChange={setPage}
      sellers={sellers.data?.data ?? []}
      loading={products.loading}
      error={products.error}
      onRetry={products.retry}
      placeholderFor={placeholderFor}
    />
  )
}

/** /search?q=&categoryId=&minPriceVnd=&maxPriceVnd=&sort=&page=&tab= */
function SearchRoute() {
  const [params, setParams] = useSearchParams()
  const num = (name: string) => (params.get(name) ? Number(params.get(name)) : undefined)
  const query: ProductQuery = {
    q: params.get('q') ?? undefined,
    categoryId: params.get('categoryId') ?? undefined,
    minPriceVnd: num('minPriceVnd'),
    maxPriceVnd: num('maxPriceVnd'),
    sort: (params.get('sort') as ProductSort | null) ?? undefined,
    page: num('page') ?? 1,
  }
  const setQuery = (next: ProductQuery & { tab?: string }) => {
    const out = new URLSearchParams()
    for (const [key, value] of Object.entries(next)) if (value != null && value !== '') out.set(key, String(value))
    setParams(out)
  }

  if (params.get('tab') === 'sellers') return <SellerSearchRoute q={query.q} page={query.page ?? 1} onPage={(page) => setQuery({ q: query.q, tab: 'sellers', page })} />
  return <ProductSearchRoute query={query} onQueryChange={setQuery} />
}

function ProductSearchRoute({ query, onQueryChange }: { query: ProductQuery; onQueryChange: (q: ProductQuery) => void }) {
  const result = useMockQuery(`products-${JSON.stringify(query)}`, () => listProducts(query, 6))
  const related = useMockQuery(`related-${query.q}`, () => (query.q ? listSellers(query.q, 1, 1) : Promise.resolve(null)))
  return (
    <ProductSearchScreen
      query={query}
      onQueryChange={onQueryChange}
      products={result.data?.data ?? []}
      meta={result.data?.meta}
      categories={categories}
      relatedSeller={related.data?.data[0] ?? null}
      loading={result.loading}
      error={result.error}
      onRetry={result.retry}
      placeholderFor={placeholderFor}
    />
  )
}

function SellerSearchRoute({ q, page, onPage }: { q?: string; page: number; onPage: (page: number) => void }) {
  const result = useMockQuery(`sellers-${q}-${page}`, () => listSellers(q, page))
  return (
    <SellerSearchScreen
      q={q}
      sellers={result.data?.data ?? []}
      meta={result.data?.meta}
      page={page}
      onPageChange={onPage}
      loading={result.loading}
      error={result.error}
      onRetry={result.retry}
    />
  )
}

function SellerRoute() {
  const { sellerId = '' } = useParams()
  const [sort, setSort] = useState<ProductSort>('createdAt,desc')
  const [page, setPage] = useState(1)
  const seller = useMockQuery(`seller-${sellerId}`, () => getSeller(sellerId))
  const products = useMockQuery(`seller-products-${sellerId}-${sort}-${page}`, () => listProducts({ sellerId, sort, page }))

  if (seller.loading) return <PageContainer className="py-16 text-center text-body text-text-3">Đang tải…</PageContainer>
  return (
    <SellerScreen
      seller={seller.data ?? null}
      products={products.data?.data ?? []}
      meta={products.data?.meta}
      sort={sort}
      onSortChange={(next) => {
        setSort(next)
        setPage(1)
      }}
      page={page}
      onPageChange={setPage}
      loading={products.loading}
      error={products.error}
      onRetry={products.retry}
      placeholderFor={placeholderFor}
    />
  )
}

function NavigatedTo() {
  const location = useLocation()
  return (
    <PageContainer className="py-16">
      <p className="text-body text-text-2">
        Điều hướng tới <code className="rounded bg-soft px-1.5">{location.pathname + location.search}</code> — màn này sẽ có ở
        các đợt sau.
      </p>
    </PageContainer>
  )
}

function Toolbar({
  signedIn,
  onSignedIn,
  paymentBlocked,
  onPaymentBlocked,
}: {
  signedIn: boolean
  onSignedIn: (value: boolean) => void
  paymentBlocked: boolean
  onPaymentBlocked: (value: boolean) => void
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(true)
  const current = SCREENS.find((s) => s.path === decodeURIComponent(location.pathname + location.search))?.path ?? ''

  return (
    <aside className="fixed bottom-4 left-4 z-50 flex w-[280px] flex-col gap-2 rounded-card border border-line bg-surface p-3 text-small shadow-lg">
      <div className="flex items-center justify-between">
        <strong className="font-medium">UI preview · Mục II</strong>
        <button className="text-text-3 hover:text-text" onClick={() => setOpen(!open)}>
          {open ? 'Thu gọn' : 'Mở'}
        </button>
      </div>
      {open && (
        <>
          <select
            className="h-9 rounded-field border border-line-strong bg-surface px-2"
            value={current}
            onChange={(event) => navigate(event.target.value)}
          >
            <option value="" disabled>
              — Chọn màn / trạng thái —
            </option>
            {SCREENS.map((screen) => (
              <option key={screen.path} value={screen.path}>
                {screen.label}
              </option>
            ))}
          </select>
          <Toggle checked={signedIn} onChange={onSignedIn} label="Đã đăng nhập" />
          <Toggle checked={paymentBlocked} onChange={onPaymentBlocked} label="Bị hạn chế thanh toán" disabled={!signedIn} />
          <p className="text-caption text-text-3">
            Gõ “{MAGIC.empty}” để xem không có kết quả, “{MAGIC.error}” để xem lỗi tải.
          </p>
        </>
      )}
    </aside>
  )
}
