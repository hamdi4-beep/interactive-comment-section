import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import users from '../../data/users.json'
import type { UserState } from "./types";

const initialState: UserState = users

const UsersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {}
})

export const selectAllUsers = (state: RootState) => state.users
export const selectUserByUsername = (state: RootState, username: string) => state.users.byUsername[username]
export const selectCurrentUser = (state: RootState) => state.users.currentUser

export default UsersSlice.reducer