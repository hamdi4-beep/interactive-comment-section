import * as React from 'react'
import FormComponent from "./FormComponent"
import { useAppSelector } from '../hooks'
import { type UserReply } from '../features/replies/RepliesSlice'
import type { UserComment } from '../features/comments/CommentsSlice'
import TimeAgo from 'timeago-react'

// @ts-ignore

enum VoteDif {
    UpVoted = 1,
    DownVoted = -1,
    InitialScore = 0
}

const CurrentUserActions = (props: {
    editToggleHandler: React.MouseEventHandler
    deleteToggleHandler: React.MouseEventHandler
}) => (
    <div className="user-actions">
        <button onClick={props.editToggleHandler}>
            <div className="icon-img">
                <img src='/interactive-comment-section/images/icon-edit.svg' alt="" />
            </div>
    
            Edit
        </button>

        <button onClick={props.deleteToggleHandler}>
            <div className="icon-img">
                <img src='/interactive-comment-section/images/icon-delete.svg' alt="" />
            </div>
    
            Delete
        </button>
    </div>
)

export const ScoreComponent = ({
    score,
    onUpdate
}: {
    score: number
    onUpdate: (score: number) => void
}) => {
    const [currentVoteStatus, setCurrentVoteStatus] = React.useState<'initial' | 'upvoted' | 'downvoted'>('initial')
    const voteDiffRef = React.useRef(0)

    return (
        <div className="score-component" style={{backgroundColor: currentVoteStatus === 'upvoted' ? '#6EE7B7' : currentVoteStatus === 'downvoted' ? '#9CA3AF' : ''}}>
            <button onClick={() => {
                voteDiffRef.current = voteDiffRef.current <= 0 ? 1 : 0
                setCurrentVoteStatus(voteDiffRef.current ? 'upvoted' : 'initial')
                onUpdate(voteDiffRef.current)
            }}>
                <div className="icon-img">
                    <img src="/interactive-comment-section/images/icon-plus.svg" alt="" />
                </div>
            </button>

            <span>{score}</span>

            <button onClick={() => {
                voteDiffRef.current = voteDiffRef.current >= 0 ? -1 : 0
                setCurrentVoteStatus(voteDiffRef.current ? 'downvoted' : 'initial')
                onUpdate(voteDiffRef.current)
            }}>
                <div className="icon-img">
                    <img src="/interactive-comment-section/images/icon-minus.svg" alt="" />
                </div>
            </button>
        </div>
    )
}

// A component that's only responsible for visual appearance and structure. It shouldn't define logic or be responsible for how comments and replies behave.
// It couples the markup structure of a comment and reply element so you only have to modify them consistently from a single location.

const Card = React.memo(function Card(props: {
    item: UserComment | UserReply,
    content: React.ReactNode
    handleReplyDispatch: (content: string) => void,
    handleEditDispatch: (content: string) => void,
    handleDeleteDispatch: () => void,
    children: React.ReactNode
}) {
    const user = useAppSelector(state => state.users.byUsername[props.item.username])
    
    const [isReplying, setIsReplying] = React.useState(true)
    const [isEditting, setIsEditting] = React.useState(false)
    const [isHidden, setIsHidden] = React.useState(true)
    
    const isCurrentUser = user.role === 'currentUser'

    return (
        <div className="container">
            <div className='card'>
                {props.children}

                <div className="content">
                    <div className="profile-header">
                        <div className="user">
                            <div className="user-img">
                                <img src={'/interactive-comment-section' + user.image.png} alt="" />
                            </div>

                            <h3 className={isCurrentUser ? 'current-user' : ''}>{user.username}</h3>

                            <span className='comment-date'>
                                <TimeAgo datetime={props.item.createdAt} live={false} />
                            </span>
                        </div>

                        <div className="actions">
                            {isCurrentUser ? (
                                <CurrentUserActions
                                    editToggleHandler={() => setIsEditting(prev => !prev)}
                                    deleteToggleHandler={() => setIsHidden(false)}
                                />
                            ) : (
                                <button onClick={() => setIsReplying(prev => !prev)}>
                                    <div className="icon-img">
                                        <img src='/interactive-comment-section/images/icon-reply.svg' alt="" />
                                    </div>
                            
                                    Reply
                                </button>
                            )}
                        </div>
                    </div>

                    {props.content}
                </div>
            </div>

            {/* This keeps the current user from replying to their comment/reply which goes against the specified specs */}
            {isReplying && !isCurrentUser && (
                <FormComponent
                    placeholderValue='Add a reply...'
                    dispatchHandler={(content: string) => {
                        props.handleReplyDispatch(content)
                        setIsReplying(false)
                    }}
                />
            )}

            {isEditting && (
                <FormComponent
                    placeholderValue='Edit a comment...'
                    value={props.item.content}
                    dispatchHandler={(content: string) => {
                        props.handleEditDispatch(content)
                        setIsEditting(false)
                    }}
                />
            )}

            {!isHidden && (
                <div className="modal-container">
                    <h3>Delete comment</h3>
                    <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
                    
                    <div className="buttons">
                        <button className="cancel" onClick={() => setIsHidden(true)}>No, Cancel</button>
                        <button className="confirm" onClick={() => props.handleDeleteDispatch()}>Yes, Confirm</button>
                    </div>
                </div>
            )}
        </div>
    )
})

export default Card