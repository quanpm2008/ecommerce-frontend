import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

/**
 * Dev server on :3000 — the same port as the Docker image (compose.yaml), so
 * links the backend puts in emails (identity.password-reset.link-base =
 * http://localhost:3000/reset-password) open this app.
 *
 * The gateway has no routes yet, so in dev each service is proxied directly.
 * Same-origin requests also avoid CORS. When the gateway is ready, replace
 * these entries with a single '/api' → gateway proxy.
 */
const IDENTITY_URL = process.env.IDENTITY_URL ?? 'http://localhost:8083'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api/v1/identity': { target: IDENTITY_URL, changeOrigin: true },
    },
  },
})
