import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on the mode (development, production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    
    // This 'define' section correctly makes your Supabase keys 
    // available to your app on import.meta.env
    define: {
      'import.meta.env.VITE_SUPABASE_URL': `"${env.VITE_SUPABASE_URL}"`,
      'import.meta.env.VITE_SUPABASE_ANON_KEY': `"${env.VITE_SUPABASE_ANON_KEY}"`,
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
