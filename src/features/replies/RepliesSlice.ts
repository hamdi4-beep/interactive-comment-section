import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { currentUser } from "@/features/users/UsersSlice";
import replies from '@/data/replies.json'

import type {
    CreateReplyPayload,
    EditReplyPayload,
    DeleteReplyPayload,
    UpdateReplyScorePayload,
    ReplyID,
    ReplyState
} from '@/features/replies/types'

export const initialState: ReplyState = replies

const RepliesSlice = createSlice({
    name: 'replies',
    initialState,
    reducers: {
        replyCreated: {
            reducer(state, action: PayloadAction<CreateReplyPayload>) {
                state.byId[action.payload.id] = {
                    id: action.payload.id,
                    parentCommentId: action.payload.parentCommentId,
                    createdAt: action.payload.createdAt,
                    username: currentUser.username,
                    score: 0,
                    content: action.payload.content,
                    replyingTo: action.payload.username
                }

                state.allId.push(action.payload.id)
            },
            prepare(content: string, username: string, parentCommentId: string) {
                return {
                    payload: {
                        content,
                        id: nanoid(),
                        username,
                        parentCommentId,
                        createdAt: (new Date()).toISOString()
                    }
                }
            }
        },
        replyEdited(state, action: PayloadAction<EditReplyPayload>) {
            const reply = state.byId[action.payload.id]
            reply.content = action.payload.content
        },
        replyDeleted(state, action: PayloadAction<DeleteReplyPayload>) {
            delete state.byId[action.payload.id]
            state.allId = state.allId.filter(id => action.payload.id !== id)
        },
        replyScoreIncremented(state, action: PayloadAction<UpdateReplyScorePayload>) {
            const reply = state.byId[action.payload.id]
            reply.score = action.payload.defaultScore === reply.score ? reply.score + 1 : action.payload.defaultScore
        },
        replyScoreDecremented(state, action: PayloadAction<UpdateReplyScorePayload>) {
            const reply = state.byId[action.payload.id]
            reply.score = action.payload.defaultScore === reply.score ? reply.score - 1 : action.payload.defaultScore
        }
    }
})

export const { replyCreated, replyEdited, replyDeleted, replyScoreIncremented, replyScoreDecremented } = RepliesSlice.actions

export const selectAllReplies = (state: RootState) => state.replies.allId
export const selectReplyById = (state: RootState, id: ReplyID) => state.replies.byId[id]

export default RepliesSlice.reducer