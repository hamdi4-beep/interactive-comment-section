import { useAppDispatch, useAppSelector } from "@/hooks"
import Card from "@/components/Card"
import { replyCreated, replyDeleted, replyEdited, replyScoreDecremented, replyScoreIncremented, replyScoreReseted, selectReplyById } from "@/features/replies/RepliesSlice"
import type { CommentID } from "@/features/comments/types"
import type { ReplyID } from "@/features/replies/types"
import * as React from 'react'

const Reply = React.memo(function Reply({
    id,
    parentCommentId
}: {
    id: ReplyID
    parentCommentId: CommentID
}) {
    const dispatch = useAppDispatch()
    const reply = useAppSelector(state => selectReplyById(state, id))

    if (!reply) throw new Error(`Reply with id ${id} not found`)

    React.useEffect(() => {
        return () => {
            // prevents the score from being resetted if the reply object was deleted entirely otherwise reset the score if the component was just unmounted.
            if (reply) replyScoreReseted({ id })
        }
    }, [id])

    const replyToReplyHandler = React.useCallback(
        (content: string) =>
            dispatch(replyCreated(content, reply.username, parentCommentId)),
        [reply.username, parentCommentId]
    )

    const editReplyHandler = React.useCallback(
        (content: string) =>
            dispatch(replyEdited({
                id,
                content
            })),
        [id]
    )

    const deleteReplyHandler = React.useCallback(
        () =>
            dispatch(replyDeleted({
                id,
                parentCommentId
            })),
        [id]
    )

    const incrementReplyScoreHandler = React.useCallback(
        (currentScore: number) => {
            dispatch(replyScoreIncremented({
                id,
                currentScore
            }))
        },
        [id]
    )

    const decrementedReplyScoreHandler = React.useCallback(
        (currentScore: number) => {
            dispatch(replyScoreDecremented({
                id,
                currentScore
            }))
        },
        [id]
    )

    return (
        <div className="reply-wrapper">
            <Card
                item={reply}
                handleReplyDispatch={replyToReplyHandler}
                handleEditDispatch={editReplyHandler}
                handleDeleteDispatch={deleteReplyHandler}
                handleScoreIncrementedDispatch={incrementReplyScoreHandler}
                handleScoreDecrementedDispatch={decrementedReplyScoreHandler}
            >
                <p>
                    <span className="replying-to">@{reply.replyingTo} </span>
                    {reply.content}
                </p>
            </Card>
        </div>
    )
})

export default Reply