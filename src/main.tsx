import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import StateProvider from './context'
import './index.css'

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <StrictMode>
    <StateProvider>
      <App />
    </StateProvider>
  </StrictMode>,
)
