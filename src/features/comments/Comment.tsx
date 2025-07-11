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
    const allReplyIds = useAppSelector(state => state.replies.allId)

    const replyToCommentHandler = React.useCallback(
        (content: string) =>
            dispatch(replyCreated(content, comment.user, comment.id)),
        []
    )

    const editCommentHandler = React.useCallback(
        (content: string) =>
            dispatch(commentEdited({
                commentId: props.id,
                content
            })),
        []
    )

    const deleteCommentHandler = React.useCallback(
        () =>
            dispatch(commentDeleted({
                commentId: props.id
            })),
        []
    )

    const updateCommentScoreHandler = React.useCallback(
        (voteDiff: number) =>
            dispatch(commentScoreUpdated({
                commentId: props.id,
                score: comment.score + voteDiff
            })),
        []
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
                    {comment.replies.map(id => {
                        if (allReplyIds.find(replyId => replyId === id))
                            return (
                                <Reply
                                    id={id}
                                    parentCommentId={comment.id}
                                    key={id}
                                />
                            )
                    })}
                </div>
            )}
        </div>
    )
})

export default Comment