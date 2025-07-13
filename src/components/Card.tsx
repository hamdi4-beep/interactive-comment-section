import * as React from 'react'
import FormComponent from "./FormComponent"
import { useAppSelector } from '../hooks'
import { type UserReply } from '../features/replies/RepliesSlice'
import type { UserComment } from '../features/comments/CommentsSlice'

// @ts-ignore

enum VoteDif {
    UpVoted = 1,
    DownVoted = -1,
    InitialScore = 0
}

const CurrentUserActions = (props: {
    handleEditToggle: React.MouseEventHandler
    handleDeleteToggle: React.MouseEventHandler
}) => (
    <div className="user-actions">
        <button onClick={props.handleEditToggle}>
            <div className="icon-img">
                <img src='/interactive-comment-section/images/icon-edit.svg' alt="" />
            </div>
    
            Edit
        </button>

        <button onClick={props.handleDeleteToggle}>
            <div className="icon-img">
                <img src='/interactive-comment-section/images/icon-delete.svg' alt="" />
            </div>
    
            Delete
        </button>
    </div>
)

// A component that's only responsible for visual appearance and structure. It shouldn't define logic or be responsible for how comments and replies behave.
// It couples the markup structure of a comment and reply element so you only have to modify them consistently from a single location.

const Card = React.memo(function Card(props: {
    item: UserComment | UserReply,
    handleReplyDispatch: (content: string) => void,
    handleEditDispatch: (content: string) => void,
    handleDeleteDispatch: () => void,
    handleScoreUpdateDispatch: (score: number) => void
    children: React.ReactNode
}) {
    const voteDiffRef = React.useRef<VoteDif>(0)
    const user = useAppSelector(state => state.users.byUsername[props.item.user])

    const [isReplying, setIsReplying] = React.useState(false)
    const [isEditting, setIsEditting] = React.useState(false)
    const [isHidden, setIsHidden] = React.useState(true)

    const [currentVote, setCurrentVote] = React.useState(0)

    if (!props.item) return

    const isCurrentUser = user.role === 'currentUser'

    return (
        <div className="container">
            <div className='card'>
                <div className="score-component" style={{background: currentVote === 1 ? 'hsl(265, 60%, 70%)' : currentVote === -1 ? 'hsl(20, 70%, 55%)' : ''}}>
                    <button onClick={() => {
                        voteDiffRef.current = voteDiffRef.current <= 0 ? VoteDif.UpVoted : VoteDif.InitialScore
                        setCurrentVote(voteDiffRef.current)
                        props.handleScoreUpdateDispatch(voteDiffRef.current)
                    }}>
                        <div className="icon-img">
                            <img src="/interactive-comment-section/images/icon-plus.svg" alt="" />
                        </div>
                    </button>

                    <span>{props.item.score}</span>

                    <button onClick={() => {
                        voteDiffRef.current = voteDiffRef.current >= 0 ? VoteDif.DownVoted : VoteDif.InitialScore
                        setCurrentVote(voteDiffRef.current)
                        props.handleScoreUpdateDispatch(voteDiffRef.current)
                    }}>
                        <div className="icon-img">
                            <img src="/interactive-comment-section/images/icon-minus.svg" alt="" />
                        </div>
                    </button>
                </div>

                <div className="content">
                    <div className="profile-header">
                        <div className="user">
                            <div className="user-img">
                                <img src={'/interactive-comment-section' + user.image.png} alt="" />
                            </div>

                            <h3 className={isCurrentUser ? 'current-user' : ''}>{user.username}</h3>
                            <span className="comment-date">{props.item.createdAt}</span>
                        </div>

                        <div className="actions">
                            {isCurrentUser ? (
                                <CurrentUserActions
                                    handleEditToggle={() => setIsEditting(prev => !prev)}
                                    handleDeleteToggle={() => setIsHidden(false)}
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

                    {props.children}
                </div>
            </div>

            {isReplying && (
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