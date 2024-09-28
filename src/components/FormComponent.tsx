import * as React from 'react'

import {
    currentUser,
    Context,
    CommentOrReply,
    UserComment
} from '../App'

let nextID = 3

export default function FormComponent({
    data
}: {
    data: {
        type: 'Comment' | 'Reply'
        comment?: CommentOrReply
    }
}) {
    const ctx = React.useContext(Context)

    const placeholder = {
        Comment: ['Add comment...', 'Comment'],
        Reply: ['Add reply...', 'Reply']
    } as {
        [key: string]: string[]
    }

    const getPlaceholder = (label: 'Comment' | 'Reply') => placeholder[label]
    const [text, label] = getPlaceholder(data.type)

    const comment = data.comment as UserComment

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const form = e.currentTarget as HTMLFormElement
        const [[, value]] = new FormData(form)

        const input = form['comment']
        input.value = ''

        if (!value) {
            alert('Please add a comment!')
            return
        }

        if (data.type === 'Comment') {
            const newComment = {
                id: nextID++,
                content: value as string,
                createdAt: "now",
                score: 0,
                user: currentUser,
                replies: []
            }

            ctx.setComments([
                ...ctx.comments,
                newComment
            ])
        }

        if (!comment.replies) {
            alert('The feature to reply to replies is currently being developed.')
            return
        }

        const reply = {
            id: nextID++,
            content: value as string,
            createdAt: "now",
            score: 0,
            user: currentUser
        }

        const user = comment.user

        comment.replies.push({
            ...reply,
            replyingTo: user.username
        })

        ctx.setComments(Array.from(new Set([
            ...ctx.comments,
            comment
        ])))
    }

    return (
        <div className="bg-white rounded-xl p-4 mt-4 flex gap-4 items-start">
            <div className="user-img self-start flex-shrink-0">
                <img
                    src={currentUser.image.png}
                    className="w-10 h-10"
                    alt=""
                />
            </div>

            <form action="" className="w-full" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className='p-4 pt-2 pb-20 w-full border border-[hsl(223, 19%, 93%)] outline-none rounded-md'
                    name="comment"
                    placeholder={text}
                />
                
                <button
                    className='bg-primary-moderate-blue p-2 px-4 mt-4 rounded-md text-white uppercase'
                >{label}</button>
            </form>
        </div>
    )
}