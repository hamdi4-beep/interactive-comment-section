import * as React from 'react'

import FormComponent from './FormComponent'
import Comment from './Comment'

import { 
    Context
 } from '../App'

export default function CommentSection() {
    const {comments} = React.useContext(Context)

    return (
        <div className='grid gap-4'>
            {comments.map((comment, i) => {
                const replies = comment.replies

                return (
                    <div key={i}>
                        <Comment
                            data={comment}
                        />
                        
                        {replies.length > 0 && (
                            <div className='grid gap-4 p-4 pr-0 ml-14'>
                                {replies.map((reply, i) => (
                                    <Comment
                                        data={reply}
                                        key={i}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )})
            }

            <FormComponent data={{
                type: 'Comment'
            }} />
        </div>
    )
}