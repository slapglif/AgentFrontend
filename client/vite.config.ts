import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import checker from 'vite-plugin-checker';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: true, overlay: false }),
    runtimeErrorOverlay(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      clientPort: 443,
      host: '0.0.0.0',
      protocol: 'wss',
      path: '/@hmr',
      timeout: 10000,
      overlay: false,
    },
    watch: {
      usePolling: true,
      interval: 500,
    },
    cors: true,
    strictPort: true,
  },
  optimizeDeps: {
    include: ['@radix-ui/react-icons', 'lucide-react'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    sourcemap: true,
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  esbuild: {
    target: 'esnext',
  },
});
