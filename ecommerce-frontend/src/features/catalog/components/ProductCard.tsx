import { IconStar } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import AppLink from '../../../components/ui/AppLink'
import { useCustomerLinks } from '../../../components/customer'
import type { ProductCard as ProductCardData } from '../../../types'
import { cn } from '../../../utils/cn'
import { formatRating, formatVnd } from '../../../utils/format'
import ProductImage from './ProductImage'

/**
 * Figma: 0. Design system › Product card (Badge=None / Out of stock).
 * Out-of-stock products stay visible with a badge (II.1 note).
 */
export default function ProductCard({
  product,
  placeholder,
  className,
}: {
  product: ProductCardData
  /** Icon shown while there is no cover image. */
  placeholder?: ReactNode
  className?: string
}) {
  const links = useCustomerLinks()
  const outOfStock = product.stockStatus === 'OUT_OF_STOCK'

  return (
    <AppLink href={links.product(product.productId)} className={cn('group flex min-w-0 flex-col', className)}>
      <ProductImage
        src={product.coverImageUrl}
        alt={product.productName}
        placeholder={placeholder}
        className="aspect-square w-full rounded-media transition-[filter] group-hover:brightness-[0.97]"
      >
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-[3px] text-caption font-medium text-text-2">
            Hết hàng
          </span>
        )}
      </ProductImage>
      <div className="flex flex-col gap-1 pt-3">
        <p className="line-clamp-2 text-body text-text group-hover:underline">{product.productName}</p>
        <p className="flex min-w-0 items-center gap-1.5 text-caption text-text-3">
          <span className="truncate">{product.sellerName}</span>
          {product.ratingCount > 0 && (
            <>
              <span aria-hidden>·</span>
              <IconStar aria-hidden size={12} className="shrink-0 text-star" />
              <span>
                <span className="sr-only">Đánh giá </span>
                {formatRating(product.ratingAverage)}
              </span>
            </>
          )}
        </p>
        <p className="text-price text-text">{formatVnd(product.priceVnd)}</p>
      </div>
    </AppLink>
  )
}
