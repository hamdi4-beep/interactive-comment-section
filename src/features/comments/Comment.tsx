import * as React from 'react'
import Card from '../../components/Card'
import Reply from '../replies/Reply'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { commentDeleted, commentEdited, commentScoreUpdated, type UserComment } from './CommentsSlice'
import { replyCreated } from '../replies/RepliesSlice'


const Comment = React.memo(function Comment(props: {
    id: UserComment['id']
}) {
    const dispatch = useAppDispatch()

    const [isRepliesHidden, setIsRepliesHidden] = React.useState(true)
    const comment = useAppSelector(state => state.comments.byId[props.id])

    if (!comment) return

    const replyToCommentHandler = React.useCallback(
        (content: string) =>
            dispatch(replyCreated(content, comment.username, comment.id)),
        [comment.username, comment.id]
    )

    const editCommentHandler = React.useCallback(
        (content: string) =>
            dispatch(commentEdited({
                commentId: comment.id,
                content
            })),
        [comment.id]
    )

    const deleteCommentHandler = React.useCallback(
        () =>
            dispatch(commentDeleted({
                commentId: comment.id
            })),
        [comment.id]
    )

    const updateCommentScoreHandler = React.useCallback(
        (voteDiff: number) =>
            dispatch(commentScoreUpdated({
                commentId: comment.id,
                score: comment.score + voteDiff
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
                handleScoreUpdateDispatch={updateCommentScoreHandler}
            >
                <p>{comment.content}</p>
            </Card>

            {comment.replies.length > 0 && <button className='view-replies-btn' onClick={() => setIsRepliesHidden(prev => !prev)}>{comment.replies.length} replies</button>}

            {!isRepliesHidden && (
                <div className="replies-list">
                    {comment.replies.map(id => (
                        <Reply
                            id={id}
                            parentId={comment.id}
                            key={id}
                        />
                    ))}
                </div>
            )}
        </div>
    )
})

export default Comment