import { useAppDispatch, useAppSelector } from "@/hooks"
import Card from "@/components/Card"
import { replyCreated, replyDeleted, replyEdited, replyScoreDecremented, replyScoreIncremented, replyScoreReseted, selectReplyById } from "@/features/reply/RepliesSlice"
import type { CommentID } from "@/features/comment/types"
import type { ReplyID } from "@/features/reply/types"
import * as React from 'react'
import { selectCurrentUser } from "../user/UsersSlice"

const Reply = React.memo(function Reply({
    id,
    parentCommentId
}: {
    id: ReplyID
    parentCommentId: CommentID
}) {
    const currentUser = useAppSelector(state => selectCurrentUser(state))
    const dispatch = useAppDispatch()
    const reply = useAppSelector(state => selectReplyById(state, id))

    if (!reply) throw new Error(`Reply with id ${id} not found`)

    React.useEffect(() => {
        return () => {
            dispatch(replyScoreReseted({ id }))
        }
    }, [id])

    const createReplyHandler = React.useCallback(
        (content: string) =>
            dispatch(replyCreated(content, currentUser.username, reply.username, parentCommentId)),
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

    const decremetReplyScoreHandler = React.useCallback(
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
                handleReplyDispatch={createReplyHandler}
                handleEditDispatch={editReplyHandler}
                handleDeleteDispatch={deleteReplyHandler}
                handleIncrementScoreDispatch={incrementReplyScoreHandler}
                handleDecrementScoreDispatch={decremetReplyScoreHandler}
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