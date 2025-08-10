import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vercel deployment: keep base at '/'.
// (If you later deploy to GitHub Pages, change to your repo name, e.g. '/prodpagetest/')
export default defineConfig({
  plugins: [react()],
  base: '/',
})
