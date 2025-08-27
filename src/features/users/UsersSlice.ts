import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import users from '@/data/users.json'

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
export const selectUserByUsername = (state: RootState, username: string) => state.users.byUsername[username]

export const selectCurrentUser = createSelector(
    selectUsers,
    users => {
        const username = users.allUsername.find(username => users.byUsername[username].role === 'currentUser')!
        return users.byUsername[username]
    }
)

export const currentUser = users.byUsername['juliusomo']

export default UsersSlice.reducer