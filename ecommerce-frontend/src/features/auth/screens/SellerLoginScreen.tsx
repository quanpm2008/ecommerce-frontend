import AppLink from '../../../components/ui/AppLink'
import Tag from '../../../components/ui/Tag'
import arrowRightIcon from '../../../assets/icons/arrow-right.svg'
import boxIcon from '../../../assets/icons/feature-box.svg'
import receiptIcon from '../../../assets/icons/feature-receipt.svg'
import walletIcon from '../../../assets/icons/feature-wallet.svg'
import AuthShell from '../components/AuthShell'
import FloatingNotices from '../components/FloatingNotices'
import { CardFooterLink } from '../components/FormBits'
import LoginForm, { type LoginFormProps } from '../components/LoginForm'

const FEATURES = [
  { icon: boxIcon, text: 'Tự quản lý sản phẩm, ảnh/video và tồn kho' },
  { icon: receiptIcon, text: 'Nhận đơn riêng của shop từ mỗi lần checkout của khách' },
  { icon: walletIcon, text: 'Theo dõi doanh thu, hoa hồng, ví và rút tiền (giả lập)' },
]

/**
 * I.4 Đăng nhập người bán (landing) · UC-A03 (seller domain).
 * Email + password only (no Google). Pending / rejected / banned seller:
 * return `{ formError }` with the matching reason. Success: III.1 Tổng quan.
 */
export default function SellerLoginScreen({
  registerHref,
  shopHref,
  ...formProps
}: LoginFormProps & {
  registerHref: string
  /** Customer domain URL for "Về trang mua sắm". */
  shopHref: string
}) {
  return (
    <AuthShell
      tag="Kênh Người Bán"
      headerRight={
        <AppLink href={shopHref} className="inline-flex items-center gap-1 text-small font-medium text-text-2 hover:text-text">
          Về trang mua sắm
          <img src={arrowRightIcon} alt="" width={16} height={16} />
        </AppLink>
      }
      background={<FloatingNotices layout="login" />}
    >
      <div className="flex w-full max-w-[1120px] flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-20">
        <div className="flex w-full flex-1 flex-col items-start gap-[22px] lg:pt-6">
          <Tag tone="green">Kênh Người Bán</Tag>
          <p className="text-[32px] leading-[1.15] font-semibold tracking-[-0.025em] text-text lg:text-display">
            Bán hàng cùng sàn,
            <br />
            đơn giản và minh bạch.
          </p>
          <p className="text-body text-text-2">Mở gian hàng miễn phí, tiếp cận khách hàng trên toàn nền tảng.</p>
          <ul className="flex w-full flex-col gap-3.5 pt-2">
            {FEATURES.map((feature) => (
              <li key={feature.text} className="flex items-center gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface">
                  <img src={feature.icon} alt="" width={20} height={20} />
                </span>
                <span className="text-body text-text">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <LoginForm
          {...formProps}
          title="Đăng nhập Kênh Người Bán"
          emailPlaceholder="shop@gmail.com"
          footer={<CardFooterLink text="Chưa có tài khoản?" linkText="Đăng ký bán hàng" href={registerHref} />}
        />
      </div>
    </AuthShell>
  )
}
