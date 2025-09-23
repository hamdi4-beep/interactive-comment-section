import { useContext } from "react"
import { StateContext } from "../context"
import Comment from "./Comment"

function CommentList() {
  const {comments} = useContext(StateContext)
  const commentIds = comments.allId.filter(id => !comments.byId[id].parentId)

  return (
    <div className="comments-list">
      {commentIds.map(id => {
        const comment = comments.byId[id]

        return (
          <div className="comment" key={id}>
            <Comment comment={comment} />

            <div className="replies-list">
              {comment.replies && comment.replies.map(replyId => (
                <Comment
                  comment={comments.byId[replyId]}
                  key={replyId}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CommentList