export type UserComment = {
    id: string
    createdAt: string
    score: number
    content: string
    username: string
    replies: UserComment['id'][]
}

export type CommentID = UserComment['id']

export interface CommentState {
    byId: Record<CommentID, UserComment>
    allId: CommentID[]
}

export interface CreateCommentPayload extends Pick<UserComment, 'id' | 'username' | 'content' | 'createdAt'> {}
export interface DeleteCommentPayload extends Pick<UserComment, 'id'> {}
export interface EditCommentPayload extends Pick<UserComment, 'id' | 'content'> {}

export interface UpdateCommentScorePayload extends Pick<UserComment, 'id'> {
    currentScore: number
}