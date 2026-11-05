import { IconFilter } from '@tabler/icons-react'
import { useState } from 'react'
import Button from '../../../components/ui/Button'
import Checkbox from '../../../components/ui/Checkbox'
import type { Category, ProductQuery } from '../../../types'
import { cn } from '../../../utils/cn'

export type FilterValues = Pick<ProductQuery, 'categoryId' | 'minPriceVnd' | 'maxPriceVnd'>

/**
 * II.2 "Bộ lọc" card. Edits a draft and commits on "Áp dụng".
 * Category: GET /products takes a single categoryId, so ticking one unticks
 * the others (Figma shows checkboxes).
 */
export default function ProductFilters({
  categories,
  value,
  onApply,
  className,
}: {
  categories: Category[]
  value: FilterValues
  onApply: (next: FilterValues) => void
  className?: string
}) {
  const [categoryId, setCategoryId] = useState(value.categoryId)
  const [min, setMin] = useState(value.minPriceVnd?.toString() ?? '')
  const [max, setMax] = useState(value.maxPriceVnd?.toString() ?? '')
  const [error, setError] = useState<string>()

  const toNumber = (text: string) => (text.trim() === '' ? undefined : Number(text.replace(/\D/g, '')))

  const apply = () => {
    const minPriceVnd = toNumber(min)
    const maxPriceVnd = toNumber(max)
    if (minPriceVnd != null && maxPriceVnd != null && minPriceVnd > maxPriceVnd) {
      setError('Giá "Từ" phải nhỏ hơn hoặc bằng giá "Đến".')
      return
    }
    setError(undefined)
    onApply({ categoryId, minPriceVnd, maxPriceVnd })
  }

  const clear = () => {
    setCategoryId(undefined)
    setMin('')
    setMax('')
    setError(undefined)
    onApply({})
  }

  const priceInput = 'h-11 w-full min-w-0 rounded-field border border-line-strong bg-surface px-3.5 text-body text-text outline-none placeholder:text-text-3 focus:border-accent focus:ring-2 focus:ring-accent-soft'

  return (
    <form
      aria-label="Bộ lọc"
      className={cn('flex flex-col gap-[18px] rounded-card border border-line bg-surface p-[22px]', className)}
      onSubmit={(event) => {
        event.preventDefault()
        apply()
      }}
    >
      <p className="flex items-center gap-2 text-h3 text-text">
        <IconFilter aria-hidden size={18} />
        Bộ lọc
      </p>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-small font-medium text-text-2">Danh mục</legend>
        {categories.map((category) => (
          <Checkbox
            key={category.categoryId}
            label={category.categoryName}
            className="gap-2.5"
            checked={categoryId === category.categoryId}
            onChange={(event) => setCategoryId(event.target.checked ? category.categoryId : undefined)}
          />
        ))}
      </fieldset>

      <hr className="border-line" />

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 text-small font-medium text-text-2">Khoảng giá</legend>
        <div className="flex items-center gap-2">
          <input
            inputMode="numeric"
            aria-label="Giá từ"
            placeholder="Từ"
            value={min}
            onChange={(event) => setMin(event.target.value)}
            className={priceInput}
          />
          <span aria-hidden className="text-body text-text-3">
            –
          </span>
          <input
            inputMode="numeric"
            aria-label="Giá đến"
            placeholder="Đến"
            value={max}
            onChange={(event) => setMax(event.target.value)}
            className={priceInput}
          />
        </div>
        {error && <p className="text-caption text-danger">{error}</p>}
      </fieldset>

      <Button type="submit" variant="secondary" block>
        Áp dụng
      </Button>
      <button type="button" onClick={clear} className="text-small font-medium text-text-2 hover:text-text">
        Xóa bộ lọc
      </button>
    </form>
  )
}
