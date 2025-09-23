import users from '../data/users.json'
import { useContext } from 'react'
import { StateContext } from '../context'

type User = {
  image: {
    png: string
    webp: string
  }
  username: string
}

export const UserProfile = ({
  username
}: {
  username: string
}) => {
  const user = (users.byUsername as Record<string, User>)[username] || users.currentUser

  return (
    <div className="user-profile">
      <div className="user-avatar">
        <img src={user.image.png} alt="" />
      </div>

      <h3>{user.username}</h3>
    </div>
  )
}

function UserActions({
  username,
  toggleReplyForm,
  toggleEditForm,
  showDeleteModal
}: {
  username: string
  toggleReplyForm: () => void
  toggleEditForm: () => void
  showDeleteModal: () => void
}) {
  const {actions} = useContext(StateContext)
  // mimicks user authentication for now
  const isCurrentUser = users.currentUser.username === username

  const handleReplyClick = () =>
    toggleReplyForm()

  const handleEditClick = () =>
    toggleEditForm()

  const handleDeleteClick = () =>
    showDeleteModal()

  return (
    <div className="actions">
      {!isCurrentUser && (
        <button onClick={handleReplyClick}>
          <div className="icon-img">
            <img src="/images/icon-reply.svg" alt="" />
          </div>

          Reply
        </button>
      )}

      {isCurrentUser && (
        <button onClick={handleEditClick}>
            <div className="icon-img">
              <img src="/images/icon-edit.svg" alt="" />
            </div>

            Edit
        </button>
      )}

      {isCurrentUser && (
        <button onClick={handleDeleteClick}>
            <div className="icon-img">
              <img src="/images/icon-delete.svg" alt="" />
            </div>

            Delete
        </button>
      )}
    </div>
  )
}

export default UserActions