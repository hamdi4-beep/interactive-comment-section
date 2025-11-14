import { reducer } from "./reducer"
import data from './data/comments.json'
import { v4 as uuidv4 } from 'uuid'
import { Comment, CommentId } from "./context"
import { useImmerReducer } from "use-immer"

/*
    Created action-like methods that run side effects logic outside of dispatch calls which keeps state logic pure
*/

export type State = {
    byId: Record<CommentId, Comment>
    allId: CommentId[]
}

export type CreateComment = (content: Comment['content'], userId: string) => void
export type CreateReply = (commentId: CommentId, replyingTo: string, userId: string, content: Comment['content']) => void
export type EditComment = (commentId: CommentId, content: string) => void
export type DeleteComment = (commentId: CommentId) => void
export type UpdateScore = (commentId: CommentId, currentScore: number) => void

type Actions = {
    commentCreated: CreateComment
    replyCreated: CreateReply
    commentEdited: EditComment
    commentDeleted: DeleteComment
    scoreIncremented: UpdateScore
    scoreDecremented: UpdateScore
}

export function useComments() {
    const [comments, dispatch] = useImmerReducer(reducer, data)

    const actions: Actions = {
        commentCreated: (content, userId) =>
            dispatch({
                type: 'CREATE_COMMENT',
                payload: {
                    content,
                    newId: uuidv4(),
                    userId,
                    createdAt: (new Date()).toUTCString()
                }
            }),
        replyCreated: (commentId, replyingTo, userId, content) => {
            dispatch({
                type: 'CREATE_REPLY',
                payload: {
                    id: commentId,
                    newId: uuidv4(),
                    replyingTo,
                    content,
                    userId,
                    createdAt: (new Date()).toUTCString()
                }
            })
        },
        commentEdited: (id, content) =>
            dispatch({
                type: 'EDIT_COMMENT',
                payload: {
                    id,
                    content
                }
            }),
        commentDeleted: id => {
            dispatch({
                type: 'DELETE_COMMENT',
                payload: {
                    id
                }
            })
        },
        scoreIncremented: (id, currentScore) =>
            dispatch({
                type: 'INCREMENT_SCORE',
                payload: {
                    id,
                    currentScore
                }
            }),
        scoreDecremented: (id, currentScore) =>
            dispatch({
                type: 'DECREMENT_SCORE',
                payload: {
                    id,
                    currentScore
                }
            })
    }

    return {
        comments,
        actions
    }
}