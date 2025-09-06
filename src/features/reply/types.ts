import type { UpdateCommentScorePayload, UserComment } from "@/features/comment/types"

export type UserReply = Omit<UserComment, 'replies'> & {
    replyingTo: string,
    parentCommentId: UserComment['id']
}

export type ReplyID = UserReply['id']

export interface CreateReplyPayload extends Pick<UserReply, 'id' | 'parentCommentId' | 'content' | 'username' | 'replyingTo' | 'createdAt'> {}
export interface DeleteReplyPayload extends Pick<UserReply, 'id' | 'parentCommentId'> {}
export interface EditReplyPayload extends Pick<UserReply, 'id' | 'content'> {}
export interface UpdateReplyScorePayload extends UpdateCommentScorePayload {}
export interface ResetReplyScorePayload extends Omit<UpdateReplyScorePayload, 'currentScore'> {}

export interface ReplyState {
    byId: Record<ReplyID, UserReply>
    allId: ReplyID[]
}