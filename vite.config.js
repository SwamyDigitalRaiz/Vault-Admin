import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 3001,
    open: true,
    host: true // listen on 0.0.0.0 for LAN access
  }
})
