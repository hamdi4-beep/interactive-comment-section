import users from '../data/users.json'
import { useContext } from "react";
import CommentList from "./CommentList";
import FormComponent from "./FormComponent";
import { StateContext } from "../context";

function CommentSection() {
    const {actions} = useContext(StateContext)
    const currentUserId = users.currentUser['id']

    return (
        <div className="comment-section">
            <CommentList />

            <FormComponent
                value=""
                placeholderValue="Add a comment..."
                onSubmitUpdate={content => actions.commentCreated(content, currentUserId)}
            />
        </div>
    )
}

export default CommentSection