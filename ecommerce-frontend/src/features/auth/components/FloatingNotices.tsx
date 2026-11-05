import boxIcon from '../../../assets/icons/notice-box.svg'
import chartBarIcon from '../../../assets/icons/notice-chart-bar.svg'
import circleCheckIcon from '../../../assets/icons/notice-circle-check.svg'
import receiptIcon from '../../../assets/icons/notice-receipt.svg'
import walletIcon from '../../../assets/icons/notice-wallet.svg'
import { Floating, type Placement } from './FloatingProducts'

/**
 * Background "phương án B" for seller auth screens: sample notification cards
 * (new order, balance, settlement) instead of products. Fixed content,
 * decorative only, never real data.
 */

type Notice = {
  icon: string
  title: string
  subtitle: string
  rotate: number
  opacity: number
  place: Placement
}

const NOTICES = {
  revenue: { icon: chartBarIcon, title: 'Doanh thu tháng 10', subtitle: '12.400.000đ' },
  listed: { icon: boxIcon, title: 'Sản phẩm đã đăng bán', subtitle: 'Áo thun basic cotton' },
  received: { icon: circleCheckIcon, title: 'Khách đã nhận hàng', subtitle: '#DH000105 · quyết toán 236.550đ' },
  balance: { icon: walletIcon, title: 'Số dư khả dụng', subtitle: '820.000đ' },
  newOrder: { icon: receiptIcon, title: 'Đơn mới #DH000130', subtitle: '398.000đ · vừa xong' },
}

/** I.2 Seller register: five cards on both sides of the form. */
const REGISTER: Notice[] = [
  { ...NOTICES.revenue, rotate: 4, opacity: 0.75, place: { left: -74, top: 80, width: 206, height: 75 } },
  { ...NOTICES.listed, rotate: -3, opacity: 0.6, place: { left: -40, top: 486, width: 230, height: 73 } },
  { ...NOTICES.received, rotate: -4, opacity: 0.75, place: { left: 1090, top: 44, width: 289, height: 81 } },
  { ...NOTICES.balance, rotate: 3, opacity: 0.6, place: { left: 1107, top: 578, width: 179, height: 70 } },
  { ...NOTICES.newOrder, rotate: -2, opacity: 0.45, place: { left: 1075, top: 330, width: 215, height: 68 } },
]

/** I.4 Seller login: two cards on the right edge. */
const LOGIN: Notice[] = [
  { ...NOTICES.newOrder, rotate: -5, opacity: 0.55, place: { left: 1126, top: 14, width: 218, height: 79 } },
  { ...NOTICES.balance, rotate: 4, opacity: 0.5, place: { left: 1148, top: 453, width: 180, height: 73 } },
]

export default function FloatingNotices({ layout }: { layout: 'register' | 'login' }) {
  const notices = layout === 'register' ? REGISTER : LOGIN
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[1280px] -translate-x-1/2 select-none lg:block"
    >
      {notices.map((notice, index) => (
        <Floating key={notice.title} place={notice.place} index={index}>
          <div
            className="flex items-center gap-3 rounded-card bg-surface px-4 py-3 drop-shadow-float"
            style={{ rotate: `${notice.rotate}deg`, opacity: notice.opacity }}
          >
            <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-accent-soft">
              <img src={notice.icon} alt="" width={18} height={18} />
            </span>
            <span className="flex flex-col whitespace-nowrap">
              <span className="text-small font-medium text-text">{notice.title}</span>
              <span className="text-caption text-text-3">{notice.subtitle}</span>
            </span>
          </div>
        </Floating>
      ))}
    </div>
  )
}
