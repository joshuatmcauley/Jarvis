import react from '@vitejs/plugin-react'
import { loadEnv, defineConfig, type Plugin } from 'vite'
import {
  handleCollect,
  handleLogin,
  handleLogout,
  handleStats,
} from './server/routes.ts'

function analyticsDev(): Plugin {
  return {
    name: 'tidy-bee-analytics',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] || ''
        const run = async () => {
          if (url === '/api/collect') await handleCollect(req, res)
          else if (url === '/api/login') await handleLogin(req, res)
          else if (url === '/api/logout') await handleLogout(req, res)
          else if (url === '/api/stats') await handleStats(req, res)
          else next()
        }
        void run().catch(next)
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  return {
    base: process.env.BASE_PATH || '/',
    plugins: [react(), analyticsDev()],
    server: {
      host: true,
      port: 5173,
    },
    preview: {
      host: true,
      port: 4173,
    },
  }
})
