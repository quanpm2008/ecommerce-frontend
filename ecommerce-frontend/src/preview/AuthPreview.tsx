import { useState } from 'react'
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router'
import {
  AdminLoginScreen,
  CustomerLoginScreen,
  CustomerRegisterScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
  SellerLoginScreen,
  SellerRegisterScreen,
  type AuthRole,
  type LoginValues,
} from '../features/auth'

/**
 * Mock handlers so every state in the Figma notes can be tried.
 * Type these values to trigger errors (anything else succeeds):
 */
const SCENARIOS: Record<AuthRole, string[]> = {
  customer: [
    'Đăng nhập: mật khẩu "Sai12345" → sai thông tin',
    'Đăng nhập: banned@gmail.com → tài khoản bị khóa',
    'Đăng ký: used@gmail.com → email đã dùng',
    'Đăng ký: SĐT 0900000000 → SĐT đã dùng',
    'Đăng ký: google@gmail.com → đã đăng ký bằng Google',
    'Đặt lại MK: mật khẩu "Expired1" → liên kết hết hạn',
  ],
  seller: [
    'Đăng nhập: pending@shop.com / rejected@shop.com / banned@shop.com',
    'Đăng ký: used@shop.com, tên "Shop Minh Anh", SĐT 0900000000 → trùng',
  ],
  admin: ['Đăng nhập: mật khẩu "Sai12345" → sai thông tin'],
}

const SCREENS: Record<AuthRole, { path: string; label: string }[]> = {
  customer: [
    { path: '/register', label: 'I.1 Đăng ký khách hàng' },
    { path: '/login', label: 'I.3 Đăng nhập khách hàng' },
    { path: '/forgot-password', label: 'I.6 Quên mật khẩu' },
    { path: '/reset-password', label: 'I.7 Đặt lại mật khẩu' },
    { path: '/reset-password?expired', label: 'I.7 · liên kết hết hạn' },
  ],
  seller: [
    { path: '/register', label: 'I.2 Đăng ký người bán' },
    { path: '/login', label: 'I.4 Đăng nhập người bán' },
    { path: '/forgot-password', label: 'I.6 Quên mật khẩu (seller)' },
    { path: '/reset-password', label: 'I.7 Đặt lại mật khẩu (seller)' },
  ],
  admin: [
    { path: '/login', label: 'I.5 Đăng nhập quản trị' },
    { path: '/forgot-password', label: 'I.6 Quên mật khẩu (admin)' },
    { path: '/reset-password', label: 'I.7 Đặt lại mật khẩu (admin)' },
  ],
}

const wait = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms))

