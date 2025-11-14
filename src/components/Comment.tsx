import { useContext, useState, useRef } from "react"
import { CommentId, StateContext } from "../context"
import UserActions from "./UserActions"
import FormComponent from "./FormComponent"
import { type Comment } from "../context"
import users from '../data/users.json'
import TimeAgo from "react-timeago"

const UserProfile = ({
  userId
}: {
  userId: string
}) => {
  const user = users.byId[userId as keyof typeof users.byId] || users.currentUser

  return (
    <div className="user-profile">
      <div className="user-avatar">
        <img src={user.image.png} alt="" />
      </div>

      <h3>{user.username}</h3>
    </div>
  )
}

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
      <button type='button' aria-label="upvote" title="Upvote a comment" onClick={handleIncrementScoreClick}>
        <div className="icon-img">
          <img src="/images/icon-plus.svg" alt="" />
        </div>
      </button>

      <span>{score}</span>

      <button type='button' aria-label="downvote" title="Downvote a comment" onClick={handleDecrementScoreClick}>
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
  const [formStatus, setFormStatus] = useState<'HIDDEN' | 'REPLYING' | 'EDITING'>('HIDDEN')
  const [isModalHidden, setIsModalHidden] = useState(true)

  const user = users.byId[comment.userId as keyof typeof users.byId]

  const handleAddReplyDispatch = (content: string) => {
    actions.replyCreated(comment.id, user.username, users.currentUser['id'], content)
    setFormStatus('HIDDEN')
  }

  const handleEditCommentDispatch = (content: string) => {
    actions.commentEdited(comment.id, content)
    setFormStatus('HIDDEN')
  }

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
            
            <span className="comment-date">
              <TimeAgo date={comment.createdAt} live={false} />
            </span>

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

      {formStatus === 'REPLYING' && (
        <FormComponent
          placeholderValue='Add reply'
          value=""
          onSubmitUpdate={handleAddReplyDispatch}
        />
      )}

      {formStatus === 'EDITING' && (
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