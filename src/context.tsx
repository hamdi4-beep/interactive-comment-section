import { createContext } from "react"
import { useComments, CreateComment, CreateReply, EditComment, DeleteComment, UpdateScore } from "./hooks"

export type Comment = {
    parentId: string | null
    id: string
    content: string
    userId: string
    score: number
    replyingTo: string | null
    replies: string[] | null
    createdAt: string
}

export type CommentId = Comment['id']

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

    return (
        <StateContext.Provider value={{comments, actions}}>
            {children}
        </StateContext.Provider>
    )
}

export default StateProvider