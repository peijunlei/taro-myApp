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
}
const list: TodoItem[] = [
  {
    id: "1",
    desc: "测试数据1",
    createTime: new Date().toLocaleString(),
    updateTime: new Date().toLocaleString(),
    complete: false,
  },
  {
    id: "2",
    desc: "测试数据2",
    createTime: new Date().toLocaleString(),
    updateTime: new Date().toLocaleString(),
    complete: false,
  }
]
// Define the initial state using that type
const initialState: TodoState = {
  list: []
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodoList.fulfilled, (state, action) => {
      state.list = action.payload
    })
  },
})

export const fetchTodoList = createAsyncThunk('todo/fetchTodoList',
  async (pageSize: number, thunkAPI) => {
    Taro.showLoading({ title: "加载中..." })
    return new Promise<TodoItem[]>((resolve, _) => {
      setTimeout(() => {
        resolve(list)
        Taro.hideLoading()
      }, 2000);
    })
  }
)


export const { addTodo, toggleTodo, removeTodo } = TodoSlice.actions
export default TodoSlice.reducer