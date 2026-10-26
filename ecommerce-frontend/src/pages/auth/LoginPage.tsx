import { Link } from 'react-router'
import PagePlaceholder from '../../components/common/PagePlaceholder'

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <PagePlaceholder title="Đăng nhập" description="Trang khung xác thực. Biểu mẫu đăng nhập sẽ được kết nối với backend khi triển khai tính năng auth." />
      <Link to="/" className="mt-6 inline-block font-medium text-indigo-600">Về cửa hàng</Link>
    </main>
  )
}
