import { NavLink, Outlet } from 'react-router'

const links = [
  { to: '/', label: 'Cửa hàng' },
  { to: '/seller', label: 'Người bán' },
  { to: '/admin', label: 'Quản trị' },
  { to: '/login', label: 'Đăng nhập' },
]

export default function LayoutShell({ title }: { title: string }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <NavLink to="/" className="text-xl font-bold text-indigo-600">Ecommerce</NavLink>
          <nav aria-label="Điều hướng chính" className="flex flex-wrap gap-5 text-sm font-medium">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} end className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600">{title}</p>
        <Outlet />
      </main>
    </div>
  )
}
