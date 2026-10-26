import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-3xl font-bold">404 — Không tìm thấy trang</h1>
      <Link to="/" className="mt-6 inline-block font-medium text-indigo-600">Về cửa hàng</Link>
    </main>
  )
}
