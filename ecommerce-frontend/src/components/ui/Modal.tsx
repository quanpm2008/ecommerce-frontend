import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

/** Centered popup built on the native <dialog> element (focus trap + Esc for free). */
export default function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className={cn(
        'm-auto w-[calc(100%-32px)] max-w-[440px] rounded-card bg-surface p-7 text-text drop-shadow-card',
        'backdrop:bg-text/30',
        className,
      )}
    >
      {open && children}
    </dialog>
  )
}
