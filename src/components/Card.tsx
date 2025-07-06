import * as React from 'react'
import data from '../data.json'
import FormComponent from "./FormComponent"
import { useAppSelector } from '../hooks'
import { type UserReply } from '../features/replies/RepliesSlice'
import type { UserComment } from '../features/comments/CommentsSlice'

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

const Card = React.memo(function Card(props: {
    item: UserComment | UserReply,
    handleReplyDispatch: (content: string) => void,
    handleEditDispatch: (content: string) => void,
    handleDeleteDispatch: () => void,
    handleScoreUpdateDispatch: (score: number) => void
    children: React.ReactNode
}) {
    const voteDiffRef = React.useRef(0)
    const users = useAppSelector(state => state.users)

    const [isReplying, setIsReplying] = React.useState(false)
    const [isEditting, setIsEditting] = React.useState(false)
    const [isHidden, setIsHidden] = React.useState(true)

    if (!props.item) return

    const isCurrentUser = data.currentUser == props.item.user

    return (
        <div className="container">
            <div className='card'>
                <div className="score-component">
                    <button onClick={() => {
                        voteDiffRef.current = voteDiffRef.current <= 0 ? 1 : 0
                        props.handleScoreUpdateDispatch(voteDiffRef.current)
                    }}>
                        <div className="icon-img">
                            <img src="/interactive-comment-section/images/icon-plus.svg" alt="" />
                        </div>
                    </button>

                    <span>{props.item.score}</span>

                    <button onClick={() => {
                        voteDiffRef.current = voteDiffRef.current >= 0 ? -1 : 0
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
                                <img src={'/interactive-comment-section' + users.byUsername[props.item.user].image.png} alt="" />
                            </div>

                            <h3 className={isCurrentUser ? 'current-user' : ''}>{props.item.user}</h3>

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
                        if (content) {
                            props.handleReplyDispatch(content)
                            setIsReplying(false)
                        }
                    }}
                />
            )}

            {isEditting && (
                <FormComponent
                    placeholderValue='Edit a comment...'
                    value={props.item.content}
                    dispatchHandler={(content: string) => {
                        if (content) {
                            props.handleEditDispatch(content)
                            setIsEditting(false)
                        }
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