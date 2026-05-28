import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src',
  base: './',
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Redirige peticiones de la API al contenedor icastaneda para conectar ambos servicios
      '/api': {
        target: 'http://icastaneda:8080', // Actualiza el puerto si es necesario
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: 'iife',
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    cssCodeSplit: false,
  },
})

