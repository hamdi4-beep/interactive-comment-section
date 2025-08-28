import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { CommentState } from '../comments/CommentsSlice'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
    endpoints: builder => ({
        getComments: builder.query<CommentState, void>({
            query: () => '/comments'
        })
    })
})

export const {useGetCommentsQuery} = apiSlice