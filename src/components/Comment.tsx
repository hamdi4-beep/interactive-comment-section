import { useContext, useState, useRef } from "react"
import { CommentId, StateContext } from "../context"
import UserActions, { UserProfile } from "./UserActions"
import FormComponent from "./FormComponent"
import { type Comment } from "../context"
import users from '../data/users.json'

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

const CommentContent = ({
  comment
}: {
  comment: Comment
}) => {
  const {actions} = useContext(StateContext)
  const [formStatus, setFormStatus] = useState('')
  const [isModalHidden, setIsModalHidden] = useState(true)

  const user = users.byId[comment.userId as keyof typeof users.byId]

  const handleAddReplyDispatch = (content: string) =>
    actions.replyCreated(comment.id, user.username, users.currentUser['id'], content)

  const handleEditCommentDispatch = (content: string) =>
    actions.commentEdited(comment.id, content)

  return (
    <div className="container">
      <div className="comment">
        <ScoreComponent
          score={comment.score}
          commentId={comment.id}
        />

        <div className="content">
          <div className="profile-header">
            <UserProfile userId={comment.userId} />
            <span className="comment-date">{comment.createdAt}</span>

            <UserActions
              userId={comment.userId}
              updateFormStatus={setFormStatus}
              showDeleteModal={() => setIsModalHidden(false)}
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

      {formStatus === 'replying' && (
        <FormComponent
          placeholderValue='Add reply'
          value=""
          onSubmitUpdate={handleAddReplyDispatch}
        />
      )}

      {formStatus === 'editing' && (
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

const ReplyList = ({
  replyIds
}: {
  replyIds: CommentId[]
}) => {
  const {comments} = useContext(StateContext)

  return (
    <div className="replies-list">
      {replyIds.map(replyId => (
        <CommentContent
          comment={comments.byId[replyId]}
          key={replyId}
        />
      ))}
    </div>
  )
}

// This component extracts presentational logic which keeps both comments and replies visually consistent without needing to know about their differences.
const Comment = ({
  comment
}: {
  comment: Comment
}) => {
  return (
    <div className="thread">
      <CommentContent comment={comment} />
      
      {comment.replies && (
        <ReplyList replyIds={comment.replies} />
      )}
    </div>
  )
}

export default Comment