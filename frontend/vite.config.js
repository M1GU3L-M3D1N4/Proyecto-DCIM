import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración del servidor de desarrollo y del plugin que transforma React/JSX.
export default defineConfig({
  plugins: [react()],
  server: {
    // Redirige las llamadas /api al backend local durante el desarrollo.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
