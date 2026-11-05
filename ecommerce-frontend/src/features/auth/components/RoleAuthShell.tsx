import type { ReactNode } from 'react'
import type { AuthRole } from '../types'
import AuthShell from './AuthShell'
import FloatingNotices from './FloatingNotices'
import FloatingProducts from './FloatingProducts'

/**
 * Shell for screens that exist on all three domains (I.6, I.7).
 * Figma only draws the customer version; seller/admin reuse the header tag
 * and background of their own login screen (I.4 / I.5).
 */
export default function RoleAuthShell({ role, children }: { role: AuthRole; children: ReactNode }) {
  if (role === 'seller') {
    return (
      <AuthShell tag="Kênh Người Bán" background={<FloatingNotices layout="login" />}>
        {children}
      </AuthShell>
    )
  }
  if (role === 'admin') {
    return <AuthShell tag="Quản trị">{children}</AuthShell>
  }
  return <AuthShell background={<FloatingProducts />}>{children}</AuthShell>
}
