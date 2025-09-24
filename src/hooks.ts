import { useCallback, useReducer } from "react"
import { reducer } from "./reducer"
import data from './data/comments.json'
import { v4 as uuidv4 } from 'uuid'
import { Comment, CommentId, CreateComment, CreateReply, DeleteComment, EditComment, UpdateScore } from "./context"
import { useImmerReducer } from "use-immer"

/*
    Just keeping this here for reference. I'm going to define some "abstract" methods that update state so I don't have to track dispatch calls throughout the codebase. The easier it gets to modify the way dispatch calls work, the less time I can spend on making several changes within components that shouldn't care how state gets updated.
*/
export type State = {
    byId: Record<CommentId, Comment>
    allId: CommentId[]
}

export function useComments() {
    const [comments, dispatch] = useImmerReducer(reducer, data)

    const commentCreated: CreateComment = useCallback(
        content =>
            dispatch({
                type: 'CREATE_COMMENT',
                payload: {
                    content,
                    newId: uuidv4()
                }
            }),
        []
    )

    const replyCreated: CreateReply = useCallback(
        (id, username, content) =>
            dispatch({
                type: 'CREATE_REPLY',
                payload: {
                    id,
                    newId: uuidv4(),
                    username,
                    content
                }
            }),
        []
    )

    const commentEdited: EditComment = useCallback(
        (id, content) =>
            dispatch({
                type: 'EDIT_COMMENT',
                payload: {
                    id,
                    content
                }
            }),
        []
    )

    const commentDeleted: DeleteComment = useCallback(
        id =>
            dispatch({
                type: 'DELETE_COMMENT',
                payload: {
                    id
                }
            }),
        []
    )

    const scoreIncremented: UpdateScore = useCallback(
        (id, currentScore) =>
            dispatch({
                type: 'INCREMENT_SCORE',
                payload: {
                    id,
                    currentScore
                }
            }),
        []
    )

    const scoreDecremented: UpdateScore = useCallback(
        (id, currentScore) =>
            dispatch({
                type: 'DECREMENT_SCORE',
                payload: {
                    id,
                    currentScore
                }
            }),
        []
    )

    return {
        comments,
        actions: {
            scoreIncremented,
            scoreDecremented,
            commentCreated,
            replyCreated,
            commentEdited,
            commentDeleted
        }
    }
}