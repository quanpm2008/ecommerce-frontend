import { IconInfoCircle } from '@tabler/icons-react'
import AppLink from '../ui/AppLink'
import { useCustomerLinks } from './links'

/** Figma: Footer (4:386). The simulated-payment notice is required by G-15. */
export default function CustomerFooter() {
  const links = useCustomerLinks()
  const linkClass = 'transition-colors hover:text-text'

  return (
    <footer className="border-t border-line bg-bg pb-[30px] pt-[26px]">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-3 px-4 text-small text-text-3 md:flex-row md:items-center md:gap-6 xl:px-0">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>© 2026 sàn.</span>
          <AppLink href={links.about} className={linkClass}>
            Giới thiệu
          </AppLink>
          <AppLink href={links.contact} className={linkClass}>
            Liên hệ
          </AppLink>
          <AppLink href={links.policy} className={linkClass}>
            Chính sách
          </AppLink>
        </div>
        <p className="flex items-center gap-1.5 md:ml-auto">
          <IconInfoCircle aria-hidden size={15} className="shrink-0" />
          Mọi giao dịch trên sàn là giả lập, không thu tiền thật.
        </p>
      </div>
    </footer>
  )
}
