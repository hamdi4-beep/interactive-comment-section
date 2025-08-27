import { useAppDispatch, useAppSelector } from "@/hooks"
import Card from "@/components/Card"
import { replyCreated, replyDeleted, replyEdited, replyScoreDecremented, replyScoreIncremented, selectReplyById, type UserReply } from "@/features/replies/RepliesSlice"
import type { UserComment } from "@/features/comments/CommentsSlice"
import * as React from 'react'

const Reply = React.memo(function Reply({
    id,
    parentCommentId
}: {
    id: UserReply['id']
    parentCommentId: UserComment['id']
}) {
    const dispatch = useAppDispatch()
    const reply = useAppSelector(state => selectReplyById(state, id))
    const previousScoreRef = React.useRef(reply.score)
    const previousScore = previousScoreRef.current

    if (!reply) throw new Error(`Reply with id ${id} not found`)

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
        () => {
            dispatch(replyScoreIncremented({
                id,
                defaultScore: previousScore
            }))
        },
        [id, previousScore]
    )

    const decrementedReplyScoreHandler = React.useCallback(
        () => {
            dispatch(replyScoreDecremented({
                id,
                defaultScore: previousScore
            }))
        },
        [id, previousScore]
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