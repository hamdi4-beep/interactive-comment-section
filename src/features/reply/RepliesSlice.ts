import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { currentUser } from "@/features/user/UsersSlice";
import replies from '@/data/replies.json'

import type {
    CreateReplyPayload,
    EditReplyPayload,
    DeleteReplyPayload,
    UpdateReplyScorePayload,
    ResetReplyScorePayload,
    ReplyID,
    ReplyState,
} from '@/features/reply/types'
import { decrementScore, incrementScore } from "@/utils";

export const initialState: ReplyState = replies

const RepliesSlice = createSlice({
    name: 'replies',
    initialState,
    reducers: {
        replyCreated: {
            reducer(state, action: PayloadAction<CreateReplyPayload>) {
                const newReplyId = action.payload.id

                state.byId = {
                    ...state.byId,
                    [newReplyId]: {
                        id: newReplyId,
                        parentCommentId: action.payload.parentCommentId,
                        createdAt: action.payload.createdAt,
                        username: currentUser.username,
                        score: 0,
                        content: action.payload.content,
                        replyingTo: action.payload.username
                    }
                }

                state.allId.push(newReplyId)
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
            // updates the score by two if the stateful score value is less than the current score (following Reddit's scoring logic)
            incrementScore(reply, action.payload.currentScore)
        },
        replyScoreDecremented(state, action: PayloadAction<UpdateReplyScorePayload>) {
            const reply = state.byId[action.payload.id]
            // updates the score by two if the stateful score value is less than the current score (following Reddit's scoring logic)
            decrementScore(reply, action.payload.currentScore)
        },
        replyScoreReseted(state, action: PayloadAction<ResetReplyScorePayload>) {
            const reply = state.byId[action.payload.id]
            // only update the reply's score if it is included in the initial state otherwise the initial score value does not exist and this would throw an error
            if (reply && initialState.allId.includes(reply.id)) reply.score = initialState.byId[reply.id].score
        }
    }
})

export const { replyCreated, replyEdited, replyDeleted, replyScoreIncremented, replyScoreDecremented, replyScoreReseted } = RepliesSlice.actions

export const selectAllReplyIds = (state: RootState) => state.replies.allId
export const selectReplyById = (state: RootState, id: ReplyID) => state.replies.byId[id]

export default RepliesSlice.reducer