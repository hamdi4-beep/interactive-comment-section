import { reducer } from "./reducer"
import data from './data/comments.json'
import { v4 as uuidv4 } from 'uuid'
import { Comment, CommentId } from "./context"
import { useImmerReducer } from "use-immer"

/*
    Just keeping this here for reference. I'm going to define some "abstract" methods that update state so I don't have to track dispatch calls throughout the codebase. The easier it gets to modify the way dispatch calls work, the less time I can spend on making several changes within components that shouldn't care how state gets updated.
*/
export type State = {
    byId: Record<CommentId, Comment>
    allId: CommentId[]
}

export type CreateComment = (content: Comment['content']) => void
export type CreateReply = (commentId: CommentId, username: Comment['user'], content: Comment['content']) => void
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
        commentCreated: content =>
            dispatch({
                type: 'CREATE_COMMENT',
                payload: {
                    content,
                    newId: uuidv4()
                }
            }),
        replyCreated: (id, username, content) =>
            dispatch({
                type: 'CREATE_REPLY',
                payload: {
                    id,
                    newId: uuidv4(),
                    username,
                    content
                }
            }),
        commentEdited: (id, content) =>
            dispatch({
                type: 'EDIT_COMMENT',
                payload: {
                    id,
                    content
                }
            }),
        commentDeleted: id =>
            dispatch({
                type: 'DELETE_COMMENT',
                payload: {
                    id
                }
            }),
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