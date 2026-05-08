import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/gbc.css'
import './styles/app.css'
import { BMProvider } from './context/BMContext'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BMProvider>
      <App />
    </BMProvider>
  </StrictMode>,
)
