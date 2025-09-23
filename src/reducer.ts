import users from './data/users.json'
import { Comment, CommentId } from './context'

interface CreateCommentPayload extends Pick<Comment, 'content'> {
    newId: string
}

interface CreateReplyPayload extends CreateCommentPayload {
    id: CommentId
    username: string
}

interface EditCommentPayload extends Pick<Comment, 'content'> {}
interface DeleteCommentPayload extends Pick<Comment, 'id'> {}

interface UpdateScorePayload {
    id: CommentId
    currentScore: number
}

type State = {
    byId: Record<CommentId, Comment>
    allId: CommentId[]
}

export function reducer(state: State, action: {
    type: string
    payload: any
}) {
    const clonedState = structuredClone(state)
    const comment = clonedState.byId[action.payload.id]

    switch (action.type) {
        case 'CREATE_COMMENT': {
            const payload = action.payload as CreateCommentPayload
            const newId = payload.newId

            clonedState.byId[newId] = {
                content: payload.content,
                score: 0,
                replies: [],
                id: newId,
                parentId: null,
                replyingTo: null,
                createdAt: 'just now',
                user: users.currentUser.username
            }

            clonedState.allId.push(newId)

            return clonedState
        }
            
        case 'CREATE_REPLY': {
            const payload = action.payload as CreateReplyPayload
            const targetId = comment?.parentId || payload.id
            const targetComment = clonedState.byId[targetId]
            
            clonedState.byId[payload.newId] = {
                content: payload.content,
                score: 0,
                replies: null,
                id: payload.newId,
                parentId: targetId,
                replyingTo: payload.username,
                createdAt: 'just now',
                user: users.currentUser.username
            }

            // prevents adding a reply to reply and instead looks up the parentComment and adds it to parentComment's replies array of references.
            targetComment.replies && targetComment.replies.push(payload.newId)
            clonedState.allId.push(payload.newId)

            return clonedState
        }

        case 'EDIT_COMMENT': {
            const payload = action.payload as EditCommentPayload
            comment.content = payload.content
            return clonedState
        }

        case 'DELETE_COMMENT': {
            const payload = action.payload as DeleteCommentPayload
            const {[payload.id]: comment, ...rest} = clonedState.byId
            clonedState.allId = clonedState.allId.filter(id => id !== comment.id)
            clonedState.byId = rest
            return clonedState
        }

        case 'INCREMENT_SCORE': {
            const payload = action.payload as UpdateScorePayload
            comment.score = comment.score === payload.currentScore ? comment.score + 1 : comment.score < payload.currentScore ? comment.score + 2 : payload.currentScore
            return clonedState
        }

        case 'DECREMENT_SCORE': {
            const payload = action.payload as UpdateScorePayload
            comment.score = comment.score === payload.currentScore ? comment.score - 1 : comment.score > payload.currentScore ? comment.score - 2 : payload.currentScore
            return clonedState
        }

        default:
            return state
    }
  }