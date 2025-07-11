import Comment from '../features/comments/Comment'
import { useAppSelector } from '../hooks'

function CommentsList() {
    const allCommentIds = useAppSelector(state => state.comments.allId)

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