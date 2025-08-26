import { useAppDispatch, useAppSelector } from "@/hooks"
import Card, { ScoreComponent } from "@/components/Card"
import { replyCreated, replyDeleted, replyEdited, replyScoreUpdated, selectReplyById, type UserReply } from "@/features/replies/RepliesSlice"
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
    const reply = useAppSelector(selectReplyById(id))

    if (!reply) throw new Error(`Reply with id ${id} not found`)

    const replyToReplyHandler = React.useCallback(
        (content: string) =>
            dispatch(replyCreated(content, reply.username, parentCommentId)),
        [reply.username, parentCommentId]
    )

    const editReplyHandler = React.useCallback(
        (content: string) =>
            dispatch(replyEdited({
                replyId: id,
                content
            })),
        [id]
    )

    const deleteReplyHandler = React.useCallback(
        () =>
            dispatch(replyDeleted({
                replyId: id,
                parentCommentId
            })),
        [id]
    )

    const updateReplyScoreHandler = React.useCallback(
        (voteDiff: number) =>
            dispatch(replyScoreUpdated({
                replyId: id,
                score: reply.score + voteDiff
            })),
        [id]
    )

    return (
        <div className="reply-wrapper">
            <Card
                item={reply}
                content={<p><span className="replying-to">@{reply.replyingTo} </span>{reply.content}</p>}
                handleReplyDispatch={replyToReplyHandler}
                handleEditDispatch={editReplyHandler}
                handleDeleteDispatch={deleteReplyHandler}
            >
                <ScoreComponent score={reply.score} onUpdate={updateReplyScoreHandler} />
            </Card>
        </div>
    )
})

export default Reply