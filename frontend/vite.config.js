import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig((mode) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  const host = process.env.VITE_FRONTEND_HOST || "0.0.0.0";
  const port = process.env.VITE_FRONTEND_PORT || 8080;

  return {
    plugins: [vue()],
    server: {
      host: host,
      port: port,
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
