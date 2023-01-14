import Taro from "@tarojs/taro";
import { TodoItem } from "./types";

export interface TodoRequest {
  pageNum?: number;
  pageSize?: number;
  keyWords?: string;
}

export interface TodoResponse {
  data: TodoItem[]
  total: number;
}
/**查询 */
export async function fetchTodoList(params: TodoRequest): Promise<TodoResponse> {
  const { pageNum = 0, pageSize = 10 } = params;
  const db = Taro.cloud.database()
  const result = await db.collection('todos').where({}).count();
  const res = await db.collection('todos').orderBy('createTime', 'desc').skip(pageNum * pageSize).limit(pageSize).get()
  return {
    data: res.data as TodoItem[],
    total: result.total,
  }
}


/**删除 */
export async function removeTodo(id: string): Promise<Taro.DB.Query.IRemoveResult> {
  const db = Taro.cloud.database()
  const res = await db.collection('todos').doc(id).remove({})
  return res
}

/**添加 */
export async function addTodo(item: Pick<TodoItem, 'description'>): Promise<Taro.DB.Query.IAddResult> {
  const db = Taro.cloud.database()
  const res = await db.collection('todos').add({ data: { ...item, createTime: db.serverDate() } })
  return res
}
