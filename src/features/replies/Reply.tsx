import { useAppDispatch, useAppSelector } from "../../hooks"
import Card from "../../components/Card"
import { replyCreated, replyDeleted, replyEdited, replyScoreUpdated, type UserReply } from "./RepliesSlice"
import type { UserComment } from "../comments/CommentsSlice"
import * as React from 'react'

const Reply = React.memo(function Reply({
    id,
    parentId
}: {
    id: UserReply['id']
    parentId: UserComment['id']
}) {
    const dispatch = useAppDispatch()
    const reply = useAppSelector(state => state.replies.byId[id])

    const replyToReplyHandler = React.useCallback(
        (content: string) =>
            dispatch(replyCreated(content, reply.username, parentId)),
        []
    )

    const editReplyHandler = React.useCallback(
        (content: string) =>
            dispatch(replyEdited({
                replyId: id,
                content
            })),
        []
    )

    const deleteReplyHandler = React.useCallback(
        () =>
            dispatch(replyDeleted({
                replyId: id,
                parentId
            })),
        []
    )

    const updateReplyScoreHandler = React.useCallback(
        (voteDiff: number) =>
            dispatch(replyScoreUpdated({
                replyId: id,
                score: reply.score + voteDiff
            })),
        []
    )

    return (
        <div className="reply-wrapper">
            <Card
                item={reply}
                replyDispatchHandler={replyToReplyHandler}
                editDispatchHandler={editReplyHandler}
                deleteDispatchHandler={deleteReplyHandler}
                scoreUpdateDispatchHandler={updateReplyScoreHandler}
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