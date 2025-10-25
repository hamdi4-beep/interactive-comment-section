import users from '../data/users.json'
import { useContext } from "react";
import CommentList from "./CommentList";
import FormComponent from "./FormComponent";
import { StateContext } from "../context";

function CommentSection() {
    const {comments, actions} = useContext(StateContext)
    const currentUserId = users.currentUser['id']

    const handleSubmitUpdate = (content: string) => {
        actions.commentCreated(content, currentUserId)
        console.log(comments)
    }

    return (
        <div className="comment-section">
            <CommentList />

            <FormComponent
                value=""
                placeholderValue="Add a comment..."
                onSubmitUpdate={handleSubmitUpdate}
            />
        </div>
    )
}

export default CommentSection