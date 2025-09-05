import { useAppSelector } from "@/hooks"
import { selectCurrentUser, selectUserByUsername } from "./UsersSlice"

function User({
    username
}: {
    username: string
}) {
    const currentUser = useAppSelector(state => selectCurrentUser(state))
    const user = useAppSelector(state => selectUserByUsername(state, username))

    const userAvatarPath = currentUser.username === username ? currentUser.image.png : user.image.png;

    return (
        <div className="user">
            <div className="user-img">
                <img src={'/interactive-comment-section' + userAvatarPath} alt="" />
            </div>

            <h3 className={currentUser.username === username ? 'current-user' : ''}>{username}</h3>
        </div>
    )
}

export default User