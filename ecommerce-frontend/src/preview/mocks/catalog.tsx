import {
  IconBook,
  IconBottle,
  IconBox,
  IconCooker,
  IconHeadphones,
  IconJacket,
  IconLamp,
  IconShirt,
  IconTag,
} from '@tabler/icons-react'
import type { ReactNode } from 'react'
import type { SellerSummary } from '../../features/catalog'
import type { Category, Page, ProductCard, ProductQuery } from '../../types'

/**
 * Mock data shaped exactly like the API DTOs, using the products and sellers
 * drawn in Figma II.1–II.5, plus an in-memory "API" with the same
 * filter/sort/paging semantics as GET /products and GET /identity/sellers.
 */
export const categories: Category[] = [
  'Thời trang',
  'Điện thoại',
  'Máy tính',
  'Gia dụng',
  'Sách',
  'Mỹ phẩm',
  'Thể thao',
  'Đồ chơi',
  'Thực phẩm',
  'Phụ kiện',
].map((categoryName, index) => ({ categoryId: `cat-${index + 1}`, categoryName }))

const cat = (name: string) => categories.find((c) => c.categoryName === name)!.categoryId

export const sellers: SellerSummary[] = [
  { sellerId: 'sel-minh-anh', sellerName: 'Shop Minh Anh', description: 'Chuyên thời trang basic, giao nhanh trong ngày tại Hà Nội.', logoUrl: null, productCount: 48, ratingAverage: 4.8, joinedAt: '2026-09-02T03:00:00Z' },
  { sellerId: 'sel-gia-dung', sellerName: 'Shop Gia Dụng', description: 'Đồ bếp, đèn', logoUrl: null, productCount: 21, ratingAverage: 4.7, joinedAt: '2026-09-10T03:00:00Z' },
  { sellerId: 'sel-sach-hay', sellerName: 'Sách Hay', description: 'Sách lập trình', logoUrl: null, productCount: 30, ratingAverage: 4.9, joinedAt: '2026-09-15T03:00:00Z' },
  { sellerId: 'sel-ao-khoac', sellerName: 'Áo Khoác Hà Nội', description: 'Áo khoác, áo gió', logoUrl: null, productCount: 18, ratingAverage: 4.6, joinedAt: '2026-09-20T03:00:00Z' },
  { sellerId: 'sel-ao-dep', sellerName: 'Shop Áo Đẹp', description: 'Chuyên áo thun cotton', logoUrl: null, productCount: 32, ratingAverage: 4.8, joinedAt: '2026-09-22T03:00:00Z' },
  { sellerId: 'sel-ao-dai', sellerName: 'Áo Dài Xinh', description: 'Áo dài truyền thống', logoUrl: null, productCount: 9, ratingAverage: 4.5, joinedAt: '2026-10-01T03:00:00Z' },
  { sellerId: 'sel-the-thao', sellerName: 'Thể Thao 24h', description: 'Đồ tập, giày chạy bộ', logoUrl: null, productCount: 27, ratingAverage: 4.6, joinedAt: '2026-10-03T03:00:00Z' },
  { sellerId: 'sel-be-xinh', sellerName: 'Bé Xinh Store', description: 'Quần áo trẻ em', logoUrl: null, productCount: 14, ratingAverage: 4.7, joinedAt: '2026-10-05T03:00:00Z' },
  { sellerId: 'sel-phu-kien', sellerName: 'Phụ Kiện Số', description: 'Tai nghe, sạc, cáp', logoUrl: null, productCount: 40, ratingAverage: 4.4, joinedAt: '2026-10-08T03:00:00Z' },
  { sellerId: 'sel-moi', sellerName: 'Shop Mới Mở', description: 'Sắp ra mắt', logoUrl: null, productCount: 0, ratingAverage: null, joinedAt: '2026-11-01T03:00:00Z' },
]

type MockProduct = ProductCard & { categoryId: string; createdAt: string; icon: ReactNode }

let seq = 0
function product(
  productName: string,
  priceVnd: number,
  sellerId: string,
  category: string,
  icon: ReactNode,
  extra: Partial<ProductCard> = {},
): MockProduct {
  seq += 1
  return {
    productId: `p-${seq}`,
    productName,
    priceVnd,
    coverImageUrl: null,
    ratingAverage: 4.8,
    ratingCount: 120,
    stockStatus: 'IN_STOCK',
    sellerId,
    sellerName: sellers.find((s) => s.sellerId === sellerId)!.sellerName,
    categoryId: cat(category),
    // Newest first in declaration order.
    createdAt: new Date(Date.UTC(2026, 10, 5) - seq * 3_600_000).toISOString(),
    icon,
    ...extra,
  }
}

