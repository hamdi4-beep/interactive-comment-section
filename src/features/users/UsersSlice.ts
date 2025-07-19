import { createSlice } from "@reduxjs/toolkit";
import data from '../../data.json'

type User = {
    image: {
        png: string
        webp: string
    }
    username: string
    role: string
}

export interface UserState {
    byUsername: {
        [x: string]: User
    }
    allUsername: string[]
}

const initialState: UserState = data.users

const UsersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {}
})

const username = initialState.allUsername.find(username => initialState.byUsername[username].role === 'currentUser') as string

export const currentUser = initialState.byUsername[username]

export default UsersSlice.reducer