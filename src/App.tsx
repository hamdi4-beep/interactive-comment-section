import { ErrorBoundary } from 'react-error-boundary'
import CommentSection from './components/CommentSection'
import { store } from './store'
import {Provider} from 'react-redux'
import FallbackRender from './components/ErrorComponent'

function App() {
  return (
    <div className="App">
      <ErrorBoundary fallbackRender={FallbackRender}>
        <Provider store={store}>
          <CommentSection />
        </Provider>
      </ErrorBoundary>
    </div>
  )
}

export default App