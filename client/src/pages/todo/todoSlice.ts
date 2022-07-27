import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Taro from '@tarojs/taro';
import { fetchTodos, TodoResponse } from './api';
// Define a type for the slice state
export interface TodoItem {
  _id: string;
  title: string;
  createTime: string;
  complete?: boolean;
  updateTime: string;
}
export interface TodoState {
  list: TodoItem[];
  loading: boolean;
  total: number;
  pageNum: number;
}
// Define the initial state using that type
const initialState: TodoState = {
  list: [],
  total: 0,
  pageNum: 0,
  loading: false
}

export const TodoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    clean: (state) => {
      Object.assign(state, initialState)

    },
    addTodo: (state, action: PayloadAction<TodoItem>) => {
      state.list.push(action.payload);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const item = state.list.find(v => v._id === action.payload)
      item && (item.complete = !item.complete)
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      const index = state.list.findIndex(v => v._id === action.payload)
      if (index > -1) {
        state.list.splice(index, 1)
      }
    },
    changePageNum: (state, action: PayloadAction<number>) => {
      state.pageNum = action.payload
    },
    toggleLoading: (state) => {
      state.loading = !state.loading
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodoList.fulfilled, (state, action) => {
      state.list = state.pageNum === 0 ? action.payload.data : state.list.concat(action.payload.data)
      state.total = action.payload.total
    })
  },
})


export const { addTodo, toggleTodo, removeTodo, toggleLoading, changePageNum, clean } = TodoSlice.actions
export default TodoSlice.reducer

export const fetchTodoList = createAsyncThunk<TodoResponse, number>('todo/fetchTodoList',
  async (pageNum, { dispatch }) => {
    dispatch(toggleLoading())
    dispatch(changePageNum(pageNum))
    Taro.showLoading({ title: "加载中..." })
    const res = await fetchTodos({ pageNum })
    Taro.hideLoading()
    dispatch(toggleLoading())
    return res
  }
)