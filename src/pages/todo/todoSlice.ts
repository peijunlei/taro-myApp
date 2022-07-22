import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Taro from '@tarojs/taro';
// Define a type for the slice state
export interface TodoItem {
  id: string;
  desc?: string;
  createTime?: string;
  complete?: boolean;
  updateTime?: string;
}
export interface TodoState {
  list: TodoItem[];
  loading: boolean;
}
const list: TodoItem[] = Array(100).fill(0).map((v, index) => {
  return {
    id: index + "",
    desc: `测试数据${index + 1}`,
    createTime: new Date().toLocaleString(),
    updateTime: new Date().toLocaleString(),
    complete: false,
  }
})
// Define the initial state using that type
const initialState: TodoState = {
  list: [],
  loading: false
}

export const TodoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<TodoItem>) => {
      state.list.push(action.payload);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const item = state.list.find(v => v.id === action.payload)
      item && (item.complete = !item.complete)
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      const index = state.list.findIndex(v => v.id === action.payload)
      if (index > -1) {
        state.list.splice(index, 1)
      }
    },
    toggleLoading: (state) => {
      state.loading = !state.loading
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodoList.fulfilled, (state, action) => {
      state.list = action.payload
    })
  },
})

export const fetchTodoList = createAsyncThunk('todo/fetchTodoList',
  async (pageNum: number, { dispatch }) => {
    dispatch(toggleLoading())
    Taro.showLoading({ title: "加载中..." })
    return new Promise<TodoItem[]>((resolve, _) => {
      setTimeout(() => {
        dispatch(toggleLoading())
        Taro.hideLoading()
        resolve(list.slice(0, pageNum * 10))
        // resolve([])

      }, 2000);
    })
  }
)


export const { addTodo, toggleTodo, removeTodo, toggleLoading } = TodoSlice.actions
export default TodoSlice.reducer