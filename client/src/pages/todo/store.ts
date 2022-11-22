import Taro from "@tarojs/taro";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'
import { fetchTodoList, TodoRequest } from "./api";
import { TodoItem } from "./types";


export interface TodoState {
  list: TodoItem[];
  loading: boolean;
  total: number;
  pageNum: number;
  setValue: (key: string, value: any) => void;
  fetchTodos: (params: TodoRequest) => Promise<void>
}


const useTodoStore = create<TodoState>()(
  devtools(
    immer((set) => ({
      list: [],
      loading: false,
      total: 0,
      pageNum: 0,
      setValue: (key, value) => set((state) => {
        state[key] = value;
      }),
      fetchTodos: async ({ pageNum, pageSize }) => {
        Taro.showLoading({ title: '加载中' })
        const res = await fetchTodoList({ pageNum, pageSize })
        set((state) => ({
          list: pageNum === 0 ? res.data : state.list.concat(res.data),
          total: res.total
        }))
        Taro.hideLoading()
      },
    }))
  )
)


export default useTodoStore;
