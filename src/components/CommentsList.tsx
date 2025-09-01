import Comment from '@/features/comments/Comment'
import { selectAllCommentIds } from '@/features/comments/CommentsSlice'
import { useAppSelector } from '@/hooks'

function CommentsList() {
    const allCommentIds = useAppSelector(selectAllCommentIds)

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