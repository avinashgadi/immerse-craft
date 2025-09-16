import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate 3D libraries into their own chunk
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          // Separate UI libraries
          'ui': ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-avatar'],
          // Separate animation libraries
          'animations': ['framer-motion'],
          // Separate form libraries
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
    // Enable compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Enable gzip compression
  preview: {
    port: 8080,
  },
}));
