import bookIcon from '../../../assets/icons/products/book.svg'
import bottleIcon from '../../../assets/icons/products/bottle.svg'
import headphonesIcon from '../../../assets/icons/products/headphones.svg'
import jacketIcon from '../../../assets/icons/products/jacket.svg'
import lampIcon from '../../../assets/icons/products/lamp.svg'
import shirtIcon from '../../../assets/icons/products/shirt.svg'
import type { ReactNode } from 'react'

/**
 * Background "phương án B" for customer auth screens (I.1, I.3, I.6, I.7):
 * faded product cards and category chips, slightly rotated around the form.
 * Fixed set stored in the frontend, decorative only (aria-hidden, not
 * clickable). Gently floats; animation stops with prefers-reduced-motion.
 *
 * Positions come from the 1280px Figma frame, so the layer is a centered
 * 1280px box and is hidden below the `lg` breakpoint where it would cover the form.
 */

type Placement = { left: number; top: number; width: number; height: number }

type ProductCard = {
  icon: string
  iconSize: number
  name: string
  price: string
  /** card width / image box size */
  size: 'lg' | 'md' | 'sm'
  rotate: number
  opacity: number
}

type Chip = { label: string; rotate: number; opacity: number }

const CARD_SIZES = {
  lg: { card: 150, imageW: 130, imageH: 111 },
  md: { card: 140, imageW: 120, imageH: 102 },
  sm: { card: 136, imageW: 116, imageH: 99 },
} as const

const PRODUCTS: Record<string, ProductCard> = {
  shirt: { icon: shirtIcon, iconSize: 36, name: 'Áo thun cotton', price: '199.000đ', size: 'lg', rotate: 7, opacity: 0.75 },
  lamp: { icon: lampIcon, iconSize: 36, name: 'Đèn bàn LED', price: '300.000đ', size: 'lg', rotate: -8, opacity: 0.75 },
  book: { icon: bookIcon, iconSize: 32, name: 'Clean Code', price: '250.000đ', size: 'sm', rotate: -5, opacity: 0.6 },
  headphones: { icon: headphonesIcon, iconSize: 32, name: 'Tai nghe', price: '120.000đ', size: 'sm', rotate: 5, opacity: 0.6 },
  bottle: { icon: bottleIcon, iconSize: 33, name: 'Bình giữ nhiệt', price: '250.000đ', size: 'md', rotate: -4, opacity: 0.5 },
  jacket: { icon: jacketIcon, iconSize: 33, name: 'Áo khoác gió', price: '249.000đ', size: 'md', rotate: 8, opacity: 0.5 },
}

const CHIPS: Record<string, Chip> = {
  fashion: { label: 'Thời trang', rotate: 4, opacity: 0.8 },
  books: { label: 'Sách', rotate: -5, opacity: 0.8 },
  accessories: { label: 'Phụ kiện', rotate: -4, opacity: 0.7 },
  home: { label: 'Gia dụng', rotate: 3, opacity: 0.7 },
}

/** Bounding boxes (after rotation) from Figma; `tall` = I.1 register, `default` = I.3/I.6/I.7. */
const LAYOUTS: Record<'default' | 'tall', { products: Record<string, Placement>; chips: Record<string, Placement> }> = {
  default: {
    products: {
      shirt: { left: 48, top: 58, width: 170, height: 194 },
      lamp: { left: 1024, top: 29, width: 173, height: 196 },
      book: { left: 256, top: 319, width: 150, height: 176 },
      headphones: { left: 895, top: 360, width: 150, height: 176 },
      bottle: { left: 38, top: 465, width: 151, height: 177 },
      jacket: { left: 1078, top: 454, width: 162, height: 186 },
    },
    chips: {
      fashion: { left: 292, top: 216, width: 96, height: 38 },
      books: { left: 858, top: 233, width: 64, height: 37 },
      accessories: { left: 179, top: 642, width: 83, height: 38 },
      home: { left: 984, top: 626, width: 87, height: 36 },
    },
  },
  tall: {
    products: {
      shirt: { left: 48, top: 72, width: 170, height: 194 },
      lamp: { left: 1024, top: 42, width: 173, height: 196 },
      book: { left: 256, top: 404, width: 150, height: 176 },
      headphones: { left: 895, top: 453, width: 150, height: 176 },
      bottle: { left: 38, top: 587, width: 151, height: 177 },
      jacket: { left: 1078, top: 570, width: 162, height: 186 },
    },
    chips: {
      fashion: { left: 292, top: 272, width: 96, height: 38 },
      books: { left: 858, top: 294, width: 64, height: 37 },
      accessories: { left: 179, top: 809, width: 83, height: 38 },
      home: { left: 984, top: 787, width: 87, height: 36 },
    },
  },
}

export default function FloatingProducts({ layout = 'default' }: { layout?: 'default' | 'tall' }) {
  const { products, chips } = LAYOUTS[layout]
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[1280px] -translate-x-1/2 select-none lg:block"
    >
      {Object.entries(chips).map(([key, place], index) => (
        <Floating key={key} place={place} index={index}>
          <div
            className="whitespace-nowrap rounded-full bg-surface px-3.5 py-1.5 text-small text-text-2"
            style={{ rotate: `${CHIPS[key].rotate}deg`, opacity: CHIPS[key].opacity }}
          >
            {CHIPS[key].label}
          </div>
        </Floating>
      ))}
      {Object.entries(products).map(([key, place], index) => {
        const product = PRODUCTS[key]
        const size = CARD_SIZES[product.size]
        return (
          <Floating key={key} place={place} index={index + 4}>
            <div
              className="flex flex-col items-start gap-1.5 rounded-2xl bg-surface p-2.5 drop-shadow-float"
              style={{ width: size.card, rotate: `${product.rotate}deg`, opacity: product.opacity }}
            >
              <div
                className="flex items-center justify-center rounded-field bg-soft"
                style={{ width: size.imageW, height: size.imageH }}
              >
                <img src={product.icon} alt="" width={product.iconSize} height={product.iconSize} />
              </div>
              <span className="text-caption text-text-2">{product.name}</span>
              <span className="text-caption font-medium text-text">{product.price}</span>
            </div>
          </Floating>
        )
      })}
    </div>
  )
}

/** Absolutely placed box that centers its (rotated) child and floats gently. */
export function Floating({ place, index, children }: { place: Placement; index: number; children: ReactNode }) {
  return (
    <div
      className="absolute flex animate-float items-center justify-center motion-reduce:animate-none"
      style={{
        left: place.left,
        top: place.top,
        width: place.width,
        height: place.height,
        // Different speed per card (5–7.4s) and staggered start.
        ['--float-duration' as string]: `${5 + (index % 4) * 0.8}s`,
        animationDelay: `${-index * 1.3}s`,
      }}
    >
      {children}
    </div>
  )
}

export type { Placement }
