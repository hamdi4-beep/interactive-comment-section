import * as React from 'react'
import FormComponent from "@/components/FormComponent"
import User from '@/features/user/User'
import { useAppSelector } from '@/hooks'
import { type UserReply } from '@/features/reply/types'
import type { UserComment } from '@/features/comment/types'
import TimeAgo from 'timeago-react'
import { selectCurrentUser } from '@/features/user/UsersSlice'

const ScoreComponent = ({
    score,
    onIncrementUpdate,
    onDecrementUpdate
}: {
    score: number
    onIncrementUpdate: (currentScore: number) => void
    onDecrementUpdate: (currentScore: number) => void
}) => {
    // temporary state to track whether the user has upvoted or downvoted
    // in a real-world application, this information would be stored in a database and retrieved when needed
    const [voteIntent, setVoteIntent] = React.useState<null | 'upvote' | 'downvote'>(null)
    const currentScoreRef = React.useRef(score)
    const currentScore = currentScoreRef.current

    const handleUpvoteClick = () => {
        setVoteIntent(prev => prev === 'upvote' ? null : 'upvote')
        onIncrementUpdate(currentScore)
    }

    const handleDownvoteClick = () => {
        setVoteIntent(prev => prev === 'downvote' ? null : 'downvote')
        onDecrementUpdate(currentScore)
    }

    return (
        <div className="score-component" style={{ backgroundColor: voteIntent === 'upvote' ? 'hsl(223, 19%, 93%)' : voteIntent === 'downvote' ? 'hsl(223, 19%, 98%)' : '' }}>
            <button onClick={handleUpvoteClick}>
                <div className="icon-img">
                    <img src="/interactive-comment-section/images/icon-plus.svg" alt="" />
                </div>
            </button>

            <span>{score}</span>

            <button onClick={handleDownvoteClick}>
                <div className="icon-img">
                    <img src="/interactive-comment-section/images/icon-minus.svg" alt="" />
                </div>
            </button>
        </div>
    )
}

const UserActions = ({
    username,
    toggleReplyForm,
    toggleEditForm,
    hideModal
}: {
    username: string,
    toggleReplyForm: () => void
    toggleEditForm: () => void
    hideModal: () => void
}) => {
    const currentUser = useAppSelector(state => selectCurrentUser(state))
    const isCurrentUser = currentUser.username === username

    return (
        <div className="actions">
            {isCurrentUser ? (
                <div className="user-actions">
                    <button onClick={() => toggleEditForm()}>
                        <div className="icon-img">
                            <img src='/interactive-comment-section/images/icon-edit.svg' alt="" />
                        </div>
                
                        Edit
                    </button>

                    <button onClick={() => hideModal()}>
                        <div className="icon-img">
                            <img src='/interactive-comment-section/images/icon-delete.svg' alt="" />
                        </div>
                
                        Delete
                    </button>
                </div>
            ) : (
                <button onClick={() => toggleReplyForm()}>
                    <div className="icon-img">
                        <img src='/interactive-comment-section/images/icon-reply.svg' alt="" />
                    </div>
            
                    Reply
                </button>
            )}
        </div>
    )
}

const Card = React.memo(function Card(props: {
    item: UserComment | UserReply,
    handleReplyDispatch: (content: string) => void,
    handleEditDispatch: (content: string) => void,
    handleDeleteDispatch: () => void,
    handleIncrementScoreDispatch: (currentScore: number) => void,
    handleDecrementScoreDispatch: (currentScore: number) => void
    children: React.ReactNode
}) {
    const [isReplying, setIsReplying] = React.useState(false)
    const [isEditting, setIsEditting] = React.useState(false)
    const [isModalHidden, setIsModalHidden] = React.useState(true)

    return (
        <div className="container">
            <div className='card'>
                <ScoreComponent
                    score={props.item.score}
                    onIncrementUpdate={props.handleIncrementScoreDispatch}
                    onDecrementUpdate={props.handleDecrementScoreDispatch}
                />

                <div className="content">
                    <div className="profile-header">
                        <User username={props.item.username} />

                        <span className='comment-date'>
                            <TimeAgo datetime={props.item.createdAt} live={false} />
                        </span>

                        <UserActions
                            username={props.item.username}
                            toggleReplyForm={() => setIsReplying(prev => !prev)}
                            toggleEditForm={() => setIsEditting(prev => !prev)}
                            hideModal={() => setIsModalHidden(false)}
                        />
                    </div>

                    {props.children}
                </div>
            </div>

            {isReplying && (
                <FormComponent
                    placeholderValue='Add a reply...'
                    value={null}
                    onSubmitUpdate={content => {
                        props.handleReplyDispatch(content)
                        setIsReplying(false)
                    }}
                />
            )}

            {isEditting && (
                <FormComponent
                    placeholderValue='Edit a comment...'
                    value={props.item.content}
                    onSubmitUpdate={content => {
                        props.handleEditDispatch(content)
                        setIsEditting(false)
                    }}
                />
            )}

            {!isModalHidden && (
                <div className="modal-container">
                    <h3>Delete comment</h3>
                    <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
                    
                    <div className="buttons">
                        <button className="cancel" onClick={() => setIsModalHidden(true)}>No, Cancel</button>
                        <button className="confirm" onClick={() => props.handleDeleteDispatch()}>Yes, Confirm</button>
                    </div>
                </div>
            )}
        </div>
    )
})

export default Card