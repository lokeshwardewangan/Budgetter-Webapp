import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Split only modules that don't depend on React being initialized first.
        // Splitting react/react-dom into a separate chunk causes
        // "Cannot read properties of undefined (reading 'forwardRef')"
        // because some vendor modules reference React at module-eval time.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('html2canvas') || id.includes('jspdf')) return 'pdf';
          if (id.includes('framer-motion')) return 'framer';
          if (id.includes('chart.js') || id.includes('react-chartjs'))
            return 'charts';
          if (id.includes('recharts') || id.includes('d3-')) return 'recharts';
          return undefined;
        },
      },
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://mybudgetter-backend.onrender.com/api',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
});
