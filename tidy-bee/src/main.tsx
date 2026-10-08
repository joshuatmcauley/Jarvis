import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Admin } from './Admin.tsx'
import { trackPageview } from './track.ts'
import './styles.css'

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const isHive = path === '/hive' || path.endsWith('/hive')

if (!isHive) {
  trackPageview()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isHive ? <Admin /> : <App />}</StrictMode>,
)
