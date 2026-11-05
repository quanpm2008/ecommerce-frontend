import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { cn } from '../../utils/cn'

/**
 * Pager from II.1 (not a Design system component). Pages start at 1, matching
 * the API `page`/`meta.totalPages`. Controlled: the screen never slices data.
 */
export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}) {
  if (totalPages <= 1) return null

  const arrowClass =
    'flex size-9 items-center justify-center rounded-full border border-line bg-surface text-text transition-colors hover:border-line-strong disabled:cursor-not-allowed disabled:text-placeholder disabled:hover:border-line'

  return (
    <nav aria-label="Phân trang" className={cn('flex items-center justify-center gap-1.5', className)}>
      <button
        type="button"
        aria-label="Trang trước"
        className={arrowClass}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <IconChevronLeft size={16} />
      </button>
      {pageItems(page, totalPages).map((item, index) =>
        item === 'gap' ? (
          <span key={`gap-${index}`} aria-hidden className="flex size-9 items-center justify-center text-small font-medium text-text-2">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
            className={cn(
              'flex size-9 items-center justify-center rounded-full text-small font-medium transition-colors',
              item === page ? 'bg-text text-white' : 'text-text-2 hover:bg-soft hover:text-text',
            )}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="Trang sau"
        className={arrowClass}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <IconChevronRight size={16} />
      </button>
    </nav>
  )
}

/** 1 2 3 … 10 / 1 … 4 5 6 … 10 / 1 … 8 9 10 */
function pageItems(page: number, total: number): Array<number | 'gap'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (page <= 3) return [1, 2, 3, 'gap', total]
  if (page >= total - 2) return [1, 'gap', total - 2, total - 1, total]
  return [1, 'gap', page - 1, page, page + 1, 'gap', total]
}
