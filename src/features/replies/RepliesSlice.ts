import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import { type UserComment } from "../comments/CommentsSlice";
import data from '../../data.json'
import { currentUser } from "../users/UsersSlice";

export type UserReply = Omit<UserComment, 'replies'> & {
    replyingTo: string,
    parentId: UserComment['id']
}

type ReplyID = UserReply['id']

interface CreateReplyPayload {
    replyId: ReplyID
    content: string
    username: string
    parentId: UserComment['id'],
    createdAt: string
}

interface EditReplyPayload {
    replyId: ReplyID
    content: string
}

interface DeleteReplyPayload {
    replyId: ReplyID
    parentId: UserComment['id']
}

interface UpdateReplyScorePayload {
    replyId: ReplyID
    score: number
}

export interface ReplyState {
    byId: Record<ReplyID, UserReply>
    allId: ReplyID[]
}

export const initialState: ReplyState = data.replies

const RepliesSlice = createSlice({
    name: 'replies',
    initialState,
    reducers: {
        replyCreated: {
            reducer(state, action: PayloadAction<CreateReplyPayload>) {
                state.byId[action.payload.replyId] = {
                    id: action.payload.replyId,
                    parentId: action.payload.parentId,
                    createdAt: action.payload.createdAt,
                    username: currentUser.username,
                    score: 0,
                    content: action.payload.content,
                    replyingTo: action.payload.username
                }

                state.allId.push(action.payload.replyId)
            },
            prepare(content: string, username: string, parentId: string) {
                return {
                    payload: {
                        content,
                        replyId: nanoid(),
                        username,
                        parentId,
                        createdAt: (new Date()).toISOString()
                    }
                }
            }
        },
        replyEdited(state, action: PayloadAction<EditReplyPayload>) {
            const reply = state.byId[action.payload.replyId]
            reply.content = action.payload.content
        },
        replyDeleted(state, action: PayloadAction<DeleteReplyPayload>) {
            delete state.byId[action.payload.replyId]
            state.allId = state.allId.filter(id => action.payload.replyId !== id)
        },
        replyScoreUpdated(state, action: PayloadAction<UpdateReplyScorePayload>) {
            const reply = state.byId[action.payload.replyId]
            reply.score = action.payload.score
        }
    }
})

export const { replyCreated, replyEdited, replyDeleted, replyScoreUpdated } = RepliesSlice.actions

export default RepliesSlice.reducer