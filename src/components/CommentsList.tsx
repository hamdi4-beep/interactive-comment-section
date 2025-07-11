import Comment from '../features/comments/Comment'
import * as z from 'zod'
import { useAppSelector } from '../hooks'

const CommentIds = z.array(z.string())

function CommentsList() {
    const allCommentIds = useAppSelector(state => state.comments.allId)

    if (!CommentIds.parse(allCommentIds)) return

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