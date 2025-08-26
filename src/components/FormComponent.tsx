import * as React from 'react'
import { useAppSelector } from '@/hooks'

const textAreaRef = React.createRef<HTMLTextAreaElement>()

function FormComponent(props: {
    value?: string
    placeholderValue: string
    dispatchHandler: Function
}) {
    const user = useAppSelector(state => {
        const username = state.users.allUsername.find(username => state.users.byUsername[username].role === 'currentUser')
        if (username) return state.users.byUsername[username]
    })

    if (!user) return
    
    const handleSubmit: React.FormEventHandler = e => {
        e.preventDefault()
        
        const formElement = e.target as HTMLFormElement
        const formData = new FormData(formElement)

        const content = formData.get('comment') as string

        if (content) props.dispatchHandler(content)

        formElement.reset()
    }

    React.useEffect(() => {
        const textAreaElement = textAreaRef.current
        textAreaElement?.focus()
    }, [])

    return (
        <div className="form-component">
            <div className="current-user">
                <div className="user-img">
                    <img src={'/interactive-comment-section' + user.image.png} alt="" />
                </div>
            </div>

            <form action="#" onSubmit={handleSubmit}>
                <textarea name="comment" id="comment" defaultValue={props.value} placeholder={props.placeholderValue} ref={textAreaRef}></textarea>
                <button>Send</button>
            </form>
        </div>
    )
}

export default FormComponent