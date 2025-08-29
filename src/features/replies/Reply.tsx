import { useAppDispatch, useAppSelector } from "@/hooks"
import Card from "@/components/Card"
import { replyCreated, replyDeleted, replyEdited, replyScoreDecremented, replyScoreIncremented, replyScoreReset, selectReplyById } from "@/features/replies/RepliesSlice"
import type { UserComment } from "@/features/comments/types"
import type { UserReply } from "@/features/replies/types"
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
    const currentScoreRef = React.useRef(reply.score)
    const currentScore = currentScoreRef.current

    if (!reply)
        throw new Error(`Reply with id ${id} not found`)

    React.useEffect(() => {
        return () => {
            dispatch(replyScoreReset({ id }))
        }
    }, [])

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
                currentScore
            }))
        },
        [id, currentScore]
    )

    const decrementedReplyScoreHandler = React.useCallback(
        () => {
            dispatch(replyScoreDecremented({
                id,
                currentScore
            }))
        },
        [id, currentScore]
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