import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/fishbook/',   // ← replace 'fishbook' with your exact repo name
})
