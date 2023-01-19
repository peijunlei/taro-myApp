import Taro from "@tarojs/taro";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'
import { fetchTodoList, TodoRequest } from "./api";
import { TodoItem } from "./types";


export interface TodoState {
  list: TodoItem[];
  loading: boolean;
  total: number;
  pageNum: number;
  pageSize: number;
  top: number;
  showTop: boolean;
  tabKey: string | number;
  setValue: (key: string, value: any) => void;
  fetchTodos: (params: TodoRequest) => Promise<void>
}


const useTodoStore = create<TodoState>()(
  devtools(
    immer((set, get) => ({
      list: [],
      loading: false,
      total: 0,
      pageNum: 0,
      pageSize: 10,
      top: 0,
      tabKey: 'all',
      showTop: false,
      setValue: (key, value) => set((state) => {
        state[key] = value;
      }),
      fetchTodos: async ({ pageNum, pageSize = 10 }) => {
        Taro.showLoading({ title: '加载中' })
        const complete = get().tabKey === 'all' ? undefined : get().tabKey === 1
        const res = await fetchTodoList({ pageNum, pageSize, complete })
        const result = res.result as { data: TodoItem[], total: number }
        set((state) => ({
          list: pageNum === 0 ? result.data : state.list.concat(result.data),
          total: result.total
        }))
        Taro.hideLoading()
      },
    }))
  )
)


export default useTodoStore;
