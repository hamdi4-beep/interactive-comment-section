import { configureStore } from "@reduxjs/toolkit";

import CommentsSlice from '@/features/comment/CommentsSlice'
import RepliesSlice from '@/features/reply/RepliesSlice'
import UsersSlice from '@/features/user/UsersSlice'

export const store = configureStore({
    reducer: {
        comments: CommentsSlice,
        replies: RepliesSlice,
        users: UsersSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch