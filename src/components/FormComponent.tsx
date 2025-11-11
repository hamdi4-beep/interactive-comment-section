import * as React from 'react'
import users from '../data/users.json'

const CurrentUserAvatar = () => {
    const currentUser = users.currentUser

    return (
        <div className="current-user">
            <div className="user-avatar">
                <img src={currentUser.image.png} alt="" />
            </div>
        </div>
    )
}

function FormComponent({
    value = "",
    placeholderValue = "",
    onSubmitUpdate
}: {
    value: string
    placeholderValue: string
    onSubmitUpdate: (content: string) => void
}) {
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null)
    
    const handleSubmit: React.FormEventHandler = (e) => {
        e.preventDefault()
        
        const formElement = e.target as HTMLFormElement
        const formData = new FormData(formElement)

        const content = formData.get('comment')

        if (content) onSubmitUpdate(content as string)

        formElement.reset()
    }

    React.useEffect(() => {
        const textAreaElement = textAreaRef.current
        textAreaElement?.focus()
    }, [])

    return (
        <div className="form-component">
            <CurrentUserAvatar />

            <form action="#" onSubmit={handleSubmit}>
                <textarea name="comment" id="comment" defaultValue={value} placeholder={placeholderValue} ref={textAreaRef}></textarea>
                <button>Send</button>
            </form>
        </div>
    )
}

export default FormComponent