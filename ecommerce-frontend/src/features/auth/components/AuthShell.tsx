import type { ReactNode } from 'react'
import AppLink from '../../../components/ui/AppLink'
import Tag from '../../../components/ui/Tag'
import { cn } from '../../../utils/cn'

/**
 * Page frame shared by I.1–I.7: white 68px header with the "sàn." logo,
 * optional role tag and right-side slot, then a soft grey body that holds the
 * decorative background and the centered content.
 */
export default function AuthShell({
  tag,
  homeHref = '/',
  headerRight,
  background,
  children,
}: {
  /** e.g. "Kênh Người Bán", "Quản trị" */
  tag?: string
  /** Where the "sàn." logo leads (default: shop home "/"). */
  homeHref?: string
  headerRight?: ReactNode
  background?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="flex h-[68px] shrink-0 items-center gap-4 border-b border-line bg-surface px-4 sm:px-10 lg:px-20">
        <AppLink href={homeHref} title="Về trang chủ" className="text-h2 text-accent-dark">
          sàn<span className="text-accent">.</span>
        </AppLink>
        {tag && <Tag>{tag}</Tag>}
        <div className="flex-1" />
        {headerRight}
      </header>
      <main className="relative flex flex-1 flex-col items-center overflow-clip bg-soft px-4 pb-18 pt-14">
        {background}
        <div className="relative flex w-full flex-col items-center">{children}</div>
      </main>
    </div>
  )
}

/** Header right side: "Đã có tài khoản? [Đăng nhập]". */
export function HeaderPrompt({ text, children }: { text: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="hidden text-small text-text-2 sm:inline">{text}</span>
      {children}
    </div>
  )
}

/** White card holding a form (Figma "Card": 440px, 36px padding, 16px gap). */
export function AuthCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string
  subtitle?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'flex w-full max-w-[440px] flex-col gap-4 rounded-card border border-line bg-surface p-6 drop-shadow-card sm:p-9',
        className,
      )}
    >
      <div className="flex flex-col gap-1.5 pb-1.5">
        <h1 className="text-h1 text-text">{title}</h1>
        {subtitle && <p className="text-body text-text-2">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}
