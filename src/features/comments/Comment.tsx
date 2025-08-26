import * as React from 'react'
import Card, { ScoreComponent } from '@/components/Card'
import Reply from '@/features/replies/Reply'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { commentDeleted, commentEdited, selectCommentById, type UserComment } from '@/features/comments/CommentsSlice'
import { replyCreated } from '@/features/replies/RepliesSlice'


const Comment = React.memo(function Comment(props: {
    id: UserComment['id']
}) {
    const dispatch = useAppDispatch()

    const [isRepliesHidden, setIsRepliesHidden] = React.useState(true)
    const comment = useAppSelector(state => selectCommentById(state, props.id))

    if (!comment) throw new Error(`Comment with id ${props.id} not found`)

    const replyToCommentHandler = React.useCallback(
        (content: string) =>
            dispatch(replyCreated(content, comment.username, comment.id)),
        [comment.username, comment.id]
    )

    const editCommentHandler = React.useCallback(
        (content: string) =>
            dispatch(commentEdited({
                id: comment.id,
                content
            })),
        [comment.id]
    )

    const deleteCommentHandler = React.useCallback(
        () =>
            dispatch(commentDeleted({
                id: comment.id
            })),
        [comment.id]
    )

    return (
        <div className="comment-wrapper">
            <Card
                item={comment}
                handleReplyDispatch={replyToCommentHandler}
                handleEditDispatch={editCommentHandler}
                handleDeleteDispatch={deleteCommentHandler}
                handleScoreUpdateDispatch={() => console.log('This triggers an update to the score functionality')}
            >
                <p>{comment.content}</p>
            </Card>

            {comment.replies.length > 0 && <button className='view-replies-btn' onClick={() => setIsRepliesHidden(prev => !prev)}>{comment.replies.length} replies</button>}

            {!isRepliesHidden && (
                <div className="replies-list">
                    {comment.replies.map(id => (
                        <Reply
                            id={id}
                            parentCommentId={comment.id}
                            key={id}
                        />
                    ))}
                </div>
            )}
        </div>
    )
})

export default Comment