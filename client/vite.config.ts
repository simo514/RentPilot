import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — cached aggressively, changes rarely
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // State management
          'vendor-state': ['zustand', 'axios'],
          // UI / date utilities
          'vendor-ui': ['lucide-react', 'react-toastify', 'react-calendar', 'dompurify'],
          // DOMPurify kept with UI; html2pdf is now a dynamic import so it won't appear here
        },
      },
    },
  },
});
