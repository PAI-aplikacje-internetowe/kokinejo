import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig((mode) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return {
    plugins: [vue()],
    server: {
      host: process.env.VITE_FRONTEND_HOST,
      port: process.env.VITE_FRONTEND_PORT,
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
  }
})
