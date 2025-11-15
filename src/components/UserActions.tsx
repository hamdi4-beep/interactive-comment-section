import users from '../data/users.json'

function UserActions({
  userId,
  updateFormStatus,
  showDeleteModal
}: {
  userId: string
  updateFormStatus: React.Dispatch<React.SetStateAction<'HIDDEN' | 'REPLYING' | 'EDITING'>>
  showDeleteModal: () => void
}) {
  // mimicks user authentication for now
  const isCurrentUser = users.currentUser.id === userId

  const handleDeleteClick = () =>
    showDeleteModal()

  return (
    <div className="actions">
      {!isCurrentUser && (
        <button onClick={() => updateFormStatus(prev => prev === 'REPLYING' ? 'HIDDEN' : 'REPLYING')}>
          <div className="icon-img">
            <img src="/interactive-comment-section/images/icon-reply.svg" alt="" />
          </div>

          Reply
        </button>
      )}

      {isCurrentUser && (
        <button onClick={() => updateFormStatus(prev => prev === 'EDITING' ? 'HIDDEN' : 'EDITING')}>
            <div className="icon-img">
              <img src="/interactive-comment-section/images/icon-edit.svg" alt="" />
            </div>

            Edit
        </button>
      )}

      {isCurrentUser && (
        <button onClick={handleDeleteClick}>
            <div className="icon-img">
              <img src="/interactive-comment-section/images/icon-delete.svg" alt="" />
            </div>

            Delete
        </button>
      )}
    </div>
  )
}

export default UserActions