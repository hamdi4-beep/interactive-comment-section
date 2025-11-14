import users from '../data/users.json'

function UserActions({
  userId,
  updateFormStatus,
  showDeleteModal
}: {
  userId: string
  updateFormStatus: React.Dispatch<React.SetStateAction<string>>
  showDeleteModal: () => void
}) {
  // mimicks user authentication for now
  const isCurrentUser = users.currentUser.id === userId

  const handleDeleteClick = () =>
    showDeleteModal()

  return (
    <div className="actions">
      {!isCurrentUser && (
        <button onClick={() => updateFormStatus(prev => prev === 'replying' ? '' : 'replying')}>
          <div className="icon-img">
            <img src="/images/icon-reply.svg" alt="" />
          </div>

          Reply
        </button>
      )}

      {isCurrentUser && (
        <button onClick={() => updateFormStatus(prev => prev === 'editing' ? '' : 'editing')}>
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