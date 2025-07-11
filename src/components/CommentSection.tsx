import { commentCreated } from "../features/comments/CommentsSlice";
import { useAppDispatch } from "../hooks";
import CommentsList from "./CommentsList";
import ErrorBoundary from "./ErrorBoundary";
import FormComponent from "./FormComponent";

function CommentSection() {
    const dispatch = useAppDispatch()

    return (
        <ErrorBoundary>
            <div className="comment-section">
                <CommentsList />

                <FormComponent
                    placeholderValue='Add a comment...'
                    dispatchHandler={(content: string) => dispatch(commentCreated(content))}
                />
            </div>
        </ErrorBoundary>
    )
}

export default CommentSection