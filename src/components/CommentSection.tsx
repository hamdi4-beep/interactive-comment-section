import { commentCreated } from "@/features/comments/CommentsSlice";
import { useAppDispatch } from "@/hooks";
import CommentsList from "@/components/CommentsList";
import FormComponent from "@/components/FormComponent"

function CommentSection() {
    const dispatch = useAppDispatch()

    return (
        <div className="comment-section">
            <CommentsList />

            <FormComponent
                placeholderValue='Add a comment...'
                dispatchHandler={(content: string) => dispatch(commentCreated(content))}
            />
        </div>
    )
}

export default CommentSection