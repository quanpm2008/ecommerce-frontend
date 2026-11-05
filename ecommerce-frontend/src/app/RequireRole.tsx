import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { accessDenied } from '../features/auth/integration'
import type { AuthRole } from '../features/auth'
import { useSession } from '../services/session'

/**
 * Guards the seller/admin areas: no session, or a profile that may not use
 * this app → that app's login page (which remembers where to come back).
 * The backend still checks every request; this only avoids empty screens.
 */
export default function RequireRole({ role, children }: { role: Exclude<AuthRole, 'customer'>; children: ReactNode }) {
  const current = useSession()
  const location = useLocation()
  if (!current || accessDenied(role, current.profile)) {
    return <Navigate to={`/${role}/login`} replace state={{ from: location.pathname + location.search }} />
  }
  return children
}
