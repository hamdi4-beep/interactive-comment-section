export type User = {
    image: {
        png: string
        webp: string
    }
    username: string
}

export interface UserState {
    currentUser: User
    byUsername: {
        [x: string]: User
    }
    allUsername: string[]
}