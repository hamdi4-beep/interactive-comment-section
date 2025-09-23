import { createContext } from "react"
import { useComments } from "./hooks"

export type Comment = {
    parentId: string | null
    id: string
    content: string
    user: string
    score: number
    replyingTo: string | null
    replies: string[] | null
    createdAt: string
}

export type CommentId = Comment['id']

export type CreateComment = (content: Comment['content']) => void
export type CreateReply = (commentId: CommentId, username: Comment['user'], content: Comment['content']) => void
export type EditComment = (commentId: CommentId, content: string) => void
export type DeleteComment = (commentId: CommentId) => void
export type UpdateScore = (commentId: CommentId, currentScore: number) => void

export const StateContext = createContext<{
    comments: {
        byId: Record<CommentId, Comment>
        allId: CommentId[]
    },
    actions: {
        commentCreated: CreateComment,
        replyCreated: CreateReply,
        commentEdited: EditComment,
        commentDeleted: DeleteComment,
        scoreIncremented: UpdateScore,
        scoreDecremented: UpdateScore
    }
}>({
    comments: {
        byId: {},
        allId: []
    },
    actions: {
        commentCreated: () => {},
        replyCreated: () => {},
        commentEdited: () => {},
        commentDeleted: () => {},
        scoreIncremented: () => {},
        scoreDecremented: () => {}
    }
})

function StateProvider({
    children
}: {
    children: React.ReactNode
}) {
    const {comments, actions} = useComments()
    console.log(comments)

    return (
        <StateContext.Provider value={{comments, actions}}>
            {children}
        </StateContext.Provider>
    )
}

export default StateProvider