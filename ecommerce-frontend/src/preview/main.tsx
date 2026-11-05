/**
 * Dev-only UI preview (open /preview.html while `npm run dev` runs).
 * Not part of the production build: Vite only bundles index.html.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import PreviewApp from './PreviewApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PreviewApp />
  </StrictMode>,
)
