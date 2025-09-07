import * as React from 'react'
import Card from '@/components/Card'
import Reply from '@/features/reply/Reply'
import { useAppDispatch, useAppSelector } from '@/hooks'

import type { UserComment } from './types'

import {
    commentDeleted,
    commentEdited,
    commentScoreDecremented,
    commentScoreIncremented,
    selectCommentById
} from '@/features/comment/CommentsSlice'

import { replyCreated } from '@/features/reply/RepliesSlice'
import { selectCurrentUser } from '../user/UsersSlice'

const Comment = React.memo(function Comment({
    id
}: {
    id: UserComment['id']
}) {
    const currentUser = useAppSelector(state => selectCurrentUser(state))
    const dispatch = useAppDispatch()

    const [isRepliesHidden, setIsRepliesHidden] = React.useState(true)
    const comment = useAppSelector(state => selectCommentById(state, id))

    if (!comment) throw new Error(`Comment with id ${id} not found`)

    const createReplyHandler = React.useCallback(
        (content: string) =>
            dispatch(replyCreated(content, currentUser.username, comment.username, id)),
        [comment.username, id]
    )

    const editCommentHandler = React.useCallback(
        (content: string) =>
            dispatch(commentEdited({
                id,
                content
            })),
        [id]
    )

    const deleteCommentHandler = React.useCallback(
        () =>
            dispatch(commentDeleted({
                id
            })),
        [id]
    )

    const incrementCommentScoreHandler = React.useCallback(
        (currentScore: number) => {
            dispatch(commentScoreIncremented({
                id,
                currentScore
            }))
        }, [id]
    )

    const decrementCommentScoreHandler = React.useCallback(
        (currentScore: number) => {
            dispatch(commentScoreDecremented({
                id,
                currentScore
            }))
        }, [id]
    )

    return (
        <div className="comment-wrapper">
            <Card
                item={comment}
                handleReplyDispatch={createReplyHandler}
                handleEditDispatch={editCommentHandler}
                handleDeleteDispatch={deleteCommentHandler}
                handleIncrementScoreDispatch={incrementCommentScoreHandler}
                handleDecrementScoreDispatch={decrementCommentScoreHandler}
            >
                <p>{comment.content}</p>
            </Card>

            {comment.replies.length > 0 && <button className='view-replies-btn' onClick={() => setIsRepliesHidden(prev => !prev)}>{comment.replies.length} replies</button>}

            {!isRepliesHidden && (
                <div className="replies-list">
                    {comment.replies.map(replyId => (
                        <Reply
                            id={replyId}
                            parentCommentId={id}
                            key={replyId}
                        />
                    ))}
                </div>
            )}
        </div>
    )
})

export default Comment