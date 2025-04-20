import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
const isDevelopment = process.env.NODE_ENV == 'development'
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: isDevelopment
            ? resolve(__dirname, 'src/main/dev.ts')
            : resolve(__dirname, 'src/main/index.ts')
        }
      }
    },

    resolve: {
      alias: {
        '@app': resolve('./src'),
        '@utils': resolve('./utils'),
        '@scripts': resolve('./scripts')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, './src/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    root: './src/renderer',
    build: {
      outDir: './out/windows/',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          update: resolve(__dirname, 'src/renderer/update.html'),
          '404': resolve(__dirname, 'src/renderer/404.html')
        }
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve('./src/renderer'),
        '@utils': resolve('./utils')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
