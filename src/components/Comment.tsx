import { useContext, useState, useRef } from "react"
import { CommentId, StateContext } from "../context"
import UserActions, { UserProfile } from "./UserActions"
import FormComponent from "./FormComponent"
import { type Comment } from "../context"

const ScoreComponent = ({
  score,
  commentId
}: {
  score: number
  commentId: CommentId
}) => {
  const {actions} = useContext(StateContext)
  const currentScoreRef = useRef(score)

  const handleIncrementScoreClick = () =>
    actions.scoreIncremented(commentId, currentScoreRef.current)

  const handleDecrementScoreClick = () =>
    actions.scoreDecremented(commentId, currentScoreRef.current)

  return (
    <div className="score-component">
      <button onClick={handleIncrementScoreClick}>
        <div className="icon-img">
          <img src="/images/icon-plus.svg" alt="" />
        </div>
      </button>

      <span>{score}</span>

      <button onClick={handleDecrementScoreClick}>
        <div className="icon-img">
          <img src="/images/icon-minus.svg" alt="" />
        </div>
      </button>
    </div>
  )
}

const DeleteModal = ({
  commentId,
  hideDeleteModal
}: {
  commentId: CommentId
  hideDeleteModal: () => void
}) => {
  const {actions} = useContext(StateContext)

  const handleCancelClick = () =>
    hideDeleteModal()

  const handleConfirmClick = () =>
    actions.commentDeleted(commentId)

  return (
    <div className="modal-container">
      <h3>Delete comment</h3>
      <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
      
      <div className="buttons">
          <button className="cancel" onClick={handleCancelClick}>No, Cancel</button>
          <button className="confirm" onClick={handleConfirmClick}>Yes, Confirm</button>
      </div>
    </div>
  )
}

// This component extracts presentational logic which keeps both comments and replies visually consistent without needing to know about their differences.
const Comment = ({
  comment
}: {
  comment: Comment
}) => {
  const {actions} = useContext(StateContext)
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isModalHidden, setIsModalHidden] = useState(true)

  if (!comment) return

  const handleAddReplyDispatch = (content: string) =>
    actions.replyCreated(comment.id, comment.user, content)

  const handleEditCommentDispatch = (content: string) =>
    actions.commentEdited(comment.id, content)

  return (
    <div className="container">
      <div className="card">
        <ScoreComponent
          score={comment.score}
          commentId={comment.id}
        />

        <div className="content">
          <div className="profile-header">
            <UserProfile username={comment.user} />
            <span className="comment-date">{comment.createdAt}</span>

            <UserActions
              toggleReplyForm={() => setIsReplying(prev => !prev)}
              toggleEditForm={() => setIsEditing(prev => !prev)}
              showDeleteModal={() => setIsModalHidden(false)}
              username={comment.user}
            />
          </div>

          {comment.replyingTo ? (
            <p>
              <span className="replying-to">@{comment.replyingTo} </span>
              {comment.content}
            </p>
          ) : (
            <p>{comment.content}</p>
          )}
        </div>
      </div>

      {isReplying && (
        <FormComponent
          placeholderValue='Add reply'
          value=""
          onSubmitUpdate={handleAddReplyDispatch}
        />
      )}

      {isEditing && (
        <FormComponent
          placeholderValue=""
          value={comment.content}
          onSubmitUpdate={handleEditCommentDispatch}
        />
      )}

      {!isModalHidden && (
        <DeleteModal
          commentId={comment.id}
          hideDeleteModal={() => setIsModalHidden(true)}
        />
      )}
    </div>
  )
}

export default Comment