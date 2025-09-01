import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import { replyCreated, replyDeleted } from "@/features/replies/RepliesSlice";
import { currentUser } from "@/features/users/UsersSlice";
import { findCommentId } from "@/utils";

import type { RootState } from "@/store";

import type {
    CommentState,
    CreateCommentPayload,
    EditCommentPayload,
    DeleteCommentPayload,
    UpdateCommentScorePayload,
    CommentID
} from "./types";

import comments from '@/data/comments.json'
import { decrementScore, incrementScore } from "@/utils";

const initialState: CommentState = comments

const CommentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        commentCreated: {
            reducer: (state, action: PayloadAction<CreateCommentPayload>) => {
                state.byId[action.payload.id] = {
                    id: action.payload.id,
                    createdAt: action.payload.createdAt,
                    score: 0,
                    content: action.payload.content,
                    // this works just fine when the information about the current user is stored in a local file, but needs to be updated if it's retrieved from a remote resource.
                    username: currentUser.username,
                    replies: []
                }

                state.allId.push(action.payload.id)
            },
            prepare: (content: string) => {
                return {
                    payload: {
                        content,
                        id: nanoid(),
                        createdAt: (new Date()).toISOString()
                    }
                }
            }
        },
        commentEdited(state, action: PayloadAction<EditCommentPayload>) {
            const comment = state.byId[action.payload.id]
            comment.content = action.payload.content
        },
        commentDeleted(state, action: PayloadAction<DeleteCommentPayload>) {
            delete state.byId[action.payload.id]
            state.allId = state.allId.filter(id => action.payload.id !== id)
        },
        commentScoreIncremented(state, action: PayloadAction<UpdateCommentScorePayload>) {
            const comment = state.byId[action.payload.id]
            incrementScore(comment, action.payload.currentScore)
        },
        commentScoreDecremented(state, action: PayloadAction<UpdateCommentScorePayload>) {
            const comment = state.byId[action.payload.id]
            decrementScore(comment, action.payload.currentScore)
        }
    },
    extraReducers: builder =>
        builder
            .addCase(replyCreated, (state, action) => {
                const parentCommentId = findCommentId(state, action.payload.parentCommentId)
                
                if (parentCommentId)
                    state.byId[parentCommentId].replies.push(action.payload.id)
            })
            .addCase(replyDeleted, (state, action) => {
                const parentCommentId = findCommentId(state, action.payload.parentCommentId)

                if (parentCommentId) {
                    const parentComment = state.byId[parentCommentId]
                    parentComment.replies = parentComment.replies.filter(replyId => replyId !== action.payload.id)
                }
            })
})

export const {commentCreated, commentEdited, commentDeleted, commentScoreIncremented, commentScoreDecremented} = CommentsSlice.actions

export const selectAllCommentIds = (state: RootState) => state.comments.allId
export const selectCommentById = (state: RootState, id: CommentID) => state.comments.byId[id]

export default CommentsSlice.reducer