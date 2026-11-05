import { IconAlertTriangle } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import CustomerFooter from './CustomerFooter'
import CustomerNavbar, { type CustomerNavbarProps } from './CustomerNavbar'

/**
 * Page frame for every section II screen: navbar (guest or customer), the
 * page content on the warm background, footer.
 */
export default function CustomerShell({
  children,
  paymentBlocked = false,
  ...navbar
}: CustomerNavbarProps & {
  children: ReactNode
  /**
   * Customer banned after having paid orders (CustomerProfile.paymentBlocked):
   * can still browse, cancel and confirm, but cannot pay (II.1 note).
   */
  paymentBlocked?: boolean
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <CustomerNavbar {...navbar} />
      {paymentBlocked && (
        <div role="status" className="border-b border-warn/15 bg-warn-soft text-warn">
          <PageContainer className="flex items-center gap-2 py-2.5 text-small">
            <IconAlertTriangle aria-hidden size={16} className="shrink-0" />
            Tài khoản đang bị hạn chế thanh toán. Bạn vẫn có thể xem, hủy và xác nhận các đơn đã đặt.
          </PageContainer>
        </div>
      )}
      <main className="flex-1">{children}</main>
      <CustomerFooter />
    </div>
  )
}

/** Centered 1120px content column used by the section II screens. */
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1120px] px-4 xl:px-0', className)}>{children}</div>
}