async function mockLogin(role: AuthRole, { email, password }: LoginValues) {
  await wait()
  if (password === 'Sai12345') return { formError: 'Email hoặc mật khẩu không đúng.' }
  if (role === 'customer' && email === 'banned@gmail.com') {
    return { formError: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.' }
  }
  if (role === 'seller') {
    if (email === 'pending@shop.com') return { formError: 'Hồ sơ của bạn đang chờ duyệt. Kết quả sẽ được gửi qua email.' }
    if (email === 'rejected@shop.com') {
      return { formError: 'Hồ sơ đã bị từ chối: thông tin liên hệ không hợp lệ. Vui lòng gửi hồ sơ mới.' }
    }
    if (email === 'banned@shop.com') return { formError: 'Tài khoản người bán đã bị cấm: giao hàng giả nhiều lần.' }
  }
}

export default function AuthPreview() {
  const [role, setRole] = useState<AuthRole>('customer')
  const [start, setStart] = useState(SCREENS.customer[0].path)
  const [log, setLog] = useState<string>()

  return (
    <>
      <MemoryRouter key={`${role}${start}`} initialEntries={[start]}>
        <RoleRoutes role={role} onLog={setLog} />
        <Toolbar
          role={role}
          log={log}
          onPick={(nextRole, path) => {
            setRole(nextRole)
            setStart(path)
            setLog(undefined)
          }}
        />
      </MemoryRouter>
    </>
  )
}

function RoleRoutes({ role, onLog }: { role: AuthRole; onLog: (message: string) => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const shopHref = '/__customer-domain'
  // Real app navigates away in onSuccess; mimic that so popups don't stay open.
  const succeed = (message: string) => {
    onLog(message)
    navigate('/__success')
  }
  const forgot = (r: AuthRole) => (
    <ForgotPasswordScreen
      role={r}
      loginHref="/login"
      onSubmit={async (values) => {
        await wait()
        onLog(`Gửi liên kết tới ${values.email}`)
      }}
    />
  )
  const reset = (r: AuthRole) => (
    <ResetPasswordScreen
      key={location.search}
      role={r}
      linkValid={location.search !== '?expired'}
      loginHref="/login"
      forgotPasswordHref="/forgot-password"
      onSubmit={async ({ password }) => {
        await wait()
        if (password === 'Expired1') return { linkInvalid: true }
      }}
    />
  )

  return (
    <Routes>
      {role === 'customer' && (
        <>
          <Route
            path="/register"
            element={
              <CustomerRegisterScreen
                loginHref="/login"
                onGoogleSignIn={() => onLog('onGoogleSignIn()')}
                onSuccess={() => succeed('onSuccess() → chuyển đến trang chủ')}
                onSubmit={async (values) => {
                  await wait()
                  if (values.email === 'used@gmail.com') return { fieldErrors: { email: 'Email đã được sử dụng.' } }
                  if (values.phone === '0900000000') return { fieldErrors: { phone: 'Số điện thoại đã được sử dụng.' } }
                  if (values.email === 'google@gmail.com') {
                    return { formError: 'Email này đã đăng ký bằng Google. Vui lòng chọn "Tiếp tục với Google".' }
                  }
                }}
              />
            }
          />
          <Route
            path="/login"
            element={
              <CustomerLoginScreen
                registerHref="/register"
                forgotPasswordHref="/forgot-password"
                onGoogleSignIn={() => onLog('onGoogleSignIn()')}
                onSuccess={() => succeed('onSuccess() → quay về trang trước / II.1')}
                onSubmit={(values) => mockLogin('customer', values)}
              />
            }
          />
        </>
      )}
      {role === 'seller' && (
        <>
          <Route
            path="/register"
            element={
              <SellerRegisterScreen
                loginHref="/login"
                shopHref={shopHref}
                onSubmit={async (values) => {
                  await wait()
                  if (values.email === 'used@shop.com') return { fieldErrors: { email: 'Email đã có hồ sơ đang hiệu lực.' } }
                  if (values.sellerName === 'Shop Minh Anh') return { fieldErrors: { sellerName: 'Tên người bán đã được sử dụng.' } }
                  if (values.phone === '0900000000') return { fieldErrors: { phone: 'Số điện thoại đã được sử dụng.' } }
                }}
              />
            }
          />
          <Route
            path="/login"
            element={
              <SellerLoginScreen
                registerHref="/register"
                forgotPasswordHref="/forgot-password"
                shopHref={shopHref}
                onSuccess={() => succeed('onSuccess() → III.1 Tổng quan')}
                onSubmit={(values) => mockLogin('seller', values)}
              />
            }
          />
        </>
      )}
      {role === 'admin' && (
        <Route
          path="/login"
          element={
            <AdminLoginScreen
              forgotPasswordHref="/forgot-password"
              onSuccess={() => succeed('onSuccess() → IV.1 Tổng quan')}
              onSubmit={(values) => mockLogin('admin', values)}
            />
          }
        />
      )}
      <Route path="/forgot-password" element={forgot(role)} />
      <Route path="/reset-password" element={reset(role)} />
      <Route
        path="*"
        element={
          <p className="p-10 text-body text-text-2">
            {location.pathname === shopHref
              ? 'Liên kết sang tên miền khách hàng (tích hợp sẽ truyền URL thật).'
              : location.pathname === '/__success'
                ? 'onSuccess() đã được gọi — ứng dụng thật sẽ chuyển trang tại đây.'
                : `Không có màn hình cho ${location.pathname}`}
          </p>
        }
      />
    </Routes>
  )
}

function Toolbar({
  role,
  log,
  onPick,
}: {
  role: AuthRole
  log?: string
  onPick: (role: AuthRole, path: string) => void
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)
  const current = `${role}|${location.pathname}${location.search}`

  return (
    <aside className="fixed bottom-4 left-4 z-50 w-[300px] rounded-card border border-line bg-surface p-3 text-small shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <strong className="font-medium">UI preview · {role}</strong>
        <button className="text-text-3 hover:text-text" onClick={() => setOpen(!open)}>
          {open ? 'Thu gọn' : 'Mở'}
        </button>
      </div>
      {open && (
        <div className="mt-2 flex flex-col gap-2">
          <select
            className="h-9 rounded-field border border-line-strong bg-surface px-2"
            value={current}
            onChange={(event) => {
              const [nextRole, path] = event.target.value.split('|') as [AuthRole, string]
              if (nextRole === role) navigate(path)
              else onPick(nextRole, path)
            }}
          >
            {(Object.keys(SCREENS) as AuthRole[]).map((r) => (
              <optgroup key={r} label={r}>
                {SCREENS[r].map((screen) => (
                  <option key={screen.path} value={`${r}|${screen.path}`}>
                    {screen.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ul className="list-disc pl-4 text-caption text-text-2">
            {SCENARIOS[role].map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          {log && <p className="rounded-field bg-accent-soft px-2 py-1 text-caption text-accent-dark">{log}</p>}
        </div>
      )}
    </aside>
  )
}
