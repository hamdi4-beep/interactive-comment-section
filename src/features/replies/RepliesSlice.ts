import { createAsyncThunk, createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import { type UserComment } from "@/features/comments/CommentsSlice";
import type { RootState } from "@/store";
import { currentUser } from "@/features/users/UsersSlice";
import { fetchData } from "@/utils/util";

export type UserReply = Omit<UserComment, 'replies'> & {
    replyingTo: string,
    parentCommentId: UserComment['id']
}

type ReplyID = UserReply['id']

interface CreateReplyPayload extends Pick<UserReply, 'id' | 'parentCommentId' | 'content' | 'username' | 'createdAt'> {}
interface DeleteReplyPayload extends Pick<UserReply, 'id' | 'parentCommentId'> {}
interface EditReplyPayload extends Pick<UserReply, 'id' | 'content'> {}

interface UpdateReplyScorePayload extends Pick<UserReply, 'id'> {
    defaultScore: UserReply['score']
}

export interface ReplyState {
    byId: Record<ReplyID, UserReply>
    allId: ReplyID[]
}

export const initialState: ReplyState = {
    byId: {},
    allId: []
}

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
    },
    extraReducers(builder) {
        builder
            .addCase(fetchReplies.fulfilled, (state, action) => {
                return action.payload
            })
    }
})

export const fetchReplies = createAsyncThunk(
    'replies/fetchReplies',
    async () => await fetchData('http://localhost:3000/replies')
)

export const { replyCreated, replyEdited, replyDeleted, replyScoreIncremented, replyScoreDecremented } = RepliesSlice.actions

export const selectAllReplies = (state: RootState) => state.replies.allId
export const selectReplyById = (state: RootState, id: ReplyID) => state.replies.byId[id]

export default RepliesSlice.reducer