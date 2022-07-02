import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import todoReducer from '@/pages/todo/todoSlice';
export const store = configureStore({
  reducer: {
    todoReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

