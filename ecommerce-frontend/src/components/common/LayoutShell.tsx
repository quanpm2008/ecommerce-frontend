import { NavLink, Outlet, useNavigate } from 'react-router'
import { logout } from '../../services/api/identity'
import { useSession } from '../../services/session'

const links = [
  { to: '/', label: 'Cửa hàng' },
  { to: '/seller', label: 'Người bán' },
  { to: '/admin', label: 'Quản trị' },
]

/**
 * Temporary frame for the placeholder home/dashboard pages until sections
 * II–IV are wired. Shows who is signed in so the auth flow can be tested.
 */
export default function LayoutShell({ title, loginPath = '/login' }: { title: string; loginPath?: string }) {
  const current = useSession()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <NavLink to="/" className="text-h2 text-accent-dark">
            sàn<span className="text-accent">.</span>
          </NavLink>
          <nav aria-label="Điều hướng chính" className="flex flex-wrap items-center gap-5 text-body">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) => (isActive ? 'font-medium text-accent' : 'text-text-2 hover:text-text')}
              >
                {label}
              </NavLink>
            ))}
            {current ? (
              <>
                <span className="text-text">{current.profile.fullName}</span>
                <button
                  type="button"
                  className="text-text-2 hover:text-text"
                  onClick={async () => {
                    await logout().catch(() => undefined)
                    navigate(loginPath)
                  }}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <NavLink to={loginPath} className="text-text-2 hover:text-text">
                Đăng nhập
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="mb-3 text-small font-semibold uppercase tracking-wider text-accent">{title}</p>
        {current && (
          <p className="mb-6 text-small text-text-2">
            Đăng nhập: {current.profile.email} · vai trò: {current.profile.roles.join(', ') || '(chưa có)'}
          </p>
        )}
        <Outlet />
      </main>
    </div>
  )
}
