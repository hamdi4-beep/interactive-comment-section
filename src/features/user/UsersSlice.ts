import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import users from '@/data/users.json'

type User = {
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

const initialState: UserState = users

const UsersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {}
})

export const selectAllUsers = (state: RootState) => state.users
export const selectUserByUsername = (state: RootState, username: string) => state.users.byUsername[username]
export const selectCurrentUser = (state: RootState) => state.users.currentUser

// temporarily exports the local currentUser when the data is available locally
export const currentUser = users.currentUser

export default UsersSlice.reducer