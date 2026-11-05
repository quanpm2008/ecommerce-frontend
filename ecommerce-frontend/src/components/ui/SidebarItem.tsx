import type { ReactNode } from 'react'
import { NavLink } from 'react-router'
import { cn } from '../../utils/cn'

/** Figma: 0. Design system › Sidebar item. Active = accent-soft background. */
export default function SidebarItem({
  to,
  icon,
  children,
  end,
}: {
  to: string
  /** Tabler icon at 20px. */
  icon: ReactNode
  children: ReactNode
  end?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex h-[42px] items-center gap-3 rounded-field px-3 text-body transition-colors',
          isActive ? 'bg-accent-soft font-medium text-accent-dark' : 'text-text-2 hover:bg-soft hover:text-text',
        )
      }
    >
      {icon}
      {children}
    </NavLink>
  )
}
