import { commentCreated } from '../features/comment/CommentsSlice'
import { useAppDispatch, useAppSelector } from "../hooks";
import CommentsList from "../components/CommentsList";
import FormComponent from "../components/FormComponent"
import { selectCurrentUser } from "../features/user/UsersSlice";

function CommentSection() {
    const currentUser = useAppSelector(state => selectCurrentUser(state))
    const dispatch = useAppDispatch()

    return (
        <div className="comment-section">
            <CommentsList />

            <FormComponent
                placeholderValue='Add a comment...'
                onSubmitUpdate={content => dispatch(commentCreated(content, currentUser.username))}
            />
        </div>
    )
}

export default CommentSection