import { createAsyncThunk, createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import { replyCreated, replyDeleted } from "@/features/replies/RepliesSlice";
import type { RootState } from "@/store";

export type UserComment = {
    id: string
    createdAt: string
    score: number
    content: string
    username: string
    replies: UserComment['id'][]
}

type CommentID = UserComment['id']

export interface CommentState {
    byId: Record<CommentID, UserComment>
    allId: CommentID[]
}

interface CreateCommentPayload extends Pick<UserComment, 'content' | 'createdAt' | 'id'> {}
interface DeleteCommentPayload extends Pick<UserComment, 'id'> {}
interface EditCommentPayload extends Omit<CreateCommentPayload, 'createdAt'> {}

const initialState: CommentState = {
    byId: {},
    allId: []
}

const currentUser = {
    image: { 
        png: "/images/avatars/image-juliusomo.png",
        webp: "/images/avatars/image-juliusomo.webp"
    },
    username: "juliusomo",
    role: "currentUser"
}

const findCommentId = (state: CommentState, targetId: CommentID) =>
    state.allId.find(id => targetId === id)

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
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchComments.fulfilled, (state, action) => {
                return action.payload
            })
            .addCase(replyCreated, (state, action) => {
                const commentID = findCommentId(state, action.payload.parentCommentId)
                
                if (commentID)
                    state.byId[commentID].replies.push(action.payload.id)
            })
            .addCase(replyDeleted, (state, action) => {
                const commentID = findCommentId(state, action.payload.parentCommentId)

                if (commentID)
                    state.byId[commentID].replies = state.byId[commentID].replies.filter(replyId => replyId !== action.payload.id)
            })
})

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async () => {
        try {
            const response = await fetch('http://localhost:3000/comments')
            return await response.json()
        } catch (err) {
            console.error('Something went wrong:', err)
        }
    }
)

export const {commentCreated, commentEdited, commentDeleted} = CommentsSlice.actions

export const selectAllComments = (state: RootState) => state.comments.allId
export const selectCommentById = (state: RootState, id: CommentID) => state.comments.byId[id]

export default CommentsSlice.reducer