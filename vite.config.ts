import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Replace eval usage in development
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  esbuild: {
    // Disable eval in production builds
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
