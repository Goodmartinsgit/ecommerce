import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],
          // Router
          'router': ['react-router-dom'],
          // UI/Animation libraries
          'ui-vendor': ['framer-motion', 'lucide-react', 'react-icons'],
          // Utility libraries
          'utils-vendor': ['react-toastify', 'react-slick', 'swiper', 'react-confetti'],
        }
      }
    },
    // Increase warning limit slightly (optional)
    chunkSizeWarningLimit: 300,
  },
})

