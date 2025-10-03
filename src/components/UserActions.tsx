import users from '../data/users.json'

type User = {
  image: {
    png: string
    webp: string
  }
  username: string
}

export const UserProfile = ({
  userId
}: {
  userId: string
}) => {
  const user = (users.byId as Record<string, User>)[userId] || users.currentUser

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
  userId,
  toggleReplyForm,
  toggleEditForm,
  showDeleteModal
}: {
  userId: string
  toggleReplyForm: () => void
  toggleEditForm: () => void
  showDeleteModal: () => void
}) {
  // mimicks user authentication for now
  const isCurrentUser = users.currentUser.id === userId

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