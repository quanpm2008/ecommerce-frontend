import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import type { ProductCard as ProductCardData } from '../../../types'
import { cn } from '../../../utils/cn'
import type { ListStatus } from '../types'
import ProductCard from './ProductCard'

/**
 * Product grid (4 columns on full-width pages, 3 next to the II.2 filter).
 * Handles loading skeletons, request errors and the empty state.
 */
export default function ProductGrid({
  products,
  columns = 4,
  loading,
  error,
  onRetry,
  empty,
  placeholderFor,
  skeletonCount = 8,
}: ListStatus & {
  products: ProductCardData[]
  columns?: 3 | 4
  /** Shown when the list is empty (and not loading / failed). */
  empty?: ReactNode
  /** Mock/preview only: icon shown instead of a missing cover image. */
  placeholderFor?: (productId: string) => ReactNode
  skeletonCount?: number
}) {
  if (error) return <ListError message={error} onRetry={onRetry} />
  if (!loading && products.length === 0) return <>{empty}</>

  return (
    <div
      aria-busy={loading || undefined}
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:gap-x-6',
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
      )}
    >
      {loading
        ? Array.from({ length: skeletonCount }, (_, i) => <ProductCardSkeleton key={i} />)
        : products.map((product) => (
            <ProductCard key={product.productId} product={product} placeholder={placeholderFor?.(product.productId)} />
          ))}
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden className="flex animate-pulse flex-col">
      <div className="aspect-square w-full rounded-media bg-soft" />
      <div className="flex flex-col gap-2 pt-3">
        <div className="h-4 w-4/5 rounded bg-soft" />
        <div className="h-3 w-1/2 rounded bg-soft" />
        <div className="h-4 w-1/3 rounded bg-soft-2" />
      </div>
    </div>
  )
}

/** Request failed: message + retry. */
export function ListError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon={<IconAlertTriangle size={26} />}
      title="Không tải được dữ liệu"
      description={message}
      action={
        onRetry && (
          <Button variant="secondary" size="s" icon={<IconRefresh size={16} />} onClick={onRetry}>
            Thử lại
          </Button>
        )
      }
    />
  )
}
