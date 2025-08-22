import { useEffect } from 'react'
import Comment from '../features/comments/Comment'
import { selectAllComments } from '../features/comments/CommentsSlice'
import { useAppSelector } from '../hooks'

function CommentsList() {
    const allCommentIds = useAppSelector(selectAllComments)

    // Mocking a pretty basic fetch request to ensure data is retreived without issues
    useEffect(() => {
        const fetchAllComments = async () => {
            try {
                const response = await fetch('http://localhost:3000/comments')
                return await response.json()
            } catch (err) {
                console.error(err)
            }
        }

        fetchAllComments().then(console.log)
    }, [])

    return (
        <div className="comments-list">
            {allCommentIds.map(id => (
                <Comment
                    id={id}
                    key={id}
                />
            ))}
        </div>
    )
}

export default CommentsList