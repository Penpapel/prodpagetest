import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If deploying to GitHub Pages at https://<user>.github.io/prodpagetest/
// keep base as '/prodpagetest/'. If using a custom domain or root, set base: '/'.
export default defineConfig({
  plugins: [react()],
  base: '/prodpagetest/'
})
