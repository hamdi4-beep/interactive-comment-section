import Comment from '@/features/comments/Comment'
import { selectAllComments } from '@/features/comments/CommentsSlice'
import { useAppSelector } from '@/hooks'

function CommentsList() {
    const allCommentIds = useAppSelector(selectAllComments)

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