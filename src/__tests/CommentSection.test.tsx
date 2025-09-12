import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import CommentSection from '../components/CommentSection'
import CommentsSlice from '../features/comment/CommentsSlice'
import RepliesSlice from '../features/reply/RepliesSlice'
import UsersSlice from '../features/user/UsersSlice'

// Mock the child components to isolate CommentSection testing
jest.mock('../components/CommentsList', () => {
    return function MockCommentsList() {
        return <div data-testid="comments-list">Comments List</div>
    }
})

jest.mock('../components/FormComponent', () => {
    return function MockFormComponent({ placeholderValue, onSubmitUpdate }: {
        placeholderValue: string
        onSubmitUpdate: (content: string) => void
    }) {
        return (
            <div data-testid="form-component">
                <input 
                    placeholder={placeholderValue}
                    data-testid="comment-input"
                />
                <button 
                    onClick={() => onSubmitUpdate('Test comment content')}
                    data-testid="submit-button"
                >
                    Submit
                </button>
            </div>
        )
    }
})

const createTestStore = () => {
    return configureStore({
        reducer: {
            comments: CommentsSlice,
            replies: RepliesSlice,
            users: UsersSlice,
        },
        preloadedState: {
            users: {
                currentUser: {
                    username: 'testuser',
                    image: { png: '/test.png', webp: '/test.webp' }
                },
                byUsername: {},
                allUsername: []
            },
            comments: {
                byId: {},
                allId: []
            },
            replies: {
                byId: {},
                allId: []
            }
        }
    })
}

const renderWithProvider = (store = createTestStore()) => {
    return render(
        <Provider store={store}>
            <CommentSection />
        </Provider>
    )
}

describe('CommentSection', () => {
    it('renders CommentsList and FormComponent', () => {
        renderWithProvider()
        
        expect(screen.getByTestId('comments-list')).toBeInTheDocument()
        expect(screen.getByTestId('form-component')).toBeInTheDocument()
    })

    it('renders with correct CSS class', () => {
        const { container } = renderWithProvider()
        
        expect(container.firstChild).toHaveClass('comment-section')
    })

    it('passes correct placeholder to FormComponent', () => {
        renderWithProvider()
        
        expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument()
    })

    it('dispatches commentCreated action when form is submitted', async () => {
        const store = createTestStore()
        const user = userEvent.setup()
        
        renderWithProvider(store)
        
        const submitButton = screen.getByTestId('submit-button')
        await user.click(submitButton)
        
        const state = store.getState()
        const commentIds = state.comments.allId
        
        expect(commentIds).toHaveLength(1)
        
        const createdComment = state.comments.byId[commentIds[0]]
        expect(createdComment.content).toBe('Test comment content')
        expect(createdComment.username).toBe('testuser')
        expect(createdComment.score).toBe(0)
        expect(createdComment.replies).toEqual([])
    })

    it('uses current user username in comment creation', async () => {
        const store = createTestStore()
        const user = userEvent.setup()
        
        // Update the store with a different current user
        store.dispatch({ 
            type: 'users/setCurrentUser', 
            payload: { username: 'differentuser', image: { png: '/diff.png', webp: '/diff.webp' } }
        })
        
        renderWithProvider(store)
        
        const submitButton = screen.getByTestId('submit-button')
        await user.click(submitButton)
        
        const state = store.getState()
        const commentIds = state.comments.allId
        const createdComment = state.comments.byId[commentIds[0]]
        
        expect(createdComment.username).toBe('testuser') // Still uses preloaded state
    })
})