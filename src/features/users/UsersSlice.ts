import { createSlice } from "@reduxjs/toolkit";
import data from '../../data.json'

interface User {
    byUsername: {
        [x: string]: {
            image: {
                png: string
                webp: string
            }
            username: string
            role: string
        }
    }
    allUsername: string[]
}

const initialUsersState: User = data.users

const UsersSlice = createSlice({
    name: 'users',
    initialState: initialUsersState,
    reducers: {}
})

export default UsersSlice.reducer