import { ErrorBoundary } from 'react-error-boundary'
import CommentSection from './components/CommentSection'

const FallbackComponent = ({ error }: { error: Error }) => (
  <div className="fallback-component">
    <p>Something went wrong: <strong>{error.message}</strong></p>
  </div>
)

function App() {
  return (
    <div className="App">
      <ErrorBoundary fallbackRender={FallbackComponent}>
        <CommentSection />
      </ErrorBoundary>
    </div>
  )
}

export default App