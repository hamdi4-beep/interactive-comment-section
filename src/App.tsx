import CommentSection from './components/CommentSection'
import StateProvider from './context'

function App() {
  return (
    <div className="App">
      <StateProvider>
        <CommentSection />
      </StateProvider>
    </div>
  )
}

export default App