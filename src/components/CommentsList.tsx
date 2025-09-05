import Comment from '@/features/comment/Comment'
import { selectAllCommentIds } from '@/features/comment/CommentsSlice'
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