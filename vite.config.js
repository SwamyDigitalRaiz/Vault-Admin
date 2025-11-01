import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use absolute base path for Vercel deployment
  base: process.env.NODE_ENV === 'production' ? '/' : './',
  server: {
    port: 3001,
    open: true,
    host: true // listen on 0.0.0.0 for LAN access
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