const shirt = <IconShirt size={56} />
const allProducts: MockProduct[] = [
  // II.1 "Mới lên kệ"
  product('Áo thun basic cotton unisex', 199000, 'sel-minh-anh', 'Thời trang', shirt),
  product('Bình giữ nhiệt inox 500ml', 250000, 'sel-gia-dung', 'Gia dụng', <IconBottle size={56} />),
  product('Nồi chiên không dầu 4L', 1200000, 'sel-gia-dung', 'Gia dụng', <IconCooker size={56} />, { stockStatus: 'OUT_OF_STOCK' }),
  product('Sách Clean Code (bản dịch)', 250000, 'sel-sach-hay', 'Sách', <IconBook size={56} />),
  product('Mũ lưỡi trai trơn', 149000, 'sel-minh-anh', 'Phụ kiện', <IconTag size={56} />),
  product('Đèn bàn LED chống cận', 300000, 'sel-gia-dung', 'Gia dụng', <IconLamp size={56} />),
  product('Áo khoác gió 2 lớp', 249000, 'sel-ao-khoac', 'Thời trang', <IconJacket size={56} />),
  product('Tai nghe có dây', 120000, 'sel-phu-kien', 'Phụ kiện', <IconHeadphones size={56} />),
  // II.2 "áo thun"
  product('Áo thun oversize trơn', 229000, 'sel-ao-dep', 'Thời trang', shirt),
  product('Áo thun polo cổ bẻ', 259000, 'sel-minh-anh', 'Thời trang', shirt, { stockStatus: 'OUT_OF_STOCK' }),
  product('Áo thun thể thao', 179000, 'sel-the-thao', 'Thể thao', shirt),
  product('Áo thun in chữ', 189000, 'sel-ao-dep', 'Thời trang', shirt),
  product('Áo thun trẻ em', 99000, 'sel-be-xinh', 'Thời trang', shirt, { ratingAverage: null, ratingCount: 0 }),
  // II.5 Shop Minh Anh
  product('Quần short kaki', 179000, 'sel-minh-anh', 'Thời trang', shirt),
  product('Quần jean slim', 459000, 'sel-minh-anh', 'Thời trang', shirt),
  product('Túi vải canvas', 129000, 'sel-minh-anh', 'Phụ kiện', <IconBox size={56} />),
  product('Áo sơ mi linen', 289000, 'sel-minh-anh', 'Thời trang', shirt),
  product('Tất cổ ngắn (5 đôi)', 89000, 'sel-minh-anh', 'Phụ kiện', shirt),
  // Filler so paging has several pages.
  ...Array.from({ length: 40 }, (_, i) =>
    product(`Áo thun cotton màu ${i + 1}`, 150000 + (i % 7) * 10000, i % 2 ? 'sel-ao-dep' : 'sel-minh-anh', 'Thời trang', shirt),
  ),
]

export function placeholderFor(productId: string): ReactNode {
  return allProducts.find((p) => p.productId === productId)?.icon
}

/** Accent-insensitive match ("ao thun" finds "Áo thun"), like the planned search. */
function matches(text: string, q?: string) {
  if (!q) return true
  const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase()
  return plain(text).includes(plain(q))
}

function paginate<T>(items: T[], page = 1, size = 20): Page<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / size))
  return { data: items.slice((page - 1) * size, page * size), meta: { page, size, totalItems: items.length, totalPages } }
}

/** Typing these keywords triggers the special states in the preview. */
export const MAGIC = { error: 'loi', empty: 'xyz', missingSeller: 'sel-khong-ton-tai' }

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms))

/** GET /products */
export async function listProducts(query: ProductQuery, size = 8): Promise<Page<ProductCard>> {
  await wait()
  if (query.q === MAGIC.error) throw new Error('Máy chủ không phản hồi (mock). Vui lòng thử lại.')
  const [field, dir] = (query.sort ?? 'createdAt,desc').split(',') as [keyof MockProduct, 'asc' | 'desc']
  const items = allProducts
    .filter((p) => matches(p.productName, query.q))
    .filter((p) => !query.categoryId || p.categoryId === query.categoryId)
    .filter((p) => !query.sellerId || p.sellerId === query.sellerId)
    .filter((p) => query.minPriceVnd == null || p.priceVnd >= query.minPriceVnd)
    .filter((p) => query.maxPriceVnd == null || p.priceVnd <= query.maxPriceVnd)
    .sort((a, b) => {
      const order = (a[field] as number | string) > (b[field] as number | string) ? 1 : -1
      return dir === 'asc' ? order : -order
    })
  return paginate(items, query.page, size)
}

/** GET /identity/sellers */
export async function listSellers(q: string | undefined, page = 1, size = 4): Promise<Page<SellerSummary>> {
  await wait()
  if (q === MAGIC.error) throw new Error('Máy chủ không phản hồi (mock). Vui lòng thử lại.')
  return paginate(sellers.filter((s) => matches(s.sellerName, q) || matches(s.description ?? '', q)), page, size)
}

/** GET /identity/sellers/{id} → null on 404. */
export async function getSeller(sellerId: string): Promise<SellerSummary | null> {
  await wait(250)
  return sellers.find((s) => s.sellerId === sellerId) ?? null
}
