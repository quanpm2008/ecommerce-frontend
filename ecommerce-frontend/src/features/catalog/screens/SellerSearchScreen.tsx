import { IconBuildingStore } from '@tabler/icons-react'
import { useNavigate } from 'react-router'
import { PageContainer, useCustomerLinks } from '../../../components/customer'
import Chip from '../../../components/ui/Chip'
import EmptyState from '../../../components/ui/EmptyState'
import Pagination from '../../../components/ui/Pagination'
import type { PageMeta } from '../../../types'
import { ListError } from '../components/ProductGrid'
import { SellerRow } from '../components/SellerCards'
import type { ListStatus, SellerSummary } from '../types'

export type SellerSearchScreenProps = ListStatus & {
  /** Keyword; empty = browse all sellers (navbar "Người bán"). */
  q?: string
  /** GET /identity/sellers?q=&page= (approved + active sellers only). */
  sellers: SellerSummary[]
  meta?: PageMeta
  page: number
  onPageChange: (page: number) => void
}

/** II.3 Kết quả tìm kiếm người bán · UC-B02. */
export default function SellerSearchScreen({
  q,
  sellers,
  meta,
  page,
  onPageChange,
  loading,
  error,
  onRetry,
}: SellerSearchScreenProps) {
  const links = useCustomerLinks()
  const navigate = useNavigate()

  return (
    <PageContainer className="flex flex-col gap-6 pb-14 pt-8">
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <h1 className="text-h1 text-text">{q ? `Người bán phù hợp với “${q}”` : 'Người bán trên sàn'}</h1>
        {meta && <p className="text-body text-text-3">{meta.totalItems} người bán</p>}
      </div>

      <div role="tablist" aria-label="Loại kết quả" className="flex gap-2">
        <Chip role="tab" aria-selected={false} onClick={() => navigate(links.search({ q }))}>
          Sản phẩm
        </Chip>
        <Chip role="tab" aria-selected active>
          Người bán
        </Chip>
      </div>

      {error ? (
        <ListError message={error} onRetry={onRetry} />
      ) : loading ? (
        <ul aria-busy className="rounded-card border border-line bg-surface px-6 py-1.5">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i} className="flex animate-pulse items-center gap-4 border-b border-line py-[18px] last:border-b-0">
              <span className="size-14 shrink-0 rounded-full bg-soft" />
              <span className="flex flex-1 flex-col gap-2">
                <span className="h-4 w-40 rounded bg-soft" />
                <span className="h-3 w-56 rounded bg-soft" />
              </span>
            </li>
          ))}
        </ul>
      ) : sellers.length === 0 ? (
        <EmptyState
          icon={<IconBuildingStore size={26} />}
          title="Không tìm thấy người bán phù hợp"
          description="Thử tìm bằng tên cửa hàng khác, hoặc xem kết quả sản phẩm cho từ khóa này."
        />
      ) : (
        <ul className="rounded-card border border-line bg-surface px-4 py-1.5 sm:px-6">
          {sellers.map((seller) => (
            <SellerRow key={seller.sellerId} seller={seller} />
          ))}
        </ul>
      )}

      {!error && <Pagination page={page} totalPages={meta?.totalPages ?? 1} onPageChange={onPageChange} />}
    </PageContainer>
  )
}
