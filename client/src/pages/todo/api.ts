import Taro from "@tarojs/taro";
import { TodoItem } from "./todoSlice";

interface TodoRequest {
  pageNum: number;
  pageSize?: number;
  keyWords?: string;
}

export interface TodoResponse {
  data: TodoItem[]
  total: number;
}

export async function fetchTodos({ pageNum, pageSize = 10, keyWords }: TodoRequest): Promise<TodoResponse> {
  const db = Taro.cloud.database()
  const result = await db.collection('todos').count()
  const res = await db.collection('todos').skip(pageNum * pageSize).limit(pageSize).get()
  return {
    data: res.data as TodoItem[],
    total: result.total,
  }
}
