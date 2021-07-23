import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 8080
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        /* chunkFileNames: (id) => {
                console.log(id);
                return 'assets/[name].js'
        }, */
        assetFileNames: 'assets/[name].[ext]',
        format: 'es',
      },
    },
  },
})
