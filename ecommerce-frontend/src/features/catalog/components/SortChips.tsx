import Chip from '../../../components/ui/Chip'
import type { ProductSort } from '../../../types'
import { cn } from '../../../utils/cn'

/** The three sort options drawn in II.2/II.5 (API also has ratingAverage,desc). */
const OPTIONS: Array<{ value: ProductSort; label: string }> = [
  { value: 'createdAt,desc', label: 'Mới nhất' },
  { value: 'priceVnd,asc', label: 'Giá tăng dần' },
  { value: 'priceVnd,desc', label: 'Giá giảm dần' },
]

export default function SortChips({
  value = 'createdAt,desc',
  onChange,
  className,
}: {
  value?: ProductSort
  onChange: (sort: ProductSort) => void
  className?: string
}) {
  return (
    <div role="group" aria-label="Sắp xếp" className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-small text-text-3">Sắp xếp</span>
      {OPTIONS.map((option) => (
        <Chip key={option.value} active={value === option.value} onClick={() => onChange(option.value)}>
          {option.label}
        </Chip>
      ))}
    </div>
  )
}
