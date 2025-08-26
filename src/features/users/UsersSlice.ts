import { createSelector, createSlice } from "@reduxjs/toolkit";
import users from '@/data/users.json'
import type { RootState } from "@/store";

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

const initialState: UserState = users

const UsersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {}
})

export const selectUsers = (state: RootState) => state.users
export const selectUserByUsername = (username: string) => (state: RootState) => state.users.byUsername[username]

export const selectCurrentUser = createSelector(
    selectUsers,
    users => {
        const username = users.allUsername.find(username => users.byUsername[username].role === 'currentUser')
        if (username) return users.byUsername[username]
    }
)

export default UsersSlice.reducer