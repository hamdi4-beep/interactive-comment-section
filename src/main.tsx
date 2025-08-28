import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App.tsx'
import '@/css/index.css'
import { ErrorBoundary } from 'react-error-boundary'
import FallbackRender from '@/components/ErrorComponent.tsx'
import { Provider } from 'react-redux'
import { store } from '@/store.ts'

function start() {
  const root = createRoot(document.getElementById('root')!)

  root.render(
    <StrictMode>
      <ErrorBoundary fallbackRender={FallbackRender}>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </StrictMode>,
  )
}

start()