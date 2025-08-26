import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import { type UserComment } from "@/features/comments/CommentsSlice";
import replies from '@/data/replies.json'
import type { RootState } from "@/store";

export type UserReply = Omit<UserComment, 'replies'> & {
    replyingTo: string,
    parentCommentId: UserComment['id']
}

type ReplyID = UserReply['id']

interface CreateReplyPayload extends Pick<UserReply, 'content' | 'username' | 'createdAt' | 'id' | 'parentCommentId'> {}
interface DeleteReplyPayload extends Pick<UserReply, 'id' | 'parentCommentId'> {}
interface EditReplyPayload extends Pick<CreateReplyPayload, 'content' | 'id'> {}

export interface ReplyState {
    byId: Record<ReplyID, UserReply>
    allId: ReplyID[]
}

export const initialState: ReplyState = replies

const currentUser = {
    image: { 
        png: "/images/avatars/image-juliusomo.png",
        webp: "/images/avatars/image-juliusomo.webp"
    },
    username: "juliusomo",
    role: "currentUser"
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
        }
    }
})

export const { replyCreated, replyEdited, replyDeleted } = RepliesSlice.actions

export const selectAllReplies = (state: RootState) => state.replies.allId
export const selectReplyById = (id: ReplyID) => (state: RootState) => state.replies.byId[id]

export default RepliesSlice.reducer