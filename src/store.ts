import { configureStore } from "@reduxjs/toolkit";

import CommentsSlice from '@/features/comments/CommentsSlice'
import RepliesSlice from '@/features/replies/RepliesSlice'
import UsersSlice from '@/features/users/UsersSlice'
import { apiSlice } from "@/features/api/ApiSlice";
import { listenerMiddleware } from "@/listenerMiddleware";

export const store = configureStore({
    reducer: {
        comments: CommentsSlice,
        replies: RepliesSlice,
        users: UsersSlice,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .prepend(listenerMiddleware.middleware)
            .concat(apiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch