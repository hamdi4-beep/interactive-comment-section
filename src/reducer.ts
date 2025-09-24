import users from './data/users.json'
import { Comment, CommentId } from './context'
import { State } from './hooks'
import { Draft } from 'immer'

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

export function reducer(draft: Draft<State>, action: {
    type: string
    payload: any
}) {
    const comment = draft.byId[action.payload.id]

    switch (action.type) {
        case 'CREATE_COMMENT': {
            const payload = action.payload as CreateCommentPayload
            const newId = payload.newId

            draft.byId[newId] = {
                content: payload.content,
                score: 0,
                replies: [],
                id: newId,
                parentId: null,
                replyingTo: null,
                createdAt: 'just now',
                user: users.currentUser.username
            }

            draft.allId.push(newId)

            break
        }
            
        case 'CREATE_REPLY': {
            const payload = action.payload as CreateReplyPayload
            const targetId = comment?.parentId || payload.id
            const targetComment = draft.byId[targetId]
            
            draft.byId[payload.newId] = {
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
            draft.allId.push(payload.newId)

            break
        }

        case 'EDIT_COMMENT': {
            const payload = action.payload as EditCommentPayload
            comment.content = payload.content
            break
        }

        case 'DELETE_COMMENT': {
            const payload = action.payload as DeleteCommentPayload
            const {[payload.id]: comment, ...rest} = draft.byId
            draft.allId = draft.allId.filter(id => id !== comment.id)
            draft.byId = rest
            break
        }

        case 'INCREMENT_SCORE': {
            const payload = action.payload as UpdateScorePayload
            comment.score = comment.score === payload.currentScore ? comment.score + 1 : comment.score < payload.currentScore ? comment.score + 2 : payload.currentScore
            break
        }

        case 'DECREMENT_SCORE': {
            const payload = action.payload as UpdateScorePayload
            comment.score = comment.score === payload.currentScore ? comment.score - 1 : comment.score > payload.currentScore ? comment.score - 2 : payload.currentScore
            break
        }

        default:
            break
    }
  }