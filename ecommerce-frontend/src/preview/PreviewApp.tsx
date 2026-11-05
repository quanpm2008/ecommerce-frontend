import { useEffect, useState } from 'react'
import AuthPreview from './AuthPreview'
import StorefrontPreview from './StorefrontPreview'

/** /preview.html → section I (auth), /preview.html#customer → section II. */
export default function PreviewApp() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const customer = hash === '#customer'
  return (
    <>
      {customer ? <StorefrontPreview /> : <AuthPreview />}
      <a
        href={customer ? '#' : '#customer'}
        className="fixed right-4 top-[84px] z-50 rounded-full bg-text px-3.5 py-1.5 text-caption font-medium text-white shadow-lg"
      >
        {customer ? '→ Mục I (Auth)' : '→ Mục II (Khách hàng)'}
      </a>
    </>
  )
}
